import CardGrid from "@/components/home/CardGrid";
import HomeBannerPopup from "@/components/home/HomeBannerPopup";
import HeroSlider from "@/components/home/HeroSlider";
import SideWidget from "@/components/layout/SideWidget";
import {
  siteMainBelowHeaderClass,
  siteMainGridColsClass,
  siteSideWidgetAbsoluteClass,
  siteSideWidgetColumnClass,
} from "@/lib/layout/spacing";
import { getHomeHeroContent } from "@/lib/supabase/queries";

export default async function Home() {
  const heroContent = await getHomeHeroContent();

  return (
    <main className={`min-h-[90vh] ${siteMainBelowHeaderClass}`}>
      <HomeBannerPopup slides={heroContent.popupSlides} />
      <section className="mx-auto w-full px-5 sm:px-8 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-8 lg:items-start lg:gap-10 ${siteMainGridColsClass}`}
        >
          <HeroSlider slides={heroContent.mainSlides} />
          <div className="max-lg:contents lg:relative lg:min-h-0 lg:self-stretch">
            <div className="max-lg:contents lg:absolute lg:inset-0 lg:overflow-hidden">
              <CardGrid />
            </div>
          </div>
          <div className={siteSideWidgetColumnClass}>
            <div className={siteSideWidgetAbsoluteClass}>
              <SideWidget />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
