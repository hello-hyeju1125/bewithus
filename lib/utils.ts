import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `clsx` 와 `tailwind-merge` 를 결합한 className 결합기.
 * shadcn-ui 컨벤션에 맞춰 `cn` 으로 노출합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
