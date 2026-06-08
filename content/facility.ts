/** 시설 안내 갤러리 — public/asset/Gallery_* */
export const FACILITY_GALLERY_IMAGES = [
  { id: "gallery-a", src: "/asset/Gallery_A.jpg", alt: "대치위더스 시설 사진 (입학)" },
  { id: "gallery-a2", src: "/asset/Gallery_A2.jpg", alt: "대치위더스 시설 사진 (입학)" },
  { id: "gallery-a3", src: "/asset/Gallery_A3.jpg", alt: "대치위더스 시설 사진 (입학)" },
  { id: "gallery-m", src: "/asset/Gallery_M.jpg", alt: "대치위더스 시설 사진 (중등)" },
  { id: "gallery-m2", src: "/asset/Gallery_M2.jpg", alt: "대치위더스 시설 사진 (중등)" },
  { id: "gallery-m3", src: "/asset/Gallery_M3.jpg", alt: "대치위더스 시설 사진 (중등)" },
  { id: "gallery-m4", src: "/asset/Gallery_M4.jpg", alt: "대치위더스 시설 사진 (중등)" },
  { id: "gallery-p", src: "/asset/Gallery_P.jpg", alt: "대치위더스 시설 사진 (사립관)" },
  { id: "gallery-p2", src: "/asset/Gallery_P2.jpg", alt: "대치위더스 시설 사진 (사립관)" },
  { id: "gallery-p3", src: "/asset/Gallery_P3.jpg", alt: "대치위더스 시설 사진 (사립관)" },
  { id: "gallery-p4", src: "/asset/Gallery_P4.jpg", alt: "대치위더스 시설 사진 (사립관)" },
  { id: "gallery-p5", src: "/asset/Gallery_P5.jpg", alt: "대치위더스 시설 사진 (사립관)" },
  { id: "gallery-p6", src: "/asset/Gallery_P6.jpg", alt: "대치위더스 시설 사진 (사립관)" },
] as const;

export type FacilityGalleryImage = (typeof FACILITY_GALLERY_IMAGES)[number];
