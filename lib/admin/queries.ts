import "server-only";

import { cache } from "react";

import { createAdminClient } from "@/lib/supabase/admin";
import type {
  InfoSession,
  Post,
  Teacher,
  Timetable,
  TimetableCourse,
} from "@/types/database";

export type AdminCourseWithTeacher = TimetableCourse & {
  teacher: Pick<Teacher, "id" | "name" | "school"> | null;
};

/**
 * 관리자 페이지 전용 read 함수 모음.
 *
 * 공개 페이지용 `lib/supabase/queries.ts` 와 달리 `is_active=false`,
 * `is_published=false` 인 항목도 모두 노출합니다. service_role 클라이언트로
 * 조회하며, `/admin` 미들웨어·Server Action 의 세션 검증과 함께 사용합니다.
 */

export const adminListTimetables = cache(
  async (filters?: {
    school?: string;
    grade?: string;
    semester?: string;
  }): Promise<Timetable[]> => {
    try {
      const supabase = createAdminClient();
      let q = supabase
        .from("timetables")
        .select("*")
        .order("school", { ascending: true })
        .order("grade", { ascending: true })
        .order("view_type", { ascending: true });
      if (filters?.school) q = q.eq("school", filters.school);
      if (filters?.grade) q = q.eq("grade", filters.grade);
      if (filters?.semester) q = q.eq("semester", filters.semester);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as Timetable[]) ?? [];
    } catch (e) {
      console.error("[adminListTimetables]", e);
      return [];
    }
  },
);

export const adminGetTimetable = cache(
  async (id: string): Promise<Timetable | null> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("timetables")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Timetable | null) ?? null;
    } catch (e) {
      console.error("[adminGetTimetable]", e);
      return null;
    }
  },
);

export const adminFindTimetableByKey = cache(
  async (params: {
    school: string;
    grade: string;
    view_type: string;
    year: number;
    semester: string;
  }): Promise<Timetable | null> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("timetables")
        .select("*")
        .eq("school", params.school)
        .eq("grade", params.grade)
        .eq("view_type", params.view_type)
        .eq("year", params.year)
        .eq("semester", params.semester)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Timetable | null) ?? null;
    } catch (e) {
      console.error("[adminFindTimetableByKey]", e);
      return null;
    }
  },
);

export const adminListTimetableCourses = cache(
  async (filters?: {
    school?: string;
    grade?: string;
    subject?: string;
  }): Promise<AdminCourseWithTeacher[]> => {
    try {
      const supabase = createAdminClient();
      let q = supabase
        .from("timetable_courses")
        .select("*, teacher:teachers(id, name, school)")
        .order("school", { ascending: true })
        .order("grade", { ascending: true })
        .order("subject", { ascending: true })
        .order("order_index", { ascending: true });
      if (filters?.school) q = q.eq("school", filters.school);
      if (filters?.grade) q = q.eq("grade", filters.grade);
      if (filters?.subject) q = q.eq("subject", filters.subject);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as AdminCourseWithTeacher[]) ?? [];
    } catch (e) {
      console.error("[adminListTimetableCourses]", e);
      return [];
    }
  },
);

export const adminGetTimetableCourse = cache(
  async (id: string): Promise<TimetableCourse | null> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("timetable_courses")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as TimetableCourse | null) ?? null;
    } catch (e) {
      console.error("[adminGetTimetableCourse]", e);
      return null;
    }
  },
);

/** 자유 입력된 과목명들을 자동완성용으로 모아 반환 */
export const adminListCourseSubjects = cache(async (): Promise<string[]> => {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("timetable_courses")
      .select("subject");
    if (error) throw error;
    const rows = (data as unknown as Array<{ subject: string }> | null) ?? [];
    return Array.from(new Set(rows.map((r) => r.subject))).sort();
  } catch (e) {
    console.error("[adminListCourseSubjects]", e);
    return [];
  }
});

export const adminListTeachers = cache(async (): Promise<Teacher[]> => {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("school", { ascending: true })
      .order("order_index", { ascending: true });
    if (error) throw error;
    return (data as unknown as Teacher[]) ?? [];
  } catch (e) {
    console.error("[adminListTeachers]", e);
    return [];
  }
});

export const adminGetTeacher = cache(
  async (id: string): Promise<Teacher | null> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Teacher | null) ?? null;
    } catch (e) {
      console.error("[adminGetTeacher]", e);
      return null;
    }
  },
);

export const adminListInfoSessions = cache(async (): Promise<InfoSession[]> => {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("info_sessions")
      .select("*")
      .order("session_date", { ascending: false });
    if (error) throw error;
    return (data as unknown as InfoSession[]) ?? [];
  } catch (e) {
    console.error("[adminListInfoSessions]", e);
    return [];
  }
});

export const adminGetInfoSession = cache(
  async (id: string): Promise<InfoSession | null> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("info_sessions")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as InfoSession | null) ?? null;
    } catch (e) {
      console.error("[adminGetInfoSession]", e);
      return null;
    }
  },
);

export const adminListPosts = cache(async (): Promise<Post[]> => {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as Post[]) ?? [];
  } catch (e) {
    console.error("[adminListPosts]", e);
    return [];
  }
});

export const adminGetPost = cache(
  async (id: string): Promise<Post | null> => {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Post | null) ?? null;
    } catch (e) {
      console.error("[adminGetPost]", e);
      return null;
    }
  },
);
