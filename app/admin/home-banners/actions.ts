"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin/auth";
import { revalidateAdminRoutes } from "@/lib/admin/revalidate";
import { homeBannerFormSchema } from "@/lib/admin/schemas";
import {
  inferExtension,
  uploadToStorage,
  UploadValidationError,
} from "@/lib/admin/storage";
import { HOME_BANNER_SLOTS, isStoredBannerImageUrl } from "@/lib/home/hero-slides";
import { createAdminClient } from "@/lib/supabase/admin";
import type { HomeHeroSlideSlot } from "@/types/database";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function parseBannerForm(formData: FormData, slot: HomeHeroSlideSlot) {
  const prefix = `slide_${slot}_`;
  const file = formData.get(`${prefix}image_file`);
  const raw = {
    href: formData.get(`${prefix}href`) ?? "",
    show_in_main: formData.get(`${prefix}show_in_main`) === "on",
    show_in_popup: formData.get(`${prefix}show_in_popup`) === "on",
    background_image_url: formData.get(`${prefix}background_image_url`) ?? "",
    has_new_image: file instanceof File && file.size > 0,
  };
  return homeBannerFormSchema.safeParse(raw);
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

  for (const slot of HOME_BANNER_SLOTS) {
    const parsed = parseBannerForm(formData, slot);
    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.issues[0]?.message ??
          `배너 ${slot}번 입력값이 올바르지 않습니다.`,
      };
    }

    const values = parsed.data;
    let backgroundUrl = values.background_image_url?.trim() || null;
    if (backgroundUrl && !isStoredBannerImageUrl(backgroundUrl)) {
      backgroundUrl = null;
    }

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

    const hasImage = Boolean(backgroundUrl);
    const href = values.href.trim() || "/";

    const { data: existing } = await admin
      .from("home_hero_slides")
      .select("tagline, main_headline, subtitle")
      .eq("slot", slot)
      .maybeSingle();

    const prev = existing as {
      tagline?: string;
      main_headline?: string;
      subtitle?: string | null;
    } | null;

    const payload = {
      href,
      background_image_url: backgroundUrl,
      is_active: hasImage,
      show_in_main: hasImage ? values.show_in_main : false,
      show_in_popup: hasImage ? values.show_in_popup : false,
      tagline: prev?.tagline ?? "",
      main_headline: prev?.main_headline ?? "",
      subtitle: prev?.subtitle ?? null,
    };

    const { error } = await admin
      .from("home_hero_slides")
      .upsert({ slot, ...payload } as never, { onConflict: "slot" });

    if (error) {
      return { ok: false, error: error.message };
    }
  }

  const { error: touchError } = await admin
    .from("home_hero_settings")
    .update({ popup_enabled: false } as never)
    .eq("id", 1);

  if (touchError) {
    return { ok: false, error: touchError.message };
  }

  revalidatePath("/");
  revalidateAdminRoutes("/admin/home-banners");
  return { ok: true };
}
