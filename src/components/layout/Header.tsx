"use client";

import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PublicImage } from "@/components/ui/PublicImage";
import { mainNav, navCta } from "@/content/nav";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow",
          scrolled && "shadow-[0_6px_24px_-18px_rgba(18,63,109,0.55)]",
        )}
      >
        <div className="shell flex h-18 items-center justify-between gap-4 md:h-20">
          <a
            href="#home"
            className="shrink-0"
            aria-label={`${site.brandName} ${site.campaignName}`}
          >
            <PublicImage
              src={site.logo.src}
              alt={site.logo.alt}
              width={site.logo.width}
              height={site.logo.height}
              priority
              className="h-auto w-47.5"
            />
          </a>

          <nav aria-label="เมนูหลัก" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="relative text-sm font-medium text-navy/80 transition hover:text-navy after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-navy after:transition-all hover:after:w-full"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink
              href={site.phone.href}
              icon="phone"
              size="sm"
              ariaLabel={`${navCta.srLabel} ${site.phone.display}`}
              className="hidden sm:inline-flex"
            >
              {site.phone.display}
            </ButtonLink>

            <a
              href={site.phone.href}
              aria-label={`${navCta.srLabel} ${site.phone.display}`}
              className="grid size-11 place-items-center rounded-full bg-navy text-white sm:hidden"
            >
              <Icon name="phone" className="text-sm" />
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="เปิดเมนู"
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-full border border-navy/15 text-navy transition hover:bg-navy/5 lg:hidden"
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {/*
        Drawer must sit outside <header>: sticky + backdrop-blur makes nested
        `fixed` children only as tall as the header bar, which clips the links.
      */}
      <div
        className={cn(
          "fixed inset-0 z-60 overflow-hidden lg:hidden",
          open ? "visible pointer-events-auto" : "invisible pointer-events-none",
        )}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="ปิดเมนู"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-navy-deep/45 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          className={cn(
            "absolute inset-y-0 right-0 flex h-dvh w-[82%] max-w-sm flex-col bg-white shadow-float transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex shrink-0 items-center justify-end px-6 py-5">
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              aria-label="ปิดเมนู"
              className="grid size-10 place-items-center rounded-full border border-navy/15 text-navy"
            >
              <Icon name="close" />
            </button>
          </div>

          <nav
            aria-label="เมนูหลัก (มือถือ)"
            className="min-h-0 flex-1 overflow-y-auto px-6 py-2"
          >
            <ul className="flex flex-col">
              {mainNav.map((item) => (
                <li
                  key={item.href}
                  className="border-b border-navy/5 last:border-0"
                >
                  <a
                    href={item.href}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 text-lg font-medium text-navy"
                  >
                    {item.label}
                    <Icon
                      name="chevron-right"
                      className="text-xs text-navy/35"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 space-y-3 border-t border-navy/10 px-6 py-6">
            <ButtonLink
              href={site.phone.href}
              icon="phone"
              size="md"
              className="w-full"
            >
              {site.phone.display}
            </ButtonLink>
            <ButtonLink
              href={site.line.href}
              external
              icon="line"
              variant="line"
              size="md"
              className="w-full"
            >
              {site.line.label}
            </ButtonLink>
            <p className="text-center text-xs text-navy/55">
              {site.officeHours}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
