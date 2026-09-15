import Image from "next/image";

import { Icon } from "@/components/ui/Icon";
import { footer } from "@/content/footer";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-navy/10 bg-white">
      <div className="shell flex flex-col items-center gap-6 py-8 lg:flex-row lg:justify-between lg:gap-8 lg:py-6">
        <Image
          src={site.logo.src}
          alt={site.logo.alt}
          width={site.logo.width}
          height={site.logo.height}
          className="h-8 w-auto shrink-0"
        />

        <nav aria-label="เมนูส่วนท้าย" className="order-3 lg:order-none">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-navy/70">
            {footer.links.map((link) => (
              <li
                key={link.href}
                className="after:ml-5 after:text-navy/25 after:content-['|'] last:after:content-none"
              >
                <a
                  href={link.href}
                  className="transition hover:text-navy"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-2">
            {footer.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-full bg-navy/5 text-navy transition hover:bg-navy hover:text-white"
                >
                  <Icon name={social.icon} className="text-sm" />
                </a>
              </li>
            ))}
          </ul>

          <span aria-hidden className="h-6 w-px bg-navy/15" />

          <a
            href={site.phone.href}
            className="flex items-center gap-2 text-sm font-bold text-navy transition hover:text-navy-soft"
          >
            <Icon name="phone" className="text-xs" />
            {site.phone.display}
          </a>
        </div>
      </div>

      <div className="border-t border-navy/5">
        <div className="shell py-4">
          <p className="text-center text-2xs text-navy/45">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
