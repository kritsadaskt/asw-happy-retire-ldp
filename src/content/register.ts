import type {
  FeatureContent,
  FieldContent,
  IconKey,
  SelectFieldContent,
} from "./types";

/**
 * Register Form — ข้อความทุกจุด, ตัวเลือก dropdown และข้อความ error
 * ปรับได้ที่ไฟล์นี้ไฟล์เดียว
 */
export const register = {
  eyebrow: "PRIVATE CONSULTATION",
  title: "ลงทะเบียน",
  subtitle: "รับข้อมูลและนัดหมายเยี่ยมชมโครงการ",
  description: "ให้ทีมงานดูแลคุณแบบส่วนตัว",

  benefits: [
    { icon: "comments", title: "รับคำปรึกษา", caption: "จากผู้เชี่ยวชาญ" },
    { icon: "house-chimney", title: "เลือกโครงการ", caption: "ที่เหมาะกับคุณ" },
    { icon: "calendar", title: "นัดหมายเยี่ยมชม", caption: "แบบส่วนตัว" },
    { icon: "gem", title: "รับสิทธิพิเศษ", caption: "เฉพาะผู้ลงทะเบียน" },
  ] satisfies FeatureContent[],

  fields: {
    fullName: {
      label: "ชื่อ - นามสกุล",
      placeholder: "เช่น สมชาย ใจดี",
      icon: "user",
      required: true,
    } satisfies FieldContent,

    phone: {
      label: "เบอร์โทรศัพท์",
      placeholder: "เช่น 081-234-5678",
      icon: "phone",
      required: true,
    } satisfies FieldContent,

    residenceType: {
      label: "รูปแบบที่อยู่อาศัยที่สนใจ",
      placeholder: "เลือกประเภท",
      icon: "house",
      options: [
        { value: "condominium", label: "คอนโดมิเนียม" },
        { value: "single-house", label: "บ้านเดี่ยว" },
        { value: "townhome", label: "ทาวน์โฮม" },
      ],
    } satisfies SelectFieldContent,

    budget: {
      label: "งบประมาณ (โดยประมาณ)",
      placeholder: "เลือกงบประมาณ",
      icon: "money",
      options: [
        { value: "under-2m", label: "ไม่เกิน 2 ล้านบาท" },
        { value: "2-3m", label: "2 - 3 ล้านบาท" },
        { value: "3-5m", label: "3 - 5 ล้านบาท" },
        { value: "5-10m", label: "5 - 10 ล้านบาท" },
        { value: "over-10m", label: "มากกว่า 10 ล้านบาท" },
      ],
    } satisfies SelectFieldContent,

    visitDate: {
      label: "วันที่สะดวกเข้าเยี่ยมชม",
      placeholder: "เลือกวันที่",
      icon: "calendar",
    } satisfies FieldContent,
  },

  submit: {
    label: "ลงทะเบียนเลย",
    loadingLabel: "กำลังส่งข้อมูล...",
  },

  requiredHint: "จำเป็นต้องกรอก",

  errors: {
    fullNameRequired: "กรุณากรอกชื่อ - นามสกุล",
    fullNameTooShort: "กรุณากรอกชื่อ - นามสกุล ให้ครบถ้วน",
    phoneRequired: "กรุณากรอกเบอร์โทรศัพท์",
    phoneInvalid: "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (ตัวเลข 9 - 10 หลัก)",
    visitDateInvalid: "กรุณาเลือกวันที่ให้ถูกต้อง",
    visitDatePast: "กรุณาเลือกวันที่ตั้งแต่วันนี้เป็นต้นไป",
    termsRequired: "กรุณายอมรับข้อมูลและเงื่อนไขโปรโมชัน",
    submitFailed:
      "ขออภัย ระบบไม่สามารถส่งข้อมูลได้ในขณะนี้ กรุณาลองอีกครั้ง หรือโทร 02-168-0000",
    network: "การเชื่อมต่อขัดข้อง กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง",
  },

  terms: {
    before: "ฉันได้อ่านและยอมรับ",
    linkLabel: "ข้อมูลและเงื่อนไขโปรโมชัน",
    href: "https://assetwise.co.th/terms-and-conditions/happiness-never-retires/",
  },

  pdpa: {
    icon: "lock" as IconKey,
    text: "ข้อมูลของคุณจะถูกเก็บเป็นความลับ และใช้เพื่อการติดต่อเรื่องที่อยู่อาศัยเท่านั้น",
  },

  contact: {
    kicker: "หรือ",
    title: "ติดต่อเราได้ทันที",
    trustBadges: [
      { icon: "headset", title: "ทีมงานดูแล", caption: "อย่างใกล้ชิด" },
      { icon: "user-check", title: "นัดหมาย", caption: "แบบส่วนตัว" },
      { icon: "shield", title: "ข้อมูลปลอดภัย", caption: "100%" },
    ] satisfies FeatureContent[],
  },
};
