const STORAGE_KEY = "bewithus:home-banner-popup";

type StoredPopupState = {
  version: string;
};

export function shouldShowHomeBannerPopup(settingsUpdatedAt: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw) as StoredPopupState;
    return parsed.version !== settingsUpdatedAt;
  } catch {
    return true;
  }
}

export function dismissHomeBannerPopup(settingsUpdatedAt: string): void {
  if (typeof window === "undefined") return;
  const payload: StoredPopupState = { version: settingsUpdatedAt };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
