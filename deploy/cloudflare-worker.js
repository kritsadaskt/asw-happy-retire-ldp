/**
 * Cloudflare Worker — reverse proxy assetwise.co.th/happyretire -> Vercel
 *
 * The Next.js app is deployed with `basePath = /happyretire`, so every asset,
 * link and route handler URL already carries that prefix. The Worker must
 * therefore forward the path **untouched** — do not strip the prefix and do
 * not rewrite the HTML.
 *
 * Route (Cloudflare dashboard or wrangler.toml):
 *   assetwise.co.th/happyretire*
 *
 * Deploy:
 *   npx wrangler deploy deploy/cloudflare-worker.js --name happyretire-proxy
 */

/** Vercel deployment that serves the app. */
const UPSTREAM_HOST = "happy-retire-landing.vercel.app";

/** Path prefix the app is mounted on. Must match NEXT_PUBLIC_BASE_PATH. */
const BASE_PATH = "/happyretire";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== BASE_PATH && !url.pathname.startsWith(`${BASE_PATH}/`)) {
      return new Response("Not found", { status: 404 });
    }

    const upstreamUrl = new URL(url.toString());
    upstreamUrl.protocol = "https:";
    upstreamUrl.hostname = UPSTREAM_HOST;
    upstreamUrl.port = "";

    const upstreamRequest = new Request(upstreamUrl.toString(), request);
    // Vercel routes on Host; keep the visitor's host for logging/analytics.
    upstreamRequest.headers.set("Host", UPSTREAM_HOST);
    upstreamRequest.headers.set("x-forwarded-host", url.host);
    upstreamRequest.headers.set("x-forwarded-proto", "https");

    const upstreamResponse = await fetch(upstreamRequest, {
      redirect: "manual",
    });

    const response = new Response(upstreamResponse.body, upstreamResponse);

    // Immutable build output can be cached hard; HTML and the API must not be.
    if (url.pathname.startsWith(`${BASE_PATH}/_next/static/`)) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=31536000, immutable",
      );
    } else if (url.pathname.startsWith(`${BASE_PATH}/api/`)) {
      response.headers.set("Cache-Control", "no-store");
    } else {
      response.headers.set("Cache-Control", "no-cache, must-revalidate");
    }

    return response;
  },
};
