import HeroSlider from "@/components/home/HeroSlider";
import CardGrid from "@/components/home/CardGrid";
import SideWidget from "@/components/layout/SideWidget";
import {
  siteMainBelowHeaderClass,
  siteSideWidgetColumnClass,
} from "@/lib/layout/spacing";

export default function Home() {
  return (
    <main className={`min-h-[90vh] ${siteMainBelowHeaderClass}`}>
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[45fr_55fr_100px] lg:gap-8 lg:items-stretch">
          <HeroSlider />
          <CardGrid />
          <div className={siteSideWidgetColumnClass}>
            <SideWidget />
          </div>
        </div>
      </section>
    </main>
  );
}
