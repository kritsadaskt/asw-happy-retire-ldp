import { z } from "zod";

import { register as registerContent } from "@/content/register";
import { mapProjects } from "@/lib/projects";

const messages = registerContent.errors;

const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const residenceValues = registerContent.fields.residenceType.options.map(
  (option) => option.value,
);
const budgetValues = registerContent.fields.budget.options.map(
  (option) => option.value,
);

const projectValues = mapProjects.map((project) => project.id);

/** ค่าที่ไม่ได้เลือกจะถูกส่งมาเป็นสตริงว่าง จึงต้องยอมรับไว้ด้วย */
const optionalChoice = (allowed: string[], message = "ตัวเลือกไม่ถูกต้อง") =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .refine((value) => value === "" || allowed.includes(value), {
      message,
    });

const utmField = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((value) => value ?? "");

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, messages.fullNameRequired)
    .min(3, messages.fullNameTooShort)
    .max(120),

  phone: z
    .string()
    .trim()
    .min(1, messages.phoneRequired)
    .refine((value) => /^0\d{8,9}$/.test(value.replace(/\D/g, "")), {
      message: messages.phoneInvalid,
    }),

  residenceType: optionalChoice(residenceValues),
  budget: optionalChoice(budgetValues),
  project: z
    .string()
    .trim()
    .min(1, messages.projectRequired)
    .refine((value) => projectValues.includes(value), {
      message: messages.projectInvalid,
    }),

  visitDate: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .refine((value) => value === "" || !Number.isNaN(Date.parse(value)), {
      message: messages.visitDateInvalid,
    })
    .refine((value) => value === "" || new Date(value) >= startOfToday(), {
      message: messages.visitDatePast,
    }),

  acceptedTerms: z
    .boolean({ error: messages.termsRequired })
    .refine((value) => value === true, {
      message: messages.termsRequired,
    }),

  utm_source: utmField,
  utm_medium: utmField,
  utm_campaign: utmField,
  utm_term: utmField,
  utm_content: utmField,
});

export type RegisterInput = z.input<typeof registerSchema>;
export type RegisterLead = z.output<typeof registerSchema>;
