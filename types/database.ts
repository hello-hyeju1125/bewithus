/**
 * Supabase 데이터베이스 타입 정의 (수동 작성).
 *
 * 실제 운영 환경에서는 아래 명령으로 자동 생성된 타입으로 교체하는 것을 권장합니다.
 *
 *   npx supabase gen types typescript --project-id <YOUR_PROJECT_REF> \
 *     --schema public > types/database.ts
 *
 * 자동 생성 전까지는 이 파일이 단일 진실 공급원(SSOT) 역할을 합니다.
 * supabase/migrations/001_initial.sql 과 항상 동기화하세요.
 */

export type SchoolType = "daewon" | "hanyoung" | "general" | "private";
export type TimetableSchool = SchoolType;
export type StaffSchool = Exclude<SchoolType, "private">;
export type ViewType = "summary" | "detail";

/**
 * Tiptap 의 ProseMirror JSON 문서 구조.
 * 실제 Tiptap 통합 시 `@tiptap/core` 의 `JSONContent` 로 대체 가능합니다.
 */
export type TiptapJSON = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapJSON[];
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
  [key: string]: unknown;
};

export type CareerItem = {
  year?: string;
  title: string;
  description?: string;
};

export type Timetable = {
  id: string;
  school: TimetableSchool;
  grade: string;
  view_type: ViewType;
  image_url: string;
  description: string | null;
  year: number;
  semester: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TimetableInsert = Omit<
  Timetable,
  "id" | "created_at" | "updated_at" | "is_active" | "description"
> & {
  id?: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TimetableUpdate = Partial<TimetableInsert>;

/** 상세 시간표의 요일/시간 한 줄 (마감 여부 포함) */
export type CourseSession = {
  day_time: string;
  is_full?: boolean;
};

/** 강의 신청 버튼 (전반/대기/수강 등 다중 라벨 지원) */
export type CourseApplyButtonVariant = "primary" | "secondary" | "waitlist";

export type CourseApplyButton = {
  label: string;
  url: string;
  variant?: CourseApplyButtonVariant;
};

export type TimetableCourse = {
  id: string;
  school: SchoolType;
  grade: string;
  year: number;
  semester: string;
  subject: string;
  teacher_id: string;
  course_title: string;
  course_subtitle: string | null;
  course_note: string | null;
  tag: string | null;
  sessions: CourseSession[];
  start_dates: string[];
  apply_buttons: CourseApplyButton[];
  detail_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TimetableCourseInsert = Omit<
  TimetableCourse,
  | "id"
  | "created_at"
  | "updated_at"
  | "is_active"
  | "course_subtitle"
  | "course_note"
  | "tag"
  | "detail_url"
  | "order_index"
  | "sessions"
  | "start_dates"
  | "apply_buttons"
> & {
  id?: string;
  course_subtitle?: string | null;
  course_note?: string | null;
  tag?: string | null;
  detail_url?: string | null;
  sessions?: CourseSession[];
  start_dates?: string[];
  apply_buttons?: CourseApplyButton[];
  order_index?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TimetableCourseUpdate = Partial<TimetableCourseInsert>;

export type Teacher = {
  id: string;
  name: string;
  school: StaffSchool;
  subject: string;
  bio: string | null;
  photo_url: string | null;
  career: CareerItem[];
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TeacherInsert = Omit<
  Teacher,
  | "id"
  | "created_at"
  | "updated_at"
  | "is_active"
  | "bio"
  | "photo_url"
  | "career"
  | "order_index"
> & {
  id?: string;
  bio?: string | null;
  photo_url?: string | null;
  career?: CareerItem[];
  order_index?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TeacherUpdate = Partial<TeacherInsert>;

export type InfoSession = {
  id: string;
  school: StaffSchool;
  title: string;
  description: string | null;
  description_json?: TiptapJSON | null;
  description_html?: string | null;
  session_date: string;
  location: string | null;
  capacity: number | null;
  registration_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type InfoSessionInsert = Omit<
  InfoSession,
  | "id"
  | "created_at"
  | "updated_at"
  | "is_active"
  | "description"
  | "description_json"
  | "description_html"
  | "location"
  | "capacity"
  | "registration_url"
> & {
  id?: string;
  description?: string | null;
  description_json?: TiptapJSON | null;
  description_html?: string | null;
  location?: string | null;
  capacity?: number | null;
  registration_url?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type InfoSessionUpdate = Partial<InfoSessionInsert>;

export type Post = {
  id: string;
  title: string;
  content: TiptapJSON;
  content_html: string;
  author_id: string;
  view_count: number;
  is_pinned: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type PostInsert = Omit<
  Post,
  | "id"
  | "created_at"
  | "updated_at"
  | "view_count"
  | "is_pinned"
  | "is_published"
> & {
  id?: string;
  view_count?: number;
  is_pinned?: boolean;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PostUpdate = Partial<PostInsert>;

export type PostAttachment = {
  id: string;
  post_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
};

export type PostAttachmentInsert = Omit<PostAttachment, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type PostAttachmentUpdate = Partial<PostAttachmentInsert>;

/**
 * Supabase 클라이언트에 제네릭으로 주입할 전체 스키마 타입.
 * `createClient<Database>(...)` 형태로 사용합니다.
 */
export type Database = {
  public: {
    Tables: {
      timetables: {
        Row: Timetable;
        Insert: TimetableInsert;
        Update: TimetableUpdate;
      };
      timetable_courses: {
        Row: TimetableCourse;
        Insert: TimetableCourseInsert;
        Update: TimetableCourseUpdate;
      };
      teachers: {
        Row: Teacher;
        Insert: TeacherInsert;
        Update: TeacherUpdate;
      };
      info_sessions: {
        Row: InfoSession;
        Insert: InfoSessionInsert;
        Update: InfoSessionUpdate;
      };
      posts: {
        Row: Post;
        Insert: PostInsert;
        Update: PostUpdate;
      };
      post_attachments: {
        Row: PostAttachment;
        Insert: PostAttachmentInsert;
        Update: PostAttachmentUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      school_type: SchoolType;
      timetable_view_type: ViewType;
    };
    CompositeTypes: Record<string, never>;
  };
};
