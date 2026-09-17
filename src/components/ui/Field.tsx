"use client";

import type { ChangeEvent, ComponentProps, ReactNode, Ref } from "react";
import { useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { IconKey } from "@/lib/icons";

type ShellProps = {
  id: string;
  label: string;
  icon: IconKey;
  required?: boolean;
  requiredHint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
  trailing?: ReactNode;
};

/**
 * Field shell used by every form control: rounded box with a leading icon,
 * the label stacked above the control, and the error message underneath.
 */
function FieldShell({
  id,
  label,
  icon,
  required,
  requiredHint,
  error,
  className,
  children,
  trailing,
}: ShellProps) {
  return (
    <div className={className}>
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-2xl border bg-white px-3 py-2.5 transition",
          "focus-within:border-navy focus-within:ring-4 focus-within:ring-navy/10",
          error ? "border-red-400" : "border-navy/15",
        )}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cream text-sm text-navy">
          <Icon name={icon} />
        </span>

        <span className="min-w-0 flex-1">
          <label
            htmlFor={id}
            title={label}
            className="block truncate text-[0.65rem] leading-tight font-bold tracking-wide text-navy/70"
          >
            {label}
            {required ? (
              <span className="text-red-500" title={requiredHint}>
                {" "}
                *
              </span>
            ) : null}
          </label>
          {children}
        </span>

        {trailing}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 pl-1 text-2xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClass =
  "mt-0.5 w-full border-0 bg-transparent p-0 text-sm leading-tight text-navy placeholder:text-navy/35 focus:outline-none";

type TextFieldProps = Omit<ComponentProps<"input">, "id" | "className"> & {
  id: string;
  label: string;
  icon: IconKey;
  requiredHint?: string;
  error?: string;
  className?: string;
  ref?: Ref<HTMLInputElement>;
};

export function TextField({
  id,
  label,
  icon,
  required,
  requiredHint,
  error,
  className,
  ...rest
}: TextFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      icon={icon}
      required={required}
      requiredHint={requiredHint}
      error={error}
      className={className}
    >
      <input
        id={id}
        className={controlClass}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectFieldProps = Omit<ComponentProps<"select">, "id" | "className"> & {
  id: string;
  label: string;
  icon: IconKey;
  placeholder: string;
  options?: readonly { value: string; label: string }[];
  groups?: readonly {
    label: string;
    options: readonly { value: string; label: string }[];
  }[];
  requiredHint?: string;
  error?: string;
  className?: string;
  ref?: Ref<HTMLSelectElement>;
};

export function SelectField({
  id,
  label,
  icon,
  placeholder,
  options = [],
  groups,
  required,
  requiredHint,
  error,
  className,
  ...rest
}: SelectFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      icon={icon}
      required={required}
      requiredHint={requiredHint}
      error={error}
      className={className}
      trailing={
        <Icon name="chevron-down" className="shrink-0 text-2xs text-navy/45" />
      }
    >
      <select
        id={id}
        className={cn(controlClass, "appearance-none")}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {groups?.length
          ? groups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))
          : options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
      </select>
    </FieldShell>
  );
}

type CheckboxFieldProps = Omit<
  ComponentProps<"input">,
  "id" | "type" | "className"
> & {
  id: string;
  error?: string;
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLInputElement>;
};

export function CheckboxField({
  id,
  error,
  children,
  className,
  ...rest
}: CheckboxFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className={cn(
            "size-4 shrink-0 cursor-pointer rounded border-navy/30 text-navy accent-navy",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        <div className="min-w-0 text-2xs leading-snug text-navy/70">
          {children}
        </div>
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 pl-7 text-2xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

type DateFieldProps = Omit<TextFieldProps, "type"> & { placeholder?: string };

/**
 * Native date input, so the calendar popup and locale formatting come from the
 * browser. An empty date input still renders the browser's own `dd/mm/yyyy`
 * hint, which does not match the design: that text is made transparent through
 * the `data-empty` attribute (see globals.css) and the Thai placeholder from
 * the content file is drawn on top instead.
 */
export function DateField({
  id,
  label,
  icon,
  placeholder,
  required,
  requiredHint,
  error,
  className,
  onChange,
  ...rest
}: DateFieldProps) {
  const [isEmpty, setIsEmpty] = useState(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsEmpty(event.target.value === "");
    onChange?.(event);
  };

  return (
    <FieldShell
      id={id}
      label={label}
      icon={icon}
      required={required}
      requiredHint={requiredHint}
      error={error}
      className={className}
    >
      <span className="relative block">
        <input
          id={id}
          type="date"
          data-empty={isEmpty}
          className={controlClass}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={handleChange}
          {...rest}
        />
        {isEmpty && placeholder ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-navy/35"
          >
            {placeholder}
          </span>
        ) : null}
      </span>
    </FieldShell>
  );
}
