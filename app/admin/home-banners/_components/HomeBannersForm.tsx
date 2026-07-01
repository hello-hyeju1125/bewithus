"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

import { updateHomeHeroSlidesAction } from "@/app/admin/home-banners/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { ko } from "@/content/ko";
import { HOME_BANNER_SLOTS, type HomeBannerSlot } from "@/lib/home/hero-slides";
import type { HomeHeroSlide } from "@/types/database";

const imageSpec = ko.admin.homeBanners.imageSpec;

type SlideDraft = {
  href: string;
  background_image_url: string;
  show_in_main: boolean;
  show_in_popup: boolean;
};

function toDraft(row: HomeHeroSlide | undefined): SlideDraft {
  return {
    href: row?.href ?? "/",
    background_image_url: row?.background_image_url ?? "",
    show_in_main: row?.show_in_main ?? row?.is_active ?? false,
    show_in_popup: row?.show_in_popup ?? false,
  };
}

function SlideFields({
  slot,
  draft,
  onChange,
  previewUrl,
  onFile,
}: {
  slot: HomeBannerSlot;
  draft: SlideDraft;
  onChange: (patch: Partial<SlideDraft>) => void;
  previewUrl: string | null;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const prefix = `slide_${slot}_`;
  const hasImage = Boolean(previewUrl);

  return (
    <fieldset className="rounded-card border border-neutral-200 bg-white p-5 sm:p-6">
      <legend className="px-1 text-[16px] font-black text-primary">
        배너 {slot}
      </legend>

      <div className="mt-4 space-y-5">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}image_file`}>배너 이미지</Label>
          <p className="text-[12px] text-neutral-500">
            메인·팝업에 동일한 이미지가 사용됩니다.
          </p>
          {previewUrl ? (
            <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-card border border-neutral-200 bg-neutral-100">
              <Image
                src={previewUrl}
                alt={`배너 ${slot} 미리보기`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized={previewUrl.startsWith("blob:")}
              />
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor={`${prefix}image_file`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-button border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-neutral-100"
            >
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              이미지 선택
            </label>
            <input
              id={`${prefix}image_file`}
              name={`${prefix}image_file`}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFile}
            />
          </div>
          <input
            type="hidden"
            name={`${prefix}background_image_url`}
            value={draft.background_image_url}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${prefix}href`}>클릭 시 링크</Label>
          <Input
            id={`${prefix}href`}
            name={`${prefix}href`}
            value={draft.href}
            onChange={(e) => onChange({ href: e.target.value })}
            placeholder="/timetable/daewon"
            maxLength={200}
            disabled={!hasImage}
          />
          <p className="text-[12px] text-neutral-500">
            내부 경로는 / 로 시작합니다. 이미지를 등록한 뒤 입력하세요.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-neutral-800">노출 위치</p>

          <div className="flex items-center justify-between gap-4 rounded-button border border-neutral-100 bg-neutral-50 px-4 py-3">
            <div>
              <p className="text-[14px] font-semibold text-neutral-800">
                메인 고정 배너
              </p>
              <p className="text-[12px] text-neutral-500">
                홈 화면 좌측 슬라이더에 표시
              </p>
            </div>
            <Switch
              checked={draft.show_in_main}
              disabled={!hasImage}
              onCheckedChange={(checked) => onChange({ show_in_main: checked })}
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-button border border-neutral-100 bg-neutral-50 px-4 py-3">
            <div>
              <p className="text-[14px] font-semibold text-neutral-800">
                팝업 배너
              </p>
              <p className="text-[12px] text-neutral-500">
                홈 첫 방문 시 팝업에 표시
              </p>
            </div>
            <Switch
              checked={draft.show_in_popup}
              disabled={!hasImage}
              onCheckedChange={(checked) =>
                onChange({ show_in_popup: checked })
              }
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}

type Props = {
  slides: HomeHeroSlide[];
};

export default function HomeBannersForm({ slides }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [drafts, setDrafts] = useState<Record<HomeBannerSlot, SlideDraft>>(() =>
    Object.fromEntries(
      HOME_BANNER_SLOTS.map((slot) => [
        slot,
        toDraft(slides.find((s) => s.slot === slot)),
      ]),
    ) as Record<HomeBannerSlot, SlideDraft>,
  );

  const [previews, setPreviews] = useState<Record<HomeBannerSlot, string | null>>(
    () =>
      Object.fromEntries(
        HOME_BANNER_SLOTS.map((slot) => {
          const url =
            slides.find((s) => s.slot === slot)?.background_image_url ?? null;
          return [slot, url];
        }),
      ) as Record<HomeBannerSlot, string | null>,
  );

  function patchDraft(slot: HomeBannerSlot, patch: Partial<SlideDraft>) {
    setDrafts((prev) => ({ ...prev, [slot]: { ...prev[slot], ...patch } }));
  }

  function onFile(slot: HomeBannerSlot) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드할 수 있습니다.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("10MB 이하의 이미지만 업로드할 수 있습니다.");
        return;
      }
      setPreviews((prev) => ({
        ...prev,
        [slot]: URL.createObjectURL(file),
      }));
      patchDraft(slot, { background_image_url: file.name });
    };
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    HOME_BANNER_SLOTS.forEach((slot) => {
      const prefix = `slide_${slot}_`;
      formData.set(
        `${prefix}show_in_main`,
        drafts[slot].show_in_main ? "on" : "off",
      );
      formData.set(
        `${prefix}show_in_popup`,
        drafts[slot].show_in_popup ? "on" : "off",
      );
    });

    startTransition(async () => {
      const result = await updateHomeHeroSlidesAction(formData);
      if (result.ok) {
        toast.success("메인 배너가 저장되었습니다.");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <p className="text-[14px] leading-relaxed text-neutral-600">
        배너는 최대 3개까지 등록합니다. 각 배너마다 이미지·링크는 하나이며, 메인
        고정·팝업 노출은 따로 선택할 수 있습니다.
      </p>

      <aside
        aria-label={imageSpec.title}
        className="rounded-card border border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6"
      >
        <h2 className="text-[15px] font-black text-primary">{imageSpec.title}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
          {imageSpec.intro}
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-neutral-700">
          {imageSpec.bullets.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <ul className="mt-3 list-disc space-y-1 border-t border-neutral-200 pt-3 pl-5 text-[12px] leading-relaxed text-neutral-500">
          {imageSpec.notes.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </aside>

      {HOME_BANNER_SLOTS.map((slot) => (
        <SlideFields
          key={slot}
          slot={slot}
          draft={drafts[slot]}
          onChange={(patch) => patchDraft(slot, patch)}
          previewUrl={previews[slot]}
          onFile={onFile(slot)}
        />
      ))}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="min-w-[120px]">
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              저장 중…
            </>
          ) : (
            "저장"
          )}
        </Button>
      </div>
    </form>
  );
}
