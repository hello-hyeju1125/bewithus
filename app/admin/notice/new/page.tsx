import AdminPageHeader from "@/components/admin/AdminPageHeader";

import PostForm from "../_components/PostForm";

export default function NewNoticePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="새 공지사항 작성"
        description="제목과 본문을 작성하고 발행 또는 임시저장합니다."
      />
      <PostForm />
    </div>
  );
}
