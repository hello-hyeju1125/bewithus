import CardGrid from "@/components/home/CardGrid";
import HomeBannerPopup from "@/components/home/HomeBannerPopup";
import HeroSlider from "@/components/home/HeroSlider";
import SideWidget from "@/components/layout/SideWidget";
import {
  siteMainBelowHeaderClass,
  siteMainGridColsClass,
  siteSideWidgetColumnClass,
} from "@/lib/layout/spacing";
import { getHomeHeroContent } from "@/lib/supabase/queries";

export default async function Home() {
  const heroContent = await getHomeHeroContent();

  return (
    <main className={`min-h-[90vh] ${siteMainBelowHeaderClass}`}>
      <HomeBannerPopup
        slides={heroContent.popupSlides}
        settingsUpdatedAt={heroContent.settingsUpdatedAt}
      />
      <section className="mx-auto w-full px-5 sm:px-8 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-8 lg:items-stretch lg:gap-10 ${siteMainGridColsClass}`}
        >
          <HeroSlider slides={heroContent.mainSlides} />
          <CardGrid />
          <div className={siteSideWidgetColumnClass}>
            <SideWidget />
          </div>
        </div>
      </section>
    </main>
  );
}
