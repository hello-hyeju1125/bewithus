import { z } from "zod";

import { SCHOOLS, SCHOOL_GRADES, STAFF_SCHOOLS } from "@/lib/constants";

const schoolEnum = z.enum(SCHOOLS as unknown as [string, ...string[]]);
const staffSchoolEnum = z.enum(
  STAFF_SCHOOLS as unknown as [string, ...string[]],
);

export const timetableFormSchema = z
  .object({
    school: schoolEnum,
    grade: z.string().min(1, "학년을 선택하세요."),
    view_type: z.enum(["summary", "detail"]),
    year: z
      .number()
      .int("연도는 정수여야 합니다.")
      .min(2020)
      .max(2099),
    semester: z.string().min(1, "학기를 입력하세요."),
    description: z.string().max(500).optional().or(z.literal("")),
    image_url: z.string().min(1, "이미지를 업로드하세요."),
    is_active: z.boolean(),
  })
  .refine(
    (v) => SCHOOL_GRADES[v.school as keyof typeof SCHOOL_GRADES]?.includes(v.grade),
    {
      message: "선택한 학교에 해당하는 학년이 아닙니다.",
      path: ["grade"],
    },
  );

export type TimetableFormValues = z.infer<typeof timetableFormSchema>;

export const teacherFormSchema = z.object({
  name: z.string().min(1, "이름을 입력하세요."),
  school: staffSchoolEnum,
  subject: z.string().min(1, "과목을 입력하세요."),
  bio: z.string().max(500).optional().or(z.literal("")),
  photo_url: z.string().url().optional().or(z.literal("")),
  order_index: z.number().int().min(0),
  is_active: z.boolean(),
});

export type TeacherFormValues = z.infer<typeof teacherFormSchema>;

export const infoSessionFormSchema = z.object({
  school: staffSchoolEnum,
  title: z.string().min(1, "제목을 입력하세요."),
  descriptionJson: z.string().optional().or(z.literal("")),
  session_date: z.string().min(1, "날짜·시간을 선택하세요."),
  location: z.string().max(200).optional().or(z.literal("")),
  registration_url: z.string().url().optional().or(z.literal("")),
  is_active: z.boolean(),
});

export type InfoSessionFormValues = z.infer<typeof infoSessionFormSchema>;

export const postFormSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요.").max(200),
  contentJson: z.string().min(1, "본문을 입력하세요."),
  is_pinned: z.boolean(),
  is_published: z.boolean(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const teacherOrderUpdateSchema = z.object({
  updates: z.array(
    z.object({
      id: z.string().uuid(),
      order_index: z.number().int().min(0),
    }),
  ),
});

export const teacherSubjectOrderUpdateSchema = z.object({
  updates: z.array(
    z.object({
      subject: z.string().min(1),
      order_index: z.number().int().min(0),
    }),
  ),
});

const courseSessionSchema = z.object({
  day_time: z.string().min(1, "시간을 입력하세요.").max(120),
  is_full: z.boolean().optional(),
});

const applyButtonVariantSchema = z.enum(["primary", "secondary", "waitlist"]);

const applyButtonSchema = z.object({
  label: z.string().min(1, "버튼 라벨을 입력하세요.").max(40),
  url: z.string().url("올바른 URL 을 입력하세요."),
  variant: applyButtonVariantSchema.optional(),
});

export const timetableCourseFormSchema = z
  .object({
    school: schoolEnum,
    grade: z.string().min(1, "학년을 선택하세요."),
    year: z.number().int().min(2020).max(2099),
    semester: z.string().min(1, "학기를 입력하세요."),
    subject: z.string().min(1, "과목을 입력하세요.").max(40),
    teacher_id: z.string().uuid("강사를 선택하세요."),
    course_title: z.string().min(1, "강의명을 입력하세요.").max(200),
    course_subtitle: z.string().max(200).optional().or(z.literal("")),
    course_note: z.string().max(500).optional().or(z.literal("")),
    tag: z.string().max(40).optional().or(z.literal("")),
    sessions: z.array(courseSessionSchema).min(1, "요일/시간을 최소 1개 추가하세요.").max(20),
    start_dates: z.array(z.string().min(1).max(40)).max(20),
    apply_buttons: z.array(applyButtonSchema).max(6),
    detail_url: z.string().url().optional().or(z.literal("")),
    order_index: z.number().int().min(0),
    is_active: z.boolean(),
  })
  .refine(
    (v) => SCHOOL_GRADES[v.school as keyof typeof SCHOOL_GRADES]?.includes(v.grade),
    {
      message: "선택한 학교에 해당하는 학년이 아닙니다.",
      path: ["grade"],
    },
  );

export type TimetableCourseFormValues = z.infer<
  typeof timetableCourseFormSchema
>;

export const homeHeroSlideFormSchema = z.object({
  tagline: z.string().min(1, "상단 라벨을 입력하세요.").max(80),
  main_headline: z
    .string()
    .min(1, "메인 제목을 입력하세요.")
    .max(120),
  subtitle: z.string().max(80).optional().or(z.literal("")),
  href: z
    .string()
    .min(1, "링크 경로를 입력하세요.")
    .max(200)
    .refine((v) => v.startsWith("/"), {
      message: "내부 링크는 / 로 시작해야 합니다.",
    }),
  background_image_url: z.string().optional().or(z.literal("")),
  is_active: z.boolean(),
});

export type HomeHeroSlideFormValues = z.infer<typeof homeHeroSlideFormSchema>;

export const homeHeroSettingsFormSchema = z.object({
  cta_label: z.string().min(1, "CTA 문구를 입력하세요.").max(40),
  popup_enabled: z.boolean(),
});

export type HomeHeroSettingsFormValues = z.infer<
  typeof homeHeroSettingsFormSchema
>;
