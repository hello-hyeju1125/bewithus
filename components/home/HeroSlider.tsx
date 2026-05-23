"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { ko } from "@/content/ko";

const AUTOPLAY_DELAY_MS = 5000;

export default function HeroSlider() {
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [autoplay.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (idx: number) => emblaApi?.scrollTo(idx),
    [emblaApi],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (!emblaApi) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        emblaApi.scrollNext();
      }
    },
    [emblaApi],
  );

  const slides = ko.home.hero.slides;
  const total = slides.length;

  return (
    <section
      aria-label={ko.home.hero.a11y.region}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative h-full min-h-[200px] overflow-hidden rounded-hero bg-primary outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:min-h-[440px] lg:min-h-[600px]"
    >
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {slides.map((slide, idx) => (
            <div
              key={slide.href}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} / ${total}`}
              aria-hidden={selectedIndex !== idx}
              className="relative h-full min-w-0 flex-[0_0_100%]"
            >
              <Link
                href={slide.href}
                tabIndex={selectedIndex === idx ? 0 : -1}
                aria-label={`${slide.mainHeadline.replace(/\n/g, " ")} — ${ko.home.hero.ctaLabel}`}
                className="flex h-full flex-col items-center justify-start px-7 pb-10 pt-4 text-center outline-none transition-opacity duration-200 hover:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-500 sm:px-10 sm:pb-28 sm:pt-14 lg:px-12 lg:pb-32 lg:pt-[4.5rem]"
              >
                <p className="mb-2 inline-flex max-w-full rounded-leaf bg-accent-500 px-2 py-0.5 text-[17px] font-black leading-tight tracking-tight text-primary sm:mb-6 sm:px-3 sm:py-0.5 sm:text-[24px] lg:mb-7 lg:px-3.5 lg:py-1 lg:text-[28px]">
                  {slide.tagline ?? ko.home.hero.tagline}
                </p>
                <h2 className="whitespace-pre-line text-[38px] font-black leading-[1.05] tracking-tight text-white sm:text-[60px] lg:text-[80px]">
                  {slide.mainHeadline}
                </h2>
                {slide.subtitle ? (
                  <p className="mt-2 text-[20px] font-medium leading-[1.15] tracking-tight text-white/85 sm:mt-5 sm:text-[32px] sm:leading-[1.2] lg:mt-6 lg:text-[40px]">
                    {slide.subtitle}
                  </p>
                ) : null}
                <span
                  className={`group inline-flex min-h-[28px] items-center gap-2.5 text-[28px] font-black leading-none text-accent sm:min-h-0 sm:gap-4 sm:text-[38px] lg:text-[44px] ${
                    slide.subtitle
                      ? "mt-2.5 sm:mt-8 lg:mt-9"
                      : "mt-2.5 sm:mt-6 lg:mt-7"
                  }`}
                >
                  {ko.home.hero.ctaLabel}
                  <ArrowRight
                    className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:translate-x-1 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-2.5 z-10 flex justify-center sm:bottom-10 lg:bottom-12">
        <div className="pointer-events-auto flex items-center gap-3">
          {slides.map((_, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => scrollTo(idx)}
                aria-label={ko.home.hero.a11y.goTo(idx + 1, total)}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-full outline-none transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-primary ${
                  isActive
                    ? "h-1.5 w-12 bg-accent-500 sm:h-2 sm:w-16 lg:w-20"
                    : "h-1.5 w-5 bg-white/35 hover:bg-white/55 sm:h-2 sm:w-6 lg:w-8"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
