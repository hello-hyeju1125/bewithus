"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import {
  homeHeroSettingsFormSchema,
  homeHeroSlideFormSchema,
} from "@/lib/admin/schemas";
import {
  inferExtension,
  uploadToStorage,
  UploadValidationError,
} from "@/lib/admin/storage";
import { createAdminClient } from "@/lib/supabase/admin";
import type { HomeHeroSlideSlot } from "@/types/database";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

const SLOTS: HomeHeroSlideSlot[] = [1, 2];

function parseSlideForm(formData: FormData, slot: HomeHeroSlideSlot) {
  const prefix = `slide_${slot}_`;
  const raw = {
    tagline: formData.get(`${prefix}tagline`),
    main_headline: formData.get(`${prefix}main_headline`),
    subtitle: formData.get(`${prefix}subtitle`) ?? "",
    href: formData.get(`${prefix}href`),
    background_image_url: formData.get(`${prefix}background_image_url`) ?? "",
    is_active: formData.get(`${prefix}is_active`) === "on",
  };
  return homeHeroSlideFormSchema.safeParse(raw);
}

export async function updateHomeHeroSlidesAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  const admin = createAdminClient();

  const settingsParsed = homeHeroSettingsFormSchema.safeParse({
    cta_label: formData.get("cta_label"),
    popup_enabled: formData.get("popup_enabled") === "on",
  });
  if (!settingsParsed.success) {
    return {
      ok: false,
      error:
        settingsParsed.error.issues[0]?.message ??
        "CTA 문구 입력값이 올바르지 않습니다.",
    };
  }

  const { error: settingsError } = await admin
    .from("home_hero_settings")
    .upsert(
      {
        id: 1,
        cta_label: settingsParsed.data.cta_label,
        popup_enabled: settingsParsed.data.popup_enabled,
      } as never,
      { onConflict: "id" },
    );
  if (settingsError) {
    return { ok: false, error: settingsError.message };
  }

  for (const slot of SLOTS) {
    const parsed = parseSlideForm(formData, slot);
    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.issues[0]?.message ??
          `배너 ${slot}번 입력값이 올바르지 않습니다.`,
      };
    }
    const values = parsed.data;

    let backgroundUrl =
      values.background_image_url?.trim() || null;

    const file = formData.get(`slide_${slot}_image_file`);
    try {
      if (file instanceof File && file.size > 0) {
        const ext = inferExtension(file);
        const path = `slot-${slot}/${crypto.randomUUID()}.${ext}`;
        const { publicUrl } = await uploadToStorage({
          bucket: "home-heroes",
          path,
          file,
          upsert: true,
        });
        backgroundUrl = publicUrl;
      }
    } catch (e) {
      return {
        ok: false,
        error:
          e instanceof UploadValidationError
            ? e.message
            : e instanceof Error
              ? e.message
              : `배너 ${slot}번 이미지 업로드 중 오류가 발생했습니다.`,
      };
    }

    const payload = {
      tagline: values.tagline,
      main_headline: values.main_headline,
      subtitle: values.subtitle?.trim() ? values.subtitle.trim() : null,
      href: values.href,
      background_image_url: backgroundUrl,
      is_active: values.is_active,
    };

    const { error } = await admin
      .from("home_hero_slides")
      .upsert({ slot, ...payload } as never, { onConflict: "slot" });

    if (error) {
      return { ok: false, error: error.message };
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/home-banners");
  return { ok: true };
}
