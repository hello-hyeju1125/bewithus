/** 메인·서브 페이지 SideWidget 공통 버튼 스타일 (SideWidget / FloatingSideWidget) */
export const sideWidgetButtonBase =
  "group flex w-full flex-col items-center justify-center gap-1.5 rounded-card border border-neutral-200 px-2 py-3 text-center text-primary outline-none shadow-[0_4px_12px_-6px_rgba(34,41,93,0.18)] transition-colors duration-200 ease-out hover:border-primary hover:bg-accent-500 hover:text-primary focus-visible:border-primary focus-visible:bg-accent-500 focus-visible:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export const sideWidgetButtonAction = `${sideWidgetButtonBase} bg-white`;
export const sideWidgetButtonPhone = `${sideWidgetButtonBase} bg-accent-500 hover:bg-accent-400`;
