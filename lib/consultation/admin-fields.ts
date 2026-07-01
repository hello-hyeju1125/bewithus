import { z } from "zod";

export const consultationFieldAdminItemSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  field_key: z.string().max(64).optional().or(z.literal("")),
  label: z.string().trim().min(1, "항목 제목을 입력하세요.").max(80),
  field_type: z.enum(["text", "tel", "textarea"]),
  placeholder: z.string().max(120).optional().or(z.literal("")),
  is_required: z.boolean(),
});

export const consultationFieldsSaveSchema = z
  .object({
    fields: z
      .array(consultationFieldAdminItemSchema)
      .min(1, "최소 1개의 항목이 필요합니다.")
      .max(20, "항목은 최대 20개까지 등록할 수 있습니다."),
  })
  .superRefine((data, ctx) => {
    const keys = data.fields
      .map((f) => f.field_key?.trim())
      .filter((k) => k && k.length > 0);
    const unique = new Set(keys);
    if (unique.size !== keys.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "항목 키가 중복되었습니다.",
        path: ["fields"],
      });
    }
  });

export type ConsultationFieldAdminItem = z.infer<
  typeof consultationFieldAdminItemSchema
>;

export function slugifyFieldKey(label: string): string {
  const ascii = label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32);
  const suffix = Math.random().toString(36).slice(2, 8);
  return ascii.length >= 2 ? `${ascii}_${suffix}` : `field_${suffix}`;
}
