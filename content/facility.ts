/** 시설 안내 갤러리 — public/asset */
export const FACILITY_GALLERY_IMAGES = [
  { id: "gallery01", src: "/asset/gallery01.png", alt: "대치위더스 시설 사진 1" },
  { id: "gallery02", src: "/asset/gallery02.png", alt: "대치위더스 시설 사진 2" },
  { id: "gallery03", src: "/asset/gallery03.png", alt: "대치위더스 시설 사진 3" },
  { id: "gallery04", src: "/asset/gallery04.png", alt: "대치위더스 시설 사진 4" },
  { id: "gallery05", src: "/asset/gallery05.png", alt: "대치위더스 시설 사진 5" },
] as const;

export type FacilityGalleryImage = (typeof FACILITY_GALLERY_IMAGES)[number];
