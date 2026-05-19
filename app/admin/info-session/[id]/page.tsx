import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminGetInfoSession } from "@/lib/admin/queries";

import InfoSessionForm from "../_components/InfoSessionForm";

type Props = { params: { id: string } };

export default async function EditInfoSessionPage({ params }: Props) {
  const existing = await adminGetInfoSession(params.id);
  if (!existing) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="설명회 편집"
        description={existing.title}
      />
      <InfoSessionForm key={existing.updated_at} initial={existing} />
    </div>
  );
}
