import Script from "next/script";

import { site } from "@/content/site";

function resolveGtmId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GTM_ID?.trim() || site.gtmId;
  return /^GTM-[A-Z0-9]+$/i.test(raw) ? raw : null;
}

/**
 * Google Tag Manager — สคริปต์ในทุกหน้าผ่าน root layout
 * ปิดได้ด้วยการเว้น `gtmId` / `NEXT_PUBLIC_GTM_ID` ว่าง
 */
export function Gtm() {
  const gtmId = resolveGtmId();
  if (!gtmId) return null;

  return (
    <>
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height={0}
          width={0}
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
