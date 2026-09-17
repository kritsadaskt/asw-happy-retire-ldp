# AssetWise Happy Retire — Landing Page

Landing page แคมเปญ **AssetWise Happy Retire** ภาษาไทยล้วน สร้างด้วย Next.js
(App Router) + TypeScript + Tailwind CSS ประกอบด้วย

| หน้า/ส่วน       | รายละเอียด                                                                   |
| --------------- | ---------------------------------------------------------------------------- |
| `/` → `#home`   | Hero Banner — key visual, headline, จุดขาย 4 ข้อ, ป้ายราคา, ปุ่ม CTA         |
| `/` → `#register` | ฟอร์มลงทะเบียน 3 คอลัมน์ + ช่องทางติดต่อ LINE / Messenger / โทร             |
| `/` → `#projects` | Google Maps เต็มความกว้าง + กล่องลิสต์โครงการลอย + ตัวกรองโซน + หมุดโลโก้ |
| `/` → `#contact`  | Footer แถบขาว โลโก้ซ้าย social + เบอร์โทรขวา                               |
| `/thank-you`    | หน้าขอบคุณหลังลงทะเบียนสำเร็จ                                                |
| `/api/register` | Route handler ส่งข้อมูลต่อไปยัง n8n webhook (`N8N_WEBHOOK_URL`)              |

---

## เริ่มใช้งาน

```bash
npm install
cp .env.example .env.local   # ใส่ค่าที่มี (ปล่อยว่างไว้ก็รันได้)
npm run dev                  # http://localhost:3000
```

สคริปต์ที่มี

| คำสั่ง                 | หน้าที่                                            |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | dev server                                         |
| `npm run build`        | production build                                   |
| `npm start`            | รัน production build                               |
| `npm run lint`         | ESLint                                             |
| `npm run typecheck`    | TypeScript                                         |
| `npm run placeholders` | สร้างรูป placeholder ใหม่ใน `public/images` (ชั่วคราว) |

> เว็บ **build และรันได้โดยไม่ต้องมี secret จริง**: ถ้าไม่มี Google Maps API key
> ส่วนแผนที่จะแสดงภาพนิ่งพร้อมคำอธิบายแทน และถ้าไม่มี n8n webhook ฟอร์มจะยัง
> ทำงานครบ flow (ข้อมูลจะถูก log ไว้ฝั่งเซิร์ฟเวอร์เท่านั้น) — ดูรายละเอียดใน
> หัวข้อ [การส่งข้อมูลไป n8n](#การส่งข้อมูลไป-n8n)

---

## แก้ไขเนื้อหาเอง (ไม่ต้องแตะโค้ด component)

**ทุกข้อความ รูป ลิงก์ เบอร์โทร ตัวเลือก dropdown และรายการโครงการ อยู่ใน `src/content/`**

```
src/content/
  types.ts      type กลางที่ไฟล์อื่นใช้ร่วมกัน
  site.ts       ชื่อแบรนด์, โลโก้, เบอร์โทร, LINE, Messenger, เวลาทำการ, SEO/OG
  nav.ts        เมนูหลัก 4 รายการ (href ต้องตรงกับ id ของ section)
  hero.ts       หัวเรื่อง, สโลแกน, จุดขาย 4 ข้อ, ราคาเริ่มต้น, ปุ่ม, ภาพพื้นหลัง
  register.ts   หัวข้อคอลัมน์ซ้าย, label ฟอร์ม, ตัวเลือก, ข้อความ error, PDPA
  projects.ts   โซน + โครงการ (ชื่อ, โลโก้, พิกัด, ลิงก์, ทำเล, ราคาเริ่ม) + ค่าเริ่มต้นแผนที่
  footer.ts     ลิงก์ + social ใน footer
  thankYou.ts   เนื้อหาหน้า /thank-you
```

### เปลี่ยนรูป

รูปทั้งหมดอยู่ใน `public/images/` และอ้างอิงด้วย path string ในไฟล์ content
วางไฟล์ใหม่ทับชื่อเดิม (หรือแก้ path + `width`/`height` ในไฟล์ content) ก็เปลี่ยนได้ทันที

| ไฟล์                                  | ใช้ที่                       |
| ------------------------------------- | ---------------------------- |
| `logo-assetwise.png`                  | Header, Footer               |
| `hero-key-visual.jpg`                 | ภาพพื้นหลัง Hero             |
| `hero-happy-retire.png`               | โลโก้ “Happy Retire” บน Hero |
| `projects/<project-id>.png`           | โลโก้โครงการ = หมุดบนแผนที่  |
| `map-fallback.jpg`                    | ภาพแทนแผนที่เมื่อยังไม่มี API key |
| `og-image.jpg`                        | OG / Twitter card            |

> **รูปในรอบนี้เป็น placeholder ทั้งหมด** สร้างจาก `scripts/generate-placeholders.mjs`
> เมื่อได้ของจริงแล้วให้วางไฟล์ทับ แล้วลบสคริปต์กับ devDependency `sharp` ได้

### เพิ่ม / แก้โครงการบนแผนที่

แก้อาร์เรย์ `projects` ใน `src/content/projects.ts`

```ts
{
  id: "atmoz-rangsit",              // ต้องไม่ซ้ำ ใช้เป็น key
  name: "แอทโมซ รังสิต",
  zone: "bkk-north",                // ต้องเป็น id ที่มีในอาร์เรย์ `zones`
  location: "ติดถนนพหลโยธิน ...",
  priceFrom: "เริ่ม 1.51 ลบ.",
  logo: "/images/projects/atmoz-rangsit.png",
  url: "https://www.assetwise.co.th/project",   // เปิดในแท็บใหม่
  position: { lat: 13.9894, lng: 100.6135 },    // ⚠️ ตอนนี้เป็นพิกัด placeholder
}
```

> **พิกัด (`position`) ทั้งหมดยังเป็น placeholder** (ปัดเป็นทำเลโดยรวม ไม่ใช่ที่ตั้งจริง)
> วิธีเอาพิกัดจริง: เปิด Google Maps → คลิกขวาที่ตำแหน่งโครงการ → คลิกตัวเลขคู่แรกเพื่อคัดลอก

### ไอคอน

ทุกไอคอนมาจาก **FontAwesome Free solid** (ยกเว้นโลโก้แบรนด์ LINE / Facebook /
Messenger / Instagram / YouTube ที่ต้องใช้ชุด brands เพราะชุด solid ไม่มี)
ไฟล์ content อ้างไอคอนด้วย “คีย์” เป็นสตริง เช่น `icon: "gem"` โดยรายการคีย์
ทั้งหมดอยู่ใน `src/lib/icons.ts` — ถ้าต้องการไอคอนใหม่ให้ `import` เพิ่มในไฟล์นั้น
แล้วตั้งคีย์ใหม่ จากนั้นเรียกใช้จาก content ได้เลย

---

## ฟอนต์ DB Heavent + type scale 20px

- ประกาศฟอนต์ที่ `src/app/fonts.ts` **ไฟล์เดียว** ผูกเข้ากับ CSS variable `--font-heavent`
- ไฟล์ DB Heavent จริงยังไม่มา จึงใช้ **Noto Sans Thai** เป็นฟอนต์สำรองก่อน
  (`next/font/local` จะ build ไม่ผ่านถ้าไฟล์หาย)
- วิธีสลับเป็นของจริง: วางไฟล์ลง `public/fonts/` ตามชื่อใน `public/fonts/README.md`
  → เปิด `src/app/fonts.ts` → uncomment บล็อก `localFont` → ลบบล็อก `Noto_Sans_Thai`
  **ไม่ต้องแก้ไฟล์อื่นเลย**
- type scale ยึด **20px เป็น `text-base`** (`sm` 18 / `base` 20 / `lg` 22 / `xl` 26 /
  `2xl` 32 / `3xl` 40 / `4xl` 50 ...) กำหนดไว้ในบล็อก `@theme` ของ
  `src/app/globals.css` โดย **ไม่แตะ root font-size** เพื่อไม่ให้ spacing ของ
  Tailwind เพี้ยน — หลังสลับมาใช้ DB Heavent จริงแล้วปรับ `line-height` /
  `letter-spacing` ได้ที่ `@theme` จุดเดียว

สีธีม: `#FFFFFF` (`paper`) / `#fcead4` (`cream`) / `#123F6D` (`navy`) กำหนดใน `@theme` เช่นกัน

---

## Environment Variables

| ตัวแปร                            | ฝั่ง    | คำอธิบาย                                                       |
| --------------------------------- | ------- | -------------------------------------------------------------- |
| `APP_ENV`                         | server  | `production` = ขาด webhook แล้วตอบ error, ค่าอื่น = โหมด demo   |
| `N8N_WEBHOOK_URL`                 | server  | URL webhook ของ n8n ที่รับข้อมูลลงทะเบียน                      |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | browser | ไม่ใส่ = แสดงภาพแทนแผนที่                                      |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`  | browser | จำเป็นสำหรับหมุดโลโก้ (Advanced Marker) ไม่ใส่ = ใช้หมุดมาตรฐาน |
| `NEXT_PUBLIC_BASE_PATH`           | ทั้งคู่ | `/happyretire` บน Vercel, ปล่อยว่างตอน dev                     |
| `NEXT_PUBLIC_SITE_URL`            | ทั้งคู่ | origin สำหรับ `metadataBase` / canonical / OG                  |

### ตั้งค่าบน Vercel

Project → Settings → Environment Variables

| Environment          | ค่าที่แนะนำ                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| Production           | `APP_ENV=production`, `N8N_WEBHOOK_URL=...`, `NEXT_PUBLIC_BASE_PATH=/happyretire` |
| Preview / Development | `APP_ENV=uat`, `N8N_WEBHOOK_URL=...`, `NEXT_PUBLIC_BASE_PATH` ปล่อยว่าง           |

`NEXT_PUBLIC_*` ถูกฝังตอน build → เปลี่ยนค่าแล้วต้อง **redeploy** ทุกครั้ง

---

## การส่งข้อมูลไป n8n

ฟอร์มยิงไปที่ route handler ฝั่งเซิร์ฟเวอร์ `POST /api/register` (relative path
เสมอ จึงได้ prefix `basePath` อัตโนมัติ) เพื่อไม่ให้ URL webhook หลุดไปฝั่ง client
และเลี่ยงปัญหา CORS

1. validate ด้วย zod (`src/lib/validation.ts`) — ข้อความ error ทั้งหมดมาจาก `src/content/register.ts`
2. POST JSON ไปที่ `N8N_WEBHOOK_URL` โดย map payload ใน **`src/lib/n8n.ts`** (`toN8nPayload()`)
3. สำเร็จ → `router.push("/thank-you")`; ล้มเหลว → แสดง error inline **โดยไม่ล้างข้อมูลที่กรอกไว้**

payload ปัจจุบันเป็น (`campaign`, `source`, `fullName`, `phone`,
`residenceType(+Label)`, `budget(+Label)`, `visitDate`, `submittedAt`)
เมื่อต้องปรับ shape ของ webhook ให้แก้เฉพาะ `toN8nPayload()` ไฟล์เดียว

พฤติกรรมเมื่อ **ไม่มี** webhook

| `APP_ENV`      | ผลลัพธ์                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| ไม่ใช่ production | ตอบ `200` + log ข้อมูลไว้ฝั่งเซิร์ฟเวอร์ แล้วพาไป `/thank-you` (โหมด demo) |
| `production`   | ตอบ `503` + log `error` และแสดงข้อความขอให้ลองใหม่/โทรหาเจ้าหน้าที่      |

---

## Deploy: `assetwise.co.th/happyretire` ผ่าน Cloudflare Worker

หน้าเพจอยู่ใต้ path `/happyretire` โดยให้ **Next.js รู้ตัวเองว่าอยู่ใต้ subpath**
ผ่าน `basePath` (ใน `next.config.ts`) — asset, `next/image`, `<Link>` และ route
handler จะถูกเติม prefix ให้อัตโนมัติ Worker จึงไม่ต้องเขียน HTML ทับ

1. deploy repo นี้ขึ้น Vercel แล้วตั้ง `NEXT_PUBLIC_BASE_PATH=/happyretire` (Production)
2. แก้ `UPSTREAM_HOST` ใน `deploy/cloudflare-worker.js` ให้เป็นโดเมน Vercel ของโปรเจกต์
3. deploy Worker แล้วผูก route `assetwise.co.th/happyretire*`

```bash
npx wrangler deploy deploy/cloudflare-worker.js --name happyretire-proxy
```

ข้อควรระวัง

- Worker ต้อง **ส่ง path เดิมไปทั้งก้อน** (`/happyretire/...` → `https://<project>.vercel.app/happyretire/...`)
  **ไม่ต้อง** strip prefix เพราะ Next.js รอ prefix นี้อยู่แล้ว
- ไม่แคช HTML และ `/happyretire/api/*` แต่แคช `/happyretire/_next/static/*` ได้ยาว ๆ (มีตั้งไว้ในสคริปต์แล้ว)
- ลิงก์ที่เขียนเองโดยไม่ผ่าน `<Link>` (เช่น og:image, JSON-LD) และรูปจาก `public/`
  ให้ผ่าน `PublicImage` / `withBasePath()` / `absoluteUrl()` ใน `src/lib/paths.ts`
  (`next/image` ไม่เติม `basePath` ให้ string `src` โดยอัตโนมัติ)

---

## ข้อจำกัดของรอบนี้ (ของที่รอของจริง)

- [ ] ไฟล์ฟอนต์ DB Heavent (`public/fonts/`) — ตอนนี้ใช้ Noto Sans Thai แทน
- [ ] key visual, โลโก้ AssetWise, โลโก้โครงการ — ตอนนี้เป็น placeholder ใน `public/images/`
- [ ] พิกัด lat/lng จริงของแต่ละโครงการ + URL หน้าโครงการ — ใน `src/content/projects.ts`
- [ ] สเปค payload ของ n8n webhook — ปรับที่ `toN8nPayload()` ใน `src/lib/n8n.ts`
- [ ] ลิงก์ LINE OA / Messenger / social จริง — ใน `src/content/site.ts` และ `src/content/footer.ts`
- [ ] Google Maps API key + Map ID
