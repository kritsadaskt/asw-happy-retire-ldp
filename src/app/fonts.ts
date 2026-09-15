import localFont from "next/font/local";

/**
 * Single place where the brand typeface is declared.
 *
 * The real DB Heavent files have not been delivered yet and `next/font/local`
 * fails the build when a `src` file is missing, so Noto Sans Thai stands in for
 * now. When the files arrive:
 *
 *   1. drop them into public/fonts/ with the names used in the block below,
 *   2. uncomment the `localFont` block,
 *   3. delete the Noto Sans Thai block.
 *
 * Nothing outside this file needs to change — everything consumes the
 * `--font-heavent` CSS variable through Tailwind's `font-sans`.
 */
// import { Noto_Sans_Thai } from "next/font/google";
// import localFont from "next/font/local";

// export const brandFont = Noto_Sans_Thai({
//   subsets: ["thai", "latin"],
//   display: "swap",
//   variable: "--font-heavent",
// });

export const brandFont = localFont({
  src: [
    {
      path: "../../public/fonts/db_heavent_thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/db_heavent.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/db_heavent_med.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/db_heavent_bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Noto Sans Thai", "system-ui", "sans-serif"],
  variable: "--font-heavent",
});

