import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { hero } from "@/content/hero";

export function HeroBanner() {
  return (
    <section id="home" className="scroll-mt-24 bg-white pt-4 pb-10 md:pt-6">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[28px] bg-navy-deep shadow-card md:rounded-[36px]">
          <Image
            src={hero.background.src}
            alt={hero.background.alt}
            width={hero.background.width}
            height={hero.background.height}
            priority
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="absolute inset-0 size-full object-cover object-center"
          />

          {/* Legibility scrim: stronger on the left where the copy sits. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-navy-deep/85 via-navy-deep/55 to-navy-deep/20"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent md:from-navy-deep/45"
          />

          <div className="relative flex min-h-[560px] flex-col justify-between gap-8 px-6 py-8 sm:min-h-[620px] sm:px-9 md:min-h-[660px] md:py-10 lg:min-h-[720px] lg:px-14">
            <h1 className="sr-only">{hero.srHeading}</h1>

            <div className="flex items-start justify-between gap-6">
              <div className="animate-fade-up">
                <Image
                  src={hero.lockup.src}
                  alt={hero.lockup.alt}
                  width={hero.lockup.width}
                  height={hero.lockup.height}
                  priority
                  className="h-auto w-[240px] drop-shadow-[0_10px_30px_rgba(12,43,74,0.45)] sm:w-[300px] lg:w-[380px]"
                />
              </div>

              <div className="flex items-start gap-8">
                <p className="hidden max-w-[170px] text-right text-sm leading-snug font-bold text-white/85 md:block">
                  {hero.doorQuote}
                </p>

                <p
                  aria-hidden
                  className="hidden flex-col text-right text-xs font-bold tracking-[0.3em] text-white/70 lg:flex"
                >
                  {hero.sideWords.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </p>
              </div>
            </div>

            <div className="space-y-7">
              <blockquote className="text-2xl leading-snug font-bold text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
                {hero.quote.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="block text-cream">{hero.quote.accent}</span>
              </blockquote>

              <ul className="grid max-w-2xl grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-x-6">
                {hero.highlights.map((item) => (
                  <li key={item.title} className="text-white">
                    <Icon
                      name={item.icon}
                      className="mb-2 block text-2xl text-cream"
                    />
                    <p className="text-xs leading-snug font-bold sm:text-sm">
                      {item.title}
                    </p>
                    {item.caption ? (
                      <p className="text-xs leading-snug text-white/70">
                        {item.caption}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <p className="flex items-baseline gap-2 text-white">
                  <span className="text-base font-medium">
                    {hero.price.prefix}
                  </span>
                  <span className="text-3xl font-bold text-cream lg:text-4xl">
                    {hero.price.value}
                  </span>
                  <span className="text-lg font-bold text-cream">
                    {hero.price.unit}
                  </span>
                </p>

                <div className="flex flex-wrap gap-3">
                  <ButtonLink
                    href={hero.cta.href}
                    variant="cream"
                    size="md"
                    trailingIcon="arrow-right"
                  >
                    {hero.cta.label}
                  </ButtonLink>
                  <ButtonLink
                    href={hero.secondaryCta.href}
                    variant="outline"
                    size="md"
                    className="border-white/40 bg-white/10 text-white hover:border-white hover:bg-white/20"
                  >
                    {hero.secondaryCta.label}
                  </ButtonLink>
                </div>
              </div>

              <p className="text-2xs text-white/55">{hero.disclaimer}</p>
            </div>
          </div>

          {/* Promo ribbon */}
          <div className="absolute right-0 bottom-6 hidden items-center gap-3 rounded-l-full bg-navy/85 py-3 pr-6 pl-7 text-white backdrop-blur md:flex lg:bottom-10">
            <Icon name={hero.promoBadge.icon} className="text-lg text-cream" />
            <span className="text-xs leading-tight">
              <span className="block text-white/80">
                {hero.promoBadge.lead}
              </span>
              <span className="block text-lg font-bold text-cream">
                {hero.promoBadge.highlight}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
