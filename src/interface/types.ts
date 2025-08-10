// src/types.ts
export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];      // for select / radio / checkbox
  required?: boolean;
  defaultValue?: any;
  validation?: "none" | "email" | "password";
  minLength?: number;
  maxLength?: number;
  min?: number;            // numeric min
  max?: number;            // numeric max
}

export interface FormTemplate {
  id: string;
  title: string;
  fields: FormField[];
  createdAt: string;
}
