/**
 * 공개 페이지 전용 read 쿼리 모음.
 *
 * - 모든 함수는 `lib/supabase/server.ts` 의 `createClient()` (anon key 기반)
 *   를 사용하므로 RLS 정책의 보호를 받습니다.
 * - `.env.local` 미설정 등으로 Supabase 호출이 실패하더라도 페이지가 깨지지
 *   않도록 catch 후 빈 결과를 반환합니다 (Phase 2 의 fallback UI 그대로 동작).
 */

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import {
  fallbackConsultationFormFields,
  mapConsultationFormFieldRow,
  type PublicConsultationFormField,
} from "@/lib/consultation/fields";
import { mergeSubjectOrder } from "@/lib/teachers/subject-order";
import {
  FALLBACK_HERO_SETTINGS_VERSION,
  fallbackHeroContent,
  resolveMainBanners,
  resolvePopupBanners,
  type PublicHeroContent,
} from "@/lib/home/hero-slides";
import type {
  ConsultationFormField,
  HomeHeroSettings,
  HomeHeroSlide,
  InfoSession,
  Post,
  Teacher,
  TeacherSubjectOrder,
  Timetable,
  TimetableCourse,
} from "@/types/database";
import {
  SCHOOL_GRADES,
  STAFF_SCHOOLS,
  type School,
  type StaffSchool,
  type ViewType,
} from "@/lib/constants";

const PRIVATE_MIDDLE_GRADES = ["middle-1", "middle-2", "middle-3"] as const;

export type TimetableCourseWithTeacher = TimetableCourse & {
  teacher: Pick<Teacher, "id" | "name" | "photo_url" | "subject" | "updated_at"> | null;
};

function hasSupabaseEnv(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * RSC 요청 단위로 결과를 메모이즈하여, 같은 페이지에서 여러 컴포넌트가
 * 같은 쿼리를 호출해도 한 번만 DB 에 가도록 합니다.
 */
async function fetchActiveTimetable(
  school: School,
  grade: string,
  view: ViewType,
): Promise<Timetable | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("timetables")
    .select("*")
    .eq("school", school)
    .eq("grade", grade)
    .eq("view_type", view)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[getTimetable]", error);
    return null;
  }
  return (data as Timetable | null) ?? null;
}

export const getTimetable = cache(
  async (
    school: School,
    grade: string,
    view: ViewType,
  ): Promise<Timetable | null> => {
    if (!hasSupabaseEnv()) return null;

    try {
      const row = await fetchActiveTimetable(school, grade, view);
      if (row) return row;

      if (school === "private" && grade !== "all") {
        const legacyAll = await fetchActiveTimetable(school, "all", view);
        if (legacyAll) return legacyAll;
      }

      if (school === "middle") {
        const legacyHigh =
          grade === "middle-1"
            ? "high-1"
            : grade === "middle-2"
              ? "high-2"
              : grade === "high-3"
                ? "high-3"
                : null;
        if (legacyHigh) {
          return fetchActiveTimetable(school, legacyHigh, view);
        }
        return null;
      }

      if (school !== "private") {
        const legacyGrade =
          grade === "high-1"
            ? "middle-1"
            : grade === "high-2"
              ? "middle-2"
              : grade === "high-3"
                ? "middle-3"
                : null;
        if (legacyGrade) {
          return fetchActiveTimetable(school, legacyGrade, view);
        }
      }

      return null;
    } catch (e) {
      console.error("[getTimetable]", e);
      return null;
    }
  },
);

export const listTimetableCourses = cache(
  async (
    school: School,
    grade: string,
  ): Promise<TimetableCourseWithTeacher[]> => {
    if (!hasSupabaseEnv()) return [];

    try {
      const supabase = createClient();
      const queryByGrade = async (gradeKey: string) => {
        const { data, error } = await supabase
          .from("timetable_courses")
          .select(
            "*, teacher:teachers(id, name, photo_url, subject, updated_at)",
          )
          .eq("school", school)
          .eq("grade", gradeKey)
          .eq("is_active", true)
          .order("subject", { ascending: true })
          .order("order_index", { ascending: true });
        if (error) {
          console.error("[listTimetableCourses]", error);
          return [];
        }
        return (data as unknown as TimetableCourseWithTeacher[] | null) ?? [];
      };

      const rows = await queryByGrade(grade);
      if (rows.length > 0) return rows;

      if (school === "private" && grade !== "all") {
        return queryByGrade("all");
      }

      if (school === "middle") {
        const legacyHigh =
          grade === "middle-1"
            ? "high-1"
            : grade === "middle-2"
              ? "high-2"
              : grade === "middle-3"
                ? "high-3"
                : null;
        if (legacyHigh) return queryByGrade(legacyHigh);
      } else if (school !== "private") {
        const legacyGrade =
          grade === "high-1"
            ? "middle-1"
            : grade === "high-2"
              ? "middle-2"
              : grade === "high-3"
                ? "middle-3"
                : null;
        if (legacyGrade) return queryByGrade(legacyGrade);
      }

      return rows;
    } catch (e) {
      console.error("[listTimetableCourses]", e);
      return [];
    }
  },
);

/**
 * 공개 시간표 페이지에 노출할 학년 탭 목록.
 * 개인 및 팀 수업만 중1~중3을 DB 콘텐츠 유무에 따라 숨깁니다. 고1~고3·타 학교는 항상 전체 학년.
 */
export const listVisibleTimetableGrades = cache(
  async (school: School, view: ViewType): Promise<string[]> => {
    const allGrades = [...SCHOOL_GRADES[school]];

    if (school !== "private") return allGrades;

    const highGrades = allGrades.filter((g) => g.startsWith("high-"));
    if (!hasSupabaseEnv()) return highGrades;

    try {
      const supabase = createClient();
      const gradesWithMiddleData = new Set<string>();

      const { data: timetableRows, error: timetableError } = await supabase
        .from("timetables")
        .select("grade")
        .eq("school", "private")
        .eq("view_type", view)
        .eq("is_active", true)
        .in("grade", [...PRIVATE_MIDDLE_GRADES]);

      if (timetableError) {
        console.error("[listVisibleTimetableGrades] timetables", timetableError);
      } else {
        for (const row of (timetableRows ?? []) as { grade: string }[]) {
          if (row.grade) gradesWithMiddleData.add(row.grade);
        }
      }

      if (view === "detail") {
        const { data: courseRows, error: courseError } = await supabase
          .from("timetable_courses")
          .select("grade")
          .eq("school", "private")
          .eq("is_active", true)
          .in("grade", [...PRIVATE_MIDDLE_GRADES]);

        if (courseError) {
          console.error("[listVisibleTimetableGrades] courses", courseError);
        } else {
          for (const row of (courseRows ?? []) as { grade: string }[]) {
            if (row.grade) gradesWithMiddleData.add(row.grade);
          }
        }
      }

      const visibleMiddle = PRIVATE_MIDDLE_GRADES.filter((g) =>
        gradesWithMiddleData.has(g),
      );

      return [...visibleMiddle, ...highGrades];
    } catch (e) {
      console.error("[listVisibleTimetableGrades]", e);
      return highGrades;
    }
  },
);

const STAFF_SCHOOL_ORDER = Object.fromEntries(
  STAFF_SCHOOLS.map((school, index) => [school, index]),
) as Record<StaffSchool, number>;

function sortTeachersForDisplay(teachers: Teacher[]): Teacher[] {
  return [...teachers].sort((a, b) => {
    const bySchool =
      STAFF_SCHOOL_ORDER[a.school] - STAFF_SCHOOL_ORDER[b.school];
    if (bySchool !== 0) return bySchool;
    if (a.order_index !== b.order_index) {
      return a.order_index - b.order_index;
    }
    return a.name.localeCompare(b.name, "ko", { sensitivity: "base" });
  });
}

export const listTeachers = cache(
  async (school: StaffSchool): Promise<Teacher[]> => {
    if (!hasSupabaseEnv()) return [];

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("school", school)
        .eq("is_active", true)
        .order("order_index", { ascending: true });
      if (error) {
        console.error("[listTeachers]", error);
        return [];
      }
      return (data as Teacher[] | null) ?? [];
    } catch (e) {
      console.error("[listTeachers]", e);
      return [];
    }
  },
);

/** 학교 구분 없이 노출 중인 전체 강사 (대원외고·한영외고·일반고) */
/** 강사진 페이지 과목 해시태그 노출 순서 (활성 강사 과목 기준) */
export const listTeacherSubjectOrder = cache(async (): Promise<string[]> => {
  if (!hasSupabaseEnv()) return [];

  try {
    const supabase = createClient();
    const { data: teacherRows, error: teacherError } = await supabase
      .from("teachers")
      .select("subject")
      .in("school", [...STAFF_SCHOOLS])
      .eq("is_active", true);
    if (teacherError) {
      console.error("[listTeacherSubjectOrder] teachers", teacherError);
      return [];
    }

    const subjectsInUse =
      (teacherRows as Array<{ subject: string }> | null)?.map((r) => r.subject) ??
      [];

    const { data: orderRows, error: orderError } = await supabase
      .from("teacher_subject_orders")
      .select("*")
      .order("order_index", { ascending: true });
    if (orderError) {
      console.error("[listTeacherSubjectOrder] orders", orderError);
      return [];
    }

    return mergeSubjectOrder(
      (orderRows as TeacherSubjectOrder[] | null) ?? [],
      subjectsInUse,
    );
  } catch (e) {
    console.error("[listTeacherSubjectOrder]", e);
    return [];
  }
});

export const listAllTeachers = cache(async (): Promise<Teacher[]> => {
  if (!hasSupabaseEnv()) return [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .in("school", [...STAFF_SCHOOLS])
      .eq("is_active", true);
    if (error) {
      console.error("[listAllTeachers]", error);
      return [];
    }
    return sortTeachersForDisplay((data as Teacher[] | null) ?? []);
  } catch (e) {
    console.error("[listAllTeachers]", e);
    return [];
  }
});

export const listInfoSessions = cache(
  async (
    school: StaffSchool,
  ): Promise<{ upcoming: InfoSession[]; past: InfoSession[] }> => {
    if (!hasSupabaseEnv()) return { upcoming: [], past: [] };

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("info_sessions")
        .select("*")
        .eq("school", school)
        .eq("is_active", true)
        .order("session_date", { ascending: true });
      if (error) {
        console.error("[listInfoSessions]", error);
        return { upcoming: [], past: [] };
      }
      const rows = (data as InfoSession[] | null) ?? [];
      const now = Date.now();
      const upcoming = rows.filter(
        (s) => new Date(s.session_date).getTime() >= now,
      );
      const past = rows
        .filter((s) => new Date(s.session_date).getTime() < now)
        .reverse();
      return { upcoming, past };
    } catch (e) {
      console.error("[listInfoSessions]", e);
      return { upcoming: [], past: [] };
    }
  },
);

/** 목록·이전/다음 탐색용: 예정(가까운 순) → 지난(최근 순). */
export const listInfoSessionsOrdered = cache(
  async (school: StaffSchool): Promise<InfoSession[]> => {
    const { upcoming, past } = await listInfoSessions(school);
    return [...upcoming, ...past];
  },
);

export type InfoSessionWithSiblings = {
  session: InfoSession;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
};

export const getInfoSession = cache(
  async (
    school: StaffSchool,
    id: string,
  ): Promise<InfoSessionWithSiblings | null> => {
    const sessions = await listInfoSessionsOrdered(school);
    const index = sessions.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const session = sessions[index];
    const prev = index > 0 ? sessions[index - 1] : null;
    const next = index < sessions.length - 1 ? sessions[index + 1] : null;

    return {
      session,
      prev: prev ? { id: prev.id, title: prev.title } : null,
      next: next ? { id: next.id, title: next.title } : null,
    };
  },
);

export const listActiveInfoSessionsForSitemap = cache(
  async (): Promise<Pick<InfoSession, "id" | "school" | "updated_at">[]> => {
    if (!hasSupabaseEnv()) return [];

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("info_sessions")
        .select("id, school, updated_at")
        .eq("is_active", true)
        .in("school", [...STAFF_SCHOOLS])
        .order("session_date", { ascending: false });
      if (error) {
        console.error("[listActiveInfoSessionsForSitemap]", error);
        return [];
      }
      return (data as Pick<InfoSession, "id" | "school" | "updated_at">[] | null) ?? [];
    } catch (e) {
      console.error("[listActiveInfoSessionsForSitemap]", e);
      return [];
    }
  },
);

export type ListPostsResult = {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const listPosts = cache(
  async (page: number, pageSize = 10): Promise<ListPostsResult> => {
    const empty: ListPostsResult = {
      posts: [],
      total: 0,
      page: 1,
      pageSize,
      totalPages: 1,
    };
    if (!hasSupabaseEnv()) return empty;

    try {
      const supabase = createClient();

      const { count, error: countErr } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true);
      if (countErr) {
        console.error("[listPosts count]", countErr);
        return empty;
      }
      const total = count ?? 0;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const safePage = Math.min(Math.max(page, 1), totalPages);
      const from = (safePage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) {
        console.error("[listPosts]", error);
        return { ...empty, total, totalPages, page: safePage };
      }
      return {
        posts: (data as Post[] | null) ?? [],
        total,
        page: safePage,
        pageSize,
        totalPages,
      };
    } catch (e) {
      console.error("[listPosts]", e);
      return empty;
    }
  },
);

export type PublishedPostSeoRow = Pick<
  Post,
  "id" | "title" | "content_html" | "created_at" | "updated_at"
>;

export const listPublishedPostsForSitemap = cache(
  async (): Promise<Pick<Post, "id" | "updated_at">[]> => {
    if (!hasSupabaseEnv()) return [];

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("id, updated_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("[listPublishedPostsForSitemap]", error);
        return [];
      }
      return (data as Pick<Post, "id" | "updated_at">[] | null) ?? [];
    } catch (e) {
      console.error("[listPublishedPostsForSitemap]", e);
      return [];
    }
  },
);

export const listPublishedPostsForFeed = cache(
  async (limit = 50): Promise<PublishedPostSeoRow[]> => {
    if (!hasSupabaseEnv()) return [];

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content_html, created_at, updated_at")
        .eq("is_published", true)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) {
        console.error("[listPublishedPostsForFeed]", error);
        return [];
      }
      return (data as PublishedPostSeoRow[] | null) ?? [];
    } catch (e) {
      console.error("[listPublishedPostsForFeed]", e);
      return [];
    }
  },
);

export type PostWithSiblings = {
  post: Post;
  prev: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
};

export const getPost = cache(
  async (id: string): Promise<PostWithSiblings | null> => {
    if (!hasSupabaseEnv()) return null;

    try {
      const supabase = createClient();
      const { data: postData, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .maybeSingle();
      if (error || !postData) {
        if (error) console.error("[getPost]", error);
        return null;
      }
      const post = postData as unknown as Post;

      const [prevRes, nextRes] = await Promise.all([
        supabase
          .from("posts")
          .select("id,title,created_at")
          .eq("is_published", true)
          .lt("created_at", post.created_at)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("posts")
          .select("id,title,created_at")
          .eq("is_published", true)
          .gt("created_at", post.created_at)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);

      const prev = prevRes.data as unknown as
        | { id: string; title: string; created_at: string }
        | null;
      const next = nextRes.data as unknown as
        | { id: string; title: string; created_at: string }
        | null;

      return {
        post,
        prev: prev ? { id: prev.id, title: prev.title } : null,
        next: next ? { id: next.id, title: next.title } : null,
      };
    } catch (e) {
      console.error("[getPost]", e);
      return null;
    }
  },
);

/**
 * 게시글 조회수 +1. 실패해도 페이지 렌더를 막지 않도록 silent.
 * `cache()` 로 감싸지 않아 같은 요청 내 한 번만 호출되도록 호출 측에서 보장.
 */
export const getHomeHeroContent = cache(async (): Promise<PublicHeroContent> => {
  if (!hasSupabaseEnv()) return fallbackHeroContent();

  try {
    const supabase = createClient();
    const [slidesRes, settingsRes] = await Promise.all([
      supabase
        .from("home_hero_slides")
        .select("*")
        .order("slot", { ascending: true }),
      supabase
        .from("home_hero_settings")
        .select("updated_at")
        .eq("id", 1)
        .maybeSingle(),
    ]);

    if (slidesRes.error) {
      console.error("[getHomeHeroContent:slides]", slidesRes.error);
    }
    if (settingsRes.error) {
      console.error("[getHomeHeroContent:settings]", settingsRes.error);
    }

    const rows = (slidesRes.data as HomeHeroSlide[] | null) ?? [];

    const mainSlides =
      rows.length > 0 && !slidesRes.error
        ? resolveMainBanners(rows)
        : fallbackHeroContent().mainSlides;

    const popupSlides =
      rows.length > 0 && !slidesRes.error ? resolvePopupBanners(rows) : [];

    const settings = settingsRes.data as Pick<
      HomeHeroSettings,
      "updated_at"
    > | null;

    const versionCandidates = [
      !settingsRes.error ? settings?.updated_at : null,
      ...rows.map((r) => r.updated_at),
    ].filter((v): v is string => Boolean(v));

    const settingsUpdatedAt =
      versionCandidates.length > 0
        ? versionCandidates.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))[0]
        : FALLBACK_HERO_SETTINGS_VERSION;

    return { mainSlides, popupSlides, settingsUpdatedAt };
  } catch (e) {
    console.error("[getHomeHeroContent]", e);
    return fallbackHeroContent();
  }
});

export const getConsultationFormFields = cache(
  async (): Promise<PublicConsultationFormField[]> => {
    if (!hasSupabaseEnv()) return fallbackConsultationFormFields();

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("consultation_form_fields")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) {
        console.error("[getConsultationFormFields]", error);
        return fallbackConsultationFormFields();
      }

      const rows = (data as ConsultationFormField[] | null) ?? [];
      if (rows.length === 0) return fallbackConsultationFormFields();

      return rows.map(mapConsultationFormFieldRow);
    } catch (e) {
      console.error("[getConsultationFormFields]", e);
      return fallbackConsultationFormFields();
    }
  },
);

export async function incrementPostViewCount(postId: string): Promise<void> {
  if (!hasSupabaseEnv()) return;
  try {
    const supabase = createClient();
    const { data, error: readErr } = await supabase
      .from("posts")
      .select("view_count")
      .eq("id", postId)
      .maybeSingle();
    if (readErr || !data) return;
    const row = data as unknown as { view_count: number };
    const next = (row.view_count ?? 0) + 1;
    await supabase
      .from("posts")
      .update({ view_count: next } as never)
      .eq("id", postId);
  } catch (e) {
    console.error("[incrementPostViewCount]", e);
  }
}
