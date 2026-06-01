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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
  fallbackHeroCtaLabel,
  fallbackHeroSlides,
} from "@/lib/home/hero-slides";
import type {
  HomeHeroSettings,
  HomeHeroSlide,
  HomeHeroSlideSlot,
} from "@/types/database";

type SlideDraft = {
  tagline: string;
  main_headline: string;
  subtitle: string;
  href: string;
  background_image_url: string;
  is_active: boolean;
};

function toDraft(row: HomeHeroSlide | undefined, slot: HomeHeroSlideSlot): SlideDraft {
  const fallback = fallbackHeroSlides().find((s) => s.slot === slot);
  return {
    tagline: row?.tagline ?? fallback?.tagline ?? "",
    main_headline: row?.main_headline ?? fallback?.mainHeadline ?? "",
    subtitle: row?.subtitle ?? fallback?.subtitle ?? "",
    href: row?.href ?? fallback?.href ?? "/",
    background_image_url: row?.background_image_url ?? "",
    is_active: row?.is_active ?? true,
  };
}

function SlideFields({
  slot,
  draft,
  onChange,
  previewUrl,
  onFile,
}: {
  slot: HomeHeroSlideSlot;
  draft: SlideDraft;
  onChange: (patch: Partial<SlideDraft>) => void;
  previewUrl: string | null;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const prefix = `slide_${slot}_`;

  return (
    <fieldset className="rounded-card border border-neutral-200 bg-white p-5 sm:p-6">
      <legend className="px-1 text-[16px] font-black text-primary">
        배너 {slot}
      </legend>

      <div className="mt-4 space-y-5">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}image_file`}>배경 이미지</Label>
          <p className="text-[12px] text-neutral-500">
            PNG/JPG/WebP 등, 10MB 이하. 미등록 시 네이비 단색 배경이 표시됩니다.
          </p>
          {previewUrl ? (
            <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-card border border-neutral-200 bg-primary">
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
          <Label htmlFor={`${prefix}tagline`}>상단 라벨 (노란 뱃지)</Label>
          <Input
            id={`${prefix}tagline`}
            name={`${prefix}tagline`}
            value={draft.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="예: 대원외고 부동의 1위"
            maxLength={80}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${prefix}main_headline`}>메인 제목</Label>
          <Textarea
            id={`${prefix}main_headline`}
            name={`${prefix}main_headline`}
            value={draft.main_headline}
            onChange={(e) => onChange({ main_headline: e.target.value })}
            placeholder={"예: 대원외고\n수업 안내"}
            rows={3}
            maxLength={120}
            required
          />
          <p className="text-[12px] text-neutral-500">줄바꿈은 Enter 로 입력합니다.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${prefix}subtitle`}>부제목 (선택)</Label>
          <Input
            id={`${prefix}subtitle`}
            name={`${prefix}subtitle`}
            value={draft.subtitle}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            maxLength={80}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${prefix}href`}>링크 경로</Label>
          <Input
            id={`${prefix}href`}
            name={`${prefix}href`}
            value={draft.href}
            onChange={(e) => onChange({ href: e.target.value })}
            placeholder="/timetable/daewon"
            required
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-button border border-neutral-100 bg-neutral-50 px-4 py-3">
          <div>
            <p className="text-[14px] font-semibold text-neutral-800">노출</p>
            <p className="text-[12px] text-neutral-500">
              끄면 메인 슬라이더에서 이 배너가 숨겨집니다.
            </p>
          </div>
          <Switch
            checked={draft.is_active}
            onCheckedChange={(checked) => onChange({ is_active: checked })}
          />
        </div>
      </div>
    </fieldset>
  );
}

type Props = {
  slides: HomeHeroSlide[];
  settings: HomeHeroSettings | null;
};

export default function HomeBannersForm({ slides, settings }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ctaLabel, setCtaLabel] = useState(
    () => settings?.cta_label ?? fallbackHeroCtaLabel(),
  );
  const [popupEnabled, setPopupEnabled] = useState(
    () => settings?.popup_enabled ?? false,
  );

  const [drafts, setDrafts] = useState<Record<HomeHeroSlideSlot, SlideDraft>>(() => ({
    1: toDraft(
      slides.find((s) => s.slot === 1),
      1,
    ),
    2: toDraft(
      slides.find((s) => s.slot === 2),
      2,
    ),
  }));

  const [previews, setPreviews] = useState<Record<HomeHeroSlideSlot, string | null>>(
    () => ({
      1: slides.find((s) => s.slot === 1)?.background_image_url ?? null,
      2: slides.find((s) => s.slot === 2)?.background_image_url ?? null,
    }),
  );

  function patchDraft(slot: HomeHeroSlideSlot, patch: Partial<SlideDraft>) {
    setDrafts((prev) => ({ ...prev, [slot]: { ...prev[slot], ...patch } }));
  }

  function onFile(slot: HomeHeroSlideSlot) {
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
    const form = e.currentTarget;
    const formData = new FormData(form);

    ([1, 2] as const).forEach((slot) => {
      const prefix = `slide_${slot}_`;
      formData.set(`${prefix}is_active`, drafts[slot].is_active ? "on" : "off");
    });
    formData.set("popup_enabled", popupEnabled ? "on" : "off");

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
      <fieldset className="rounded-card border border-neutral-200 bg-white p-5 sm:p-6">
        <legend className="px-1 text-[16px] font-black text-primary">
          공통 설정
        </legend>
        <div className="mt-4 space-y-2">
          <Label htmlFor="cta_label">하단 CTA 문구</Label>
          <p className="text-[12px] text-neutral-500">
            모든 배너 슬라이드 하단에 표시되는 링크 텍스트입니다.
          </p>
          <Input
            id="cta_label"
            name="cta_label"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            placeholder="예: 시간표 보기"
            maxLength={40}
            required
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-button border border-neutral-100 bg-neutral-50 px-4 py-3">
          <div>
            <p className="text-[14px] font-semibold text-neutral-800">
              첫 방문 팝업
            </p>
            <p className="text-[12px] text-neutral-500">
              홈 첫 방문 시 배너 2개를 가로로 띄웁니다. 닫은 뒤에는 설정이
              바뀔 때까지 다시 보이지 않습니다.
            </p>
          </div>
          <Switch
            checked={popupEnabled}
            onCheckedChange={setPopupEnabled}
          />
        </div>
      </fieldset>

      {([1, 2] as const).map((slot) => (
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
