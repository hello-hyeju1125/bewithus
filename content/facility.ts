/** 시설 안내 갤러리 — public/asset/Gallery_* */
export const FACILITY_GALLERY_SECTIONS = [
  {
    layout: "pair",
    images: [
      { id: "gallery-main1", src: "/asset/Gallery_Main1.jpeg", alt: "대치위더스 시설 사진" },
      { id: "gallery-main2", src: "/asset/Gallery_Main2.jpg", alt: "대치위더스 시설 사진" },
    ],
  },
  {
    layout: "pair",
    images: [
      { id: "gallery-p5", src: "/asset/Gallery_P5.jpg", alt: "대치위더스 시설 사진 (사립관)" },
      { id: "gallery-a", src: "/asset/Gallery_A.jpg", alt: "대치위더스 시설 사진 (입학)" },
    ],
  },
  {
    layout: "masonry",
    images: [
      { id: "gallery-a2", src: "/asset/Gallery_A2.jpg", alt: "대치위더스 시설 사진 (입학)" },
      { id: "gallery-a3", src: "/asset/Gallery_A3.jpg", alt: "대치위더스 시설 사진 (입학)" },
      { id: "gallery-m", src: "/asset/Gallery_M.jpg", alt: "대치위더스 시설 사진 (중등)" },
      { id: "gallery-m2", src: "/asset/Gallery_M2.jpg", alt: "대치위더스 시설 사진 (중등)" },
      { id: "gallery-m3", src: "/asset/Gallery_M3.jpg", alt: "대치위더스 시설 사진 (중등)" },
      { id: "gallery-m4", src: "/asset/Gallery_M4.jpg", alt: "대치위더스 시설 사진 (중등)" },
      { id: "gallery-p", src: "/asset/Gallery_P.jpg", alt: "대치위더스 시설 사진 (사립관)" },
      { id: "gallery-p2", src: "/asset/Gallery_P2.jpg", alt: "대치위더스 시설 사진 (사립관)" },
      { id: "gallery-p6", src: "/asset/Gallery_P6.jpg", alt: "대치위더스 시설 사진 (사립관)" },
      { id: "gallery-s2", src: "/asset/Gallery_S2.jpg", alt: "대치위더스 시설 사진" },
    ],
  },
] as const;

export const FACILITY_GALLERY_IMAGES = FACILITY_GALLERY_SECTIONS.flatMap(
  (section) => section.images,
);

export type FacilityGalleryImage = (typeof FACILITY_GALLERY_IMAGES)[number];
export type FacilityGallerySection = (typeof FACILITY_GALLERY_SECTIONS)[number];
