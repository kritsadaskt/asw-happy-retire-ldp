"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, ButtonLink } from "@/components/ui/Button";
import {
  CheckboxField,
  DateField,
  SelectField,
  TextField,
} from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { register as content } from "@/content/register";
import { site } from "@/content/site";
import { withBasePath } from "@/lib/paths";
import {
  registerSchema,
  type RegisterInput,
  type RegisterLead,
} from "@/lib/validation";

const fields = content.fields;

export function RegisterForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput, unknown, RegisterLead>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phone: "",
      residenceType: "",
      budget: "",
      visitDate: "",
      acceptedTerms: true,
    },
  });

  const acceptedTerms = watch("acceptedTerms");
  const phoneField = registerField("phone");

  // ค่าที่กรอกไว้จะไม่ถูกล้างเมื่อส่งไม่สำเร็จ
  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setIsSending(true);
    try {
      const response = await fetch(withBasePath("/api/register"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        setSubmitError(payload?.message ?? content.errors.submitFailed);
        setIsSending(false);
        return;
      }

      router.push("/thank-you");
    } catch {
      setSubmitError(content.errors.network);
      setIsSending(false);
    }
  });

  return (
    <section id="register" className="scroll-mt-24 bg-cream py-12 md:py-16">
      <div className="shell">
        {/* Three columns only from xl up — below that the copy gets too narrow. */}
        <div className="grid gap-8 rounded-[28px] bg-white p-6 shadow-card md:p-9 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.5fr)_minmax(0,0.92fr)] xl:gap-6 xl:p-10">
          {/* 1 — intro */}
          <div>
            <p className="eyebrow text-navy/50">{content.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              {content.title}
            </h2>
            <p className="mt-2 text-lg font-bold text-navy/85 md:text-xl">
              {content.subtitle}
            </p>
            <p className="mt-1 text-sm text-navy/60">{content.description}</p>

            <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              {content.benefits.map((benefit) => (
                <li
                  key={benefit.title}
                  className="rounded-2xl bg-cream-soft px-4 py-4 text-center"
                >
                  <Icon
                    name={benefit.icon}
                    className="mb-2 block text-xl text-navy"
                  />
                  <p className="text-xs leading-snug font-bold">
                    {benefit.title}
                  </p>
                  {benefit.caption ? (
                    <p className="text-xs leading-snug text-navy/60">
                      {benefit.caption}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* 2 — form */}
          <div className="xl:border-x xl:border-navy/10 xl:px-6">
            <form
              onSubmit={onSubmit}
              noValidate
              className="space-y-4"
              aria-busy={isSending || undefined}
            >
              <TextField
                id="fullName"
                label={fields.fullName.label}
                icon={fields.fullName.icon}
                placeholder={fields.fullName.placeholder}
                required={fields.fullName.required}
                requiredHint={content.requiredHint}
                autoComplete="name"
                error={errors.fullName?.message}
                {...registerField("fullName")}
              />

              <TextField
                id="phone"
                label={fields.phone.label}
                icon={fields.phone.icon}
                placeholder={fields.phone.placeholder}
                required={fields.phone.required}
                requiredHint={content.requiredHint}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                pattern="[0-9]*"
                error={errors.phone?.message}
                {...phoneField}
                onBeforeInput={(event) => {
                  if (event.nativeEvent.inputType === "insertFromPaste") return;
                  if (event.data && /\D/.test(event.data)) {
                    event.preventDefault();
                  }
                }}
                onChange={(event) => {
                  event.target.value = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                  phoneField.onChange(event);
                }}
              />

              <SelectField
                id="residenceType"
                label={fields.residenceType.label}
                icon={fields.residenceType.icon}
                placeholder={fields.residenceType.placeholder}
                options={fields.residenceType.options}
                error={errors.residenceType?.message}
                {...registerField("residenceType")}
              />

              <SelectField
                id="budget"
                label={fields.budget.label}
                icon={fields.budget.icon}
                placeholder={fields.budget.placeholder}
                options={fields.budget.options}
                error={errors.budget?.message}
                {...registerField("budget")}
              />

              <DateField
                id="visitDate"
                label={fields.visitDate.label}
                icon={fields.visitDate.icon}
                placeholder={fields.visitDate.placeholder}
                error={errors.visitDate?.message}
                {...registerField("visitDate")}
              />

              <CheckboxField
                id="acceptedTerms"
                error={
                  !acceptedTerms
                    ? content.errors.termsRequired
                    : errors.acceptedTerms?.message
                }
                {...registerField("acceptedTerms")}
              >
                <label htmlFor="acceptedTerms" className="cursor-pointer">
                  {content.terms.before}{" "}
                </label>
                <a
                  href={content.terms.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-navy underline decoration-navy/30 underline-offset-2 transition hover:decoration-navy"
                >
                  {content.terms.linkLabel}
                </a>
              </CheckboxField>

              {submitError ? (
                <p
                  role="alert"
                  className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {submitError}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                trailingIcon="arrow-right"
                loading={isSending}
                disabled={!acceptedTerms}
                className="w-full"
              >
                {isSending
                  ? content.submit.loadingLabel
                  : content.submit.label}
              </Button>

              <p className="flex items-start justify-center gap-2 text-center text-2xs text-navy/55">
                <Icon name={content.pdpa.icon} className="mt-0.5 shrink-0" />
                <span>{content.pdpa.text}</span>
              </p>
            </form>
          </div>

          {/* 3 — direct contact */}
          <div className="flex flex-col gap-4">
            <div className="xl:text-center">
              <p className="text-sm text-navy/55">{content.contact.kicker}</p>
              <h3 className="text-xl font-bold md:text-2xl">
                {content.contact.title}
              </h3>
            </div>

            <ButtonLink
              href={site.line.href}
              external
              variant="line"
              size="lg"
              className="w-full justify-start gap-4 px-6 text-left whitespace-normal"
            >
              <span className="flex items-center gap-4">
                <span className="inline-flex size-10 shrink-0 items-center justify-center">
                  <Icon name="line" className="block size-10!" />
                </span>
                <span className="block leading-tight">
                  <span className="block text-base font-bold">
                    {site.line.label}
                  </span>
                  <span className="block text-xs font-medium text-white/85">
                    {site.line.caption}
                  </span>
                </span>
              </span>
            </ButtonLink>

            <ButtonLink
              href={site.messenger.href}
              external
              size="lg"
              className="w-full justify-start gap-4 bg-messenger px-6 text-left whitespace-normal hover:brightness-95"
            >
              <span className="flex items-center gap-4">
                <span className="inline-flex size-10 shrink-0 items-center justify-center">
                  <Icon name="messenger" className="block size-10!" />
                </span>
                <span className="block leading-tight">
                  <span className="block text-base font-bold">
                    {site.messenger.label}
                  </span>
                  <span className="block text-xs font-medium text-white/85">
                    {site.messenger.caption}
                  </span>
                </span>
              </span>
            </ButtonLink>

            <a
              href={site.phone.href}
              className="flex items-center gap-4 rounded-2xl bg-cream/60 px-6 py-5 transition hover:bg-cream-deep/60"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy text-white">
                <Icon name="phone" />
              </span>
              <span className="leading-tight">
                <span className="block text-xs text-navy/80">
                  {site.phone.label}
                </span>
                <span className="block text-2xl font-bold whitespace-nowrap text-navy">
                  {site.phone.display}
                </span>
                <span className="block text-xs text-navy/80">
                  {site.officeHours}
                </span>
              </span>
            </a>

            <ul className="mt-auto grid grid-cols-3 gap-2 pt-2">
              {content.contact.trustBadges.map((badge) => (
                <li key={badge.title} className="text-center">
                  <Icon
                    name={badge.icon}
                    className="mb-1.5 block text-lg text-navy/70"
                  />
                  <p className="text-2xs leading-snug font-bold">
                    {badge.title}
                  </p>
                  {badge.caption ? (
                    <p className="text-2xs leading-snug text-navy/55">
                      {badge.caption}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
