import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import FacilityGallery from "@/components/facility/FacilityGallery";
import FacilityPageHero from "@/components/facility/FacilityPageHero";
import {
  FACILITY_GALLERY_IMAGES,
  FACILITY_GALLERY_SECTIONS,
} from "@/content/facility";
import {
  siteContainerClass,
  siteFloatingWidgetSafeClass,
} from "@/lib/layout/spacing";

export const metadata = {
  title: "시설 안내 | W대치위더스",
  description: "강의실, 자습실, 상담실 등 대치위더스의 시설을 소개합니다.",
};

export default function FacilityPage() {
  return (
    <StaggeredPageShell
      pageKey="facility"
      hero={<FacilityPageHero tiffanyHero />}
      content={
        <section
          aria-label="시설 갤러리"
          className={`${siteContainerClass} ${siteFloatingWidgetSafeClass} py-10 sm:py-12 lg:py-14`}
        >
          <FacilityGallery
            sections={FACILITY_GALLERY_SECTIONS}
            images={FACILITY_GALLERY_IMAGES}
          />
        </section>
      }
    />
  );
}
