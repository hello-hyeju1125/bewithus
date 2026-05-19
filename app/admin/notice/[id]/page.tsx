import { notFound } from "next/navigation";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminGetPost } from "@/lib/admin/queries";

import PostForm from "../_components/PostForm";

type Props = { params: { id: string } };

export default async function EditNoticePage({ params }: Props) {
  const existing = await adminGetPost(params.id);
  if (!existing) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="공지사항 편집"
        description={existing.title}
      />
      <PostForm initial={existing} />
    </div>
  );
}
