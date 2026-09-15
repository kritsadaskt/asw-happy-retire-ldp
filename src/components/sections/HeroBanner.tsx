import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { hero } from "@/content/hero";

export function HeroBanner() {
  return (
    <section id="home" className="scroll-mt-24 bg-white">
      <Image src={hero.desktop.src} alt={hero.desktop.alt} width={hero.desktop.width} height={hero.desktop.height} className="w-full h-auto" />
    </section>
  );
}
