import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminListHomeHeroSlides } from "@/lib/admin/queries";

import HomeBannersForm from "./_components/HomeBannersForm";

export default async function AdminHomeBannersPage() {
  const slides = await adminListHomeHeroSlides();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="메인 배너"
        description="배너 이미지·링크는 공통이며, 메인 고정·팝업 노출을 슬롯별로 선택합니다."
      />
      <HomeBannersForm
        key={slides.map((slide) => slide.updated_at).join("|")}
        slides={slides}
      />
    </div>
  );
}
