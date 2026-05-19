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
import type {
  InfoSession,
  Post,
  Teacher,
  Timetable,
  TimetableCourse,
} from "@/types/database";
import type { School, StaffSchool, ViewType } from "@/lib/constants";

export type TimetableCourseWithTeacher = TimetableCourse & {
  teacher: Pick<Teacher, "id" | "name" | "photo_url" | "subject"> | null;
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
export const getTimetable = cache(
  async (
    school: School,
    grade: string,
    view: ViewType,
  ): Promise<Timetable | null> => {
    if (!hasSupabaseEnv()) return null;

    try {
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
      if (data) return data as Timetable;

      const legacyGrade =
        grade === "high-1"
          ? "middle-1"
          : grade === "high-2"
            ? "middle-2"
            : grade === "high-3"
              ? "middle-3"
              : null;
      if (!legacyGrade) return null;

      const { data: legacyData, error: legacyError } = await supabase
        .from("timetables")
        .select("*")
        .eq("school", school)
        .eq("grade", legacyGrade)
        .eq("view_type", view)
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (legacyError) {
        console.error("[getTimetable] legacy grade", legacyError);
        return null;
      }
      return (legacyData as Timetable | null) ?? null;
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
      const { data, error } = await supabase
        .from("timetable_courses")
        .select(
          "*, teacher:teachers(id, name, photo_url, subject)",
        )
        .eq("school", school)
        .eq("grade", grade)
        .eq("is_active", true)
        .order("subject", { ascending: true })
        .order("order_index", { ascending: true });
      if (error) {
        console.error("[listTimetableCourses]", error);
        return [];
      }
      return (data as unknown as TimetableCourseWithTeacher[] | null) ?? [];
    } catch (e) {
      console.error("[listTimetableCourses]", e);
      return [];
    }
  },
);

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
