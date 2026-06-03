import type {
  ConsultationFormField,
  ConsultationRequest,
  ConsultationResponses,
} from "@/types/database";

import {
  getConsultationDisplayPhone,
  getConsultationDisplayTitle,
} from "@/lib/consultation/fields";

export function getRequestResponses(
  request: ConsultationRequest,
): ConsultationResponses {
  if (request.responses && Object.keys(request.responses).length > 0) {
    return request.responses;
  }
  const legacy: ConsultationResponses = {};
  if (request.student_name) legacy.student_name = request.student_name;
  if (request.parent_name) legacy.parent_name = request.parent_name;
  if (request.phone) legacy.phone = request.phone;
  if (request.school_grade) legacy.school_grade = request.school_grade;
  if (request.subject) legacy.subject = request.subject;
  if (request.message) legacy.message = request.message;
  return legacy;
}

export function buildResponseDisplayRows(
  responses: ConsultationResponses,
  fieldDefs: ConsultationFormField[],
): { key: string; label: string; value: string }[] {
  const labelByKey = new Map(
    fieldDefs.map((f) => [f.field_key, f.label]),
  );
  const orderedKeys = fieldDefs.map((f) => f.field_key);
  const extraKeys = Object.keys(responses).filter(
    (k) => !orderedKeys.includes(k),
  );
  const keys = [...orderedKeys, ...extraKeys];

  return keys
    .filter((key) => responses[key]?.trim())
    .map((key) => ({
      key,
      label: labelByKey.get(key) ?? key,
      value: responses[key],
    }));
}

export { getConsultationDisplayTitle, getConsultationDisplayPhone };
