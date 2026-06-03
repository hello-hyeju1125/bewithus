import CardGrid from "@/components/home/CardGrid";
import HomeBannerPopup from "@/components/home/HomeBannerPopup";
import HeroSlider from "@/components/home/HeroSlider";
import SideWidget from "@/components/layout/SideWidget";
import {
  siteMainBelowHeaderClass,
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
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[45fr_55fr_100px] lg:gap-8 lg:items-stretch">
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
