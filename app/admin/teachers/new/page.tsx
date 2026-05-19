import AdminPageHeader from "@/components/admin/AdminPageHeader";

import TeacherForm from "../_components/TeacherForm";

export default function NewTeacherPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="새 강사 등록"
        description="프로필 정보를 입력하고 사진을 업로드합니다."
      />
      <TeacherForm />
    </div>
  );
}
