import type { IconKey } from "@/lib/icons";

export type { IconKey };

export type ImageContent = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type LinkContent = {
  label: string;
  href: string;
  /** true = open in a new tab */
  external?: boolean;
};

export type IconLinkContent = LinkContent & {
  icon: IconKey;
  /** small line of text under the label */
  caption?: string;
};

export type FeatureContent = {
  icon: IconKey;
  title: string;
  caption?: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type FieldContent = {
  label: string;
  placeholder: string;
  icon: IconKey;
  required?: boolean;
};

export type SelectFieldContent = FieldContent & {
  options: SelectOption[];
};
