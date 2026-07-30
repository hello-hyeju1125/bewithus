import StaggeredPageShell from "@/components/layout/StaggeredPageShell";
import LocationCampusMap from "@/components/location/LocationCampusMap";
import LocationPageHero from "@/components/location/LocationPageHero";
import {
  siteContainerClass,
} from "@/lib/layout/spacing";

export const metadata = {
  title: "오시는 길 | 대치위더스",
  description: "대치위더스 학원 관별 위치와 연락처 안내.",
};

export default function LocationPage() {
  return (
    <StaggeredPageShell
      pageKey="location"
      hero={<LocationPageHero tiffanyHero />}
      content={
        <section
          aria-label="관별 위치 및 지도"
          className={`${siteContainerClass} py-10 sm:py-12 lg:py-14`}
        >
          <LocationCampusMap />
        </section>
      }
    />
  );
}
