import Image from "next/image";
import { hero } from "@/content/hero";

export function HeroBanner() {
  return (
    <section id="home" className="scroll-mt-24 bg-white">
      <Image src={hero.desktop.src} alt={hero.desktop.alt} width={hero.desktop.width} height={hero.desktop.height} className="w-full h-auto hidden lg:block" />
      <Image src={hero.mobile.src} alt={hero.mobile.alt} width={hero.mobile.width} height={hero.mobile.height} className="w-full h-auto block lg:hidden" />
    </section>
  );
}
