import type { ReactNode } from "react";

import StaggeredPageShell from "@/components/layout/StaggeredPageShell";

type TimetablePageShellProps = {
  /** school·grade·view 변경 시 순차 애니메이션 재생 */
  pageKey: string;
  hero: ReactNode;
  controls: ReactNode;
  content: ReactNode;
};

export default function TimetablePageShell(props: TimetablePageShellProps) {
  return <StaggeredPageShell {...props} />;
}
