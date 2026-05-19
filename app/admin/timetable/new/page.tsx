import AdminPageHeader from "@/components/admin/AdminPageHeader";

import TimetableForm from "../_components/TimetableForm";

export default function NewTimetablePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="새 시간표 등록"
        description="학교 · 학년 · 뷰별로 시간표 이미지를 업로드합니다."
      />
      <TimetableForm />
    </div>
  );
}
