# ฟอนต์ DB Heavent

วางไฟล์ฟอนต์จริงในโฟลเดอร์นี้โดยใช้ชื่อไฟล์ตามนี้

```
DBHeavent.woff2       น้ำหนัก 400 (regular)
DBHeaventMed.woff2    น้ำหนัก 500 (medium)
DBHeaventBd.woff2     น้ำหนัก 700 (bold)
```

จากนั้นเปิดไฟล์ `src/app/fonts.ts` แล้วสลับจากบล็อก `Noto_Sans_Thai`
มาเป็นบล็อก `localFont` ที่คอมเมนต์ไว้ — ไม่ต้องแก้ไฟล์อื่นเลย

ถ้าได้ไฟล์มาเป็น `.woff` ด้วย ให้เพิ่มเข้าไปในอาร์เรย์ `src` ของ `localFont`
คู่กับ `.woff2` ของน้ำหนักเดียวกัน

DB Heavent เป็นฟอนต์ที่แคบและตัวเล็กกว่าฟอนต์ทั่วไป หลังสลับมาใช้ของจริงแล้ว
อาจต้องจูน `line-height` / `letter-spacing` ซึ่งปรับได้ที่บล็อก `@theme`
ในไฟล์ `src/app/globals.css` จุดเดียว
