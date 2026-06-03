import { z } from "zod";

import { ko } from "@/content/ko";
import type { ConsultationFormField } from "@/types/database";

export type ConsultationFieldType = "text" | "tel" | "textarea";

export type PublicConsultationFormField = {
  id: string;
  fieldKey: string;
  label: string;
  fieldType: ConsultationFieldType;
  placeholder?: string;
  isRequired: boolean;
  orderIndex: number;
};

const phoneRegex = /^[\d\s\-+()]{9,20}$/;

const FALLBACK_FIELDS: PublicConsultationFormField[] = [
  {
    id: "fallback-student_name",
    fieldKey: "student_name",
    label: ko.consultation.fields.studentName,
    fieldType: "text",
    isRequired: true,
    orderIndex: 0,
  },
  {
    id: "fallback-parent_name",
    fieldKey: "parent_name",
    label: ko.consultation.fields.parentName,
    fieldType: "text",
    isRequired: true,
    orderIndex: 1,
  },
  {
    id: "fallback-phone",
    fieldKey: "phone",
    label: ko.consultation.fields.phone,
    fieldType: "tel",
    placeholder: "010-0000-0000",
    isRequired: true,
    orderIndex: 2,
  },
  {
    id: "fallback-school_grade",
    fieldKey: "school_grade",
    label: ko.consultation.fields.schoolGrade,
    fieldType: "text",
    placeholder: "예: ○○고등학교 2학년",
    isRequired: true,
    orderIndex: 3,
  },
  {
    id: "fallback-subject",
    fieldKey: "subject",
    label: ko.consultation.fields.subject,
    fieldType: "text",
    placeholder: "예: 수학, 영어",
    isRequired: true,
    orderIndex: 4,
  },
  {
    id: "fallback-message",
    fieldKey: "message",
    label: ko.consultation.fields.message,
    fieldType: "textarea",
    isRequired: true,
    orderIndex: 5,
  },
];

export function fallbackConsultationFormFields(): PublicConsultationFormField[] {
  return FALLBACK_FIELDS;
}

export function mapConsultationFormFieldRow(
  row: ConsultationFormField,
): PublicConsultationFormField {
  return {
    id: row.id,
    fieldKey: row.field_key,
    label: row.label,
    fieldType: row.field_type as ConsultationFieldType,
    placeholder: row.placeholder?.trim() || undefined,
    isRequired: row.is_required,
    orderIndex: row.order_index,
  };
}

export function buildConsultationFormSchema(
  fields: PublicConsultationFormField[],
) {
  const shape: Record<string, z.ZodType<string | undefined>> = {};

  for (const field of fields) {
    let schema = z.string().trim();

    if (field.fieldType === "textarea") {
      schema = schema.max(2000, `${field.label}은(는) 2000자 이하여야 합니다.`);
    } else if (field.fieldType === "tel") {
      schema = schema
        .max(20)
        .regex(phoneRegex, `${field.label} 형식이 올바르지 않습니다.`);
    } else {
      schema = schema.max(200, `${field.label}은(는) 200자 이하여야 합니다.`);
    }

    shape[field.fieldKey] = field.isRequired
      ? schema.min(1, `${field.label}을(를) 입력하세요.`)
      : schema.optional().or(z.literal(""));
  }

  return z.object(shape);
}

export function parseConsultationFormData(
  formData: FormData,
  fields: PublicConsultationFormField[],
) {
  const raw: Record<string, unknown> = {};
  for (const field of fields) {
    raw[field.fieldKey] = formData.get(field.fieldKey);
  }
  return buildConsultationFormSchema(fields).safeParse(raw);
}

export type ConsultationResponses = Record<string, string>;

export function normalizeConsultationResponses(
  data: Record<string, string | undefined>,
): ConsultationResponses {
  const out: ConsultationResponses = {};
  for (const [key, value] of Object.entries(data)) {
    if (value != null && String(value).trim() !== "") {
      out[key] = String(value).trim();
    }
  }
  return out;
}

/** 접수 건 제목·목록용 대표 값 */
export function getConsultationDisplayTitle(
  responses: ConsultationResponses,
): string {
  return (
    responses.student_name ??
    responses.parent_name ??
    Object.values(responses)[0] ??
    "(미입력)"
  );
}

export function getConsultationDisplayPhone(
  responses: ConsultationResponses,
): string {
  return responses.phone ?? "—";
}
