import AdminPageHeader from "@/components/admin/AdminPageHeader";

import InfoSessionForm from "../_components/InfoSessionForm";

export default function NewInfoSessionPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="새 설명회 등록"
        description="다가오는 설명회 일정을 등록합니다."
      />
      <InfoSessionForm />
    </div>
  );
}
