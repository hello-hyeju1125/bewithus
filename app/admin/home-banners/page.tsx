import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  adminGetHomeHeroSettings,
  adminListHomeHeroSlides,
} from "@/lib/admin/queries";

import HomeBannersForm from "./_components/HomeBannersForm";

export default async function AdminHomeBannersPage() {
  const [slides, settings] = await Promise.all([
    adminListHomeHeroSlides(),
    adminGetHomeHeroSettings(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="메인 배너"
        description="메인 배너 문구·이미지, CTA, 첫 방문 팝업 노출 여부를 수정합니다."
      />
      <HomeBannersForm slides={slides} settings={settings} />
    </div>
  );
}
