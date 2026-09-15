import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { IconBadge } from "@/components/ui/IconBadge";
import { Section } from "@/components/ui/Section";
import { site } from "@/content/site";
import { thankYou } from "@/content/thankYou";

export const metadata: Metadata = {
  title: `${thankYou.title} | ${site.brandName} ${site.campaignName}`,
  description: thankYou.description,
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <>
      <Header />

      <main>
        <Section tone="cream-soft" className="md:py-24">
          <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-7 text-center shadow-card md:p-12">
            <IconBadge name="check-circle" tone="navy" size="lg" className="rounded-full" />

            <p className="eyebrow mt-6 text-navy/50">{thankYou.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              {thankYou.title}
            </h1>
            <p className="mt-3 text-lg font-bold text-navy/85 md:text-xl">
              {thankYou.subtitle}
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-navy/65 md:text-base">
              {thankYou.description}
            </p>

            <ol className="mt-9 grid gap-3 sm:grid-cols-3">
              {thankYou.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-2xl bg-cream-soft px-4 py-5 text-center"
                >
                  <span className="mx-auto mb-3 grid size-9 place-items-center rounded-full bg-navy text-xs font-bold text-cream">
                    {index + 1}
                  </span>
                  <Icon
                    name={step.icon}
                    className="mb-2 block text-xl text-navy"
                  />
                  <p className="text-sm leading-snug font-bold">{step.title}</p>
                  {step.caption ? (
                    <p className="mt-1 text-2xs leading-snug text-navy/60">
                      {step.caption}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink
                href={thankYou.primaryCta.href}
                trailingIcon="arrow-right"
              >
                {thankYou.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={thankYou.secondaryCta.href}
                external
                variant="outline"
              >
                {thankYou.secondaryCta.label}
              </ButtonLink>
            </div>

            <div className="mt-10 border-t border-navy/10 pt-7">
              <p className="text-sm font-bold text-navy/70">
                {thankYou.contactTitle}
              </p>
              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink
                  href={site.line.href}
                  external
                  variant="line"
                  icon="line"
                >
                  {site.line.label}
                </ButtonLink>
                <ButtonLink href={site.phone.href} variant="cream" icon="phone">
                  {site.phone.display}
                </ButtonLink>
              </div>
              <p className="mt-3 text-2xs text-navy/50">{site.officeHours}</p>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
