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

export type SchoolType =
  | "daewon"
  | "hanyoung"
  | "general"
  | "middle"
  | "private";

/** 시간표·상세 강의 — `school_type` enum 전체 */
export type TimetableSchool = SchoolType;

/** 강사진·설명회 — DB check 제약으로 middle/private 제외 */
export type StaffSchool = "daewon" | "hanyoung" | "general";
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
  image_urls: string[];
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
  /** 해시태그 (예: #대원탭스,#대원TEPS) — 콤마로 여러 개 */
  tag: string | null;
  tag_bg_color: string | null;
  tag_text_color: string | null;
  /** 상태 뱃지 (예: 마감, 마감임박) — 해시태그와 별도 */
  status_tag: string | null;
  status_tag_bg_color: string | null;
  status_tag_text_color: string | null;
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
  | "tag_bg_color"
  | "tag_text_color"
  | "status_tag"
  | "status_tag_bg_color"
  | "status_tag_text_color"
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
  tag_bg_color?: string | null;
  tag_text_color?: string | null;
  status_tag?: string | null;
  status_tag_bg_color?: string | null;
  status_tag_text_color?: string | null;
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

export type TeacherSubjectOrder = {
  subject: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type TeacherSubjectOrderInsert = Omit<
  TeacherSubjectOrder,
  "created_at" | "updated_at"
> & {
  created_at?: string;
  updated_at?: string;
};

export type TeacherSubjectOrderUpdate = Partial<TeacherSubjectOrderInsert>;

/** 상세 시간표 과목 노출 순서 (강사 과목 순서와 동일 스키마) */
export type TimetableSubjectOrder = {
  subject: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type TimetableSubjectOrderInsert = Omit<
  TimetableSubjectOrder,
  "created_at" | "updated_at"
> & {
  created_at?: string;
  updated_at?: string;
};

export type TimetableSubjectOrderUpdate = Partial<TimetableSubjectOrderInsert>;

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

export type ConsultationStatus = "new" | "read" | "archived";

export type ConsultationFieldType = "text" | "tel" | "textarea";

export type ConsultationFormField = {
  id: string;
  field_key: string;
  label: string;
  field_type: ConsultationFieldType;
  placeholder: string | null;
  is_required: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ConsultationFormFieldInsert = Omit<
  ConsultationFormField,
  "id" | "created_at" | "updated_at" | "placeholder" | "is_active"
> & {
  id?: string;
  placeholder?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ConsultationFormFieldUpdate = Partial<ConsultationFormFieldInsert>;

export type ConsultationResponses = Record<string, string>;

export type ConsultationRequest = {
  id: string;
  student_name: string | null;
  parent_name: string | null;
  phone: string | null;
  school_grade: string | null;
  subject: string | null;
  message: string | null;
  responses: ConsultationResponses;
  status: ConsultationStatus;
  created_at: string;
  updated_at: string;
};

export type ConsultationRequestInsert = {
  responses: ConsultationResponses;
  status?: ConsultationStatus;
  student_name?: string | null;
  parent_name?: string | null;
  phone?: string | null;
  school_grade?: string | null;
  subject?: string | null;
  message?: string | null;
};

export type ConsultationRequestUpdate = Partial<ConsultationRequestInsert>;

/** 메인 히어로 슬라이더 슬롯 (1~3) */
export type HomeHeroSlideSlot = 1 | 2 | 3;

export type HomeHeroSlide = {
  slot: HomeHeroSlideSlot;
  tagline: string;
  main_headline: string;
  subtitle: string | null;
  href: string;
  background_image_url: string | null;
  is_active: boolean;
  show_in_main: boolean;
  show_in_popup: boolean;
  created_at: string;
  updated_at: string;
};

export type HomePopupBanner = {
  slot: HomeHeroSlideSlot;
  href: string;
  background_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type HomePopupBannerInsert = Omit<
  HomePopupBanner,
  "created_at" | "updated_at" | "background_image_url" | "is_active"
> & {
  background_image_url?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type HomePopupBannerUpdate = Partial<HomePopupBannerInsert>;

export type HomeHeroSlideInsert = Omit<
  HomeHeroSlide,
  | "created_at"
  | "updated_at"
  | "subtitle"
  | "background_image_url"
  | "is_active"
  | "show_in_main"
  | "show_in_popup"
> & {
  subtitle?: string | null;
  background_image_url?: string | null;
  is_active?: boolean;
  show_in_main?: boolean;
  show_in_popup?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type HomeHeroSlideUpdate = Partial<HomeHeroSlideInsert>;

export type HomeHeroSettings = {
  id: 1;
  cta_label: string;
  popup_enabled: boolean;
  updated_at: string;
};

export type HomeHeroSettingsInsert = Omit<
  HomeHeroSettings,
  "updated_at"
> & {
  updated_at?: string;
};

export type HomeHeroSettingsUpdate = Partial<HomeHeroSettingsInsert>;

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
      teacher_subject_orders: {
        Row: TeacherSubjectOrder;
        Insert: TeacherSubjectOrderInsert;
        Update: TeacherSubjectOrderUpdate;
      };
      timetable_subject_orders: {
        Row: TimetableSubjectOrder;
        Insert: TimetableSubjectOrderInsert;
        Update: TimetableSubjectOrderUpdate;
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
      consultation_form_fields: {
        Row: ConsultationFormField;
        Insert: ConsultationFormFieldInsert;
        Update: ConsultationFormFieldUpdate;
      };
      consultation_requests: {
        Row: ConsultationRequest;
        Insert: ConsultationRequestInsert;
        Update: ConsultationRequestUpdate;
      };
      home_hero_slides: {
        Row: HomeHeroSlide;
        Insert: HomeHeroSlideInsert;
        Update: HomeHeroSlideUpdate;
      };
      home_popup_banners: {
        Row: HomePopupBanner;
        Insert: HomePopupBannerInsert;
        Update: HomePopupBannerUpdate;
      };
      home_hero_settings: {
        Row: HomeHeroSettings;
        Insert: HomeHeroSettingsInsert;
        Update: HomeHeroSettingsUpdate;
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
