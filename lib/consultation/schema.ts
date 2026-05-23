import { z } from "zod";

const phoneRegex = /^[\d\s\-+()]{9,20}$/;

export const consultationFormSchema = z.object({
  student_name: z.string().trim().min(1, "학생 이름을 입력하세요.").max(50),
  parent_name: z.string().trim().min(1, "학부모 성함을 입력하세요.").max(50),
  phone: z
    .string()
    .trim()
    .min(1, "전화번호를 입력하세요.")
    .max(20)
    .regex(phoneRegex, "올바른 전화번호 형식이 아닙니다."),
  school_grade: z
    .string()
    .trim()
    .min(1, "학교 및 학년을 입력하세요.")
    .max(100),
  subject: z.string().trim().min(1, "과목을 입력하세요.").max(100),
  message: z
    .string()
    .trim()
    .min(1, "상담 내용을 입력하세요.")
    .max(2000),
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;
