"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { loginAdminAction } from "../actions";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const result = await loginAdminAction(password);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.replace(redirectTo.startsWith("/admin") ? redirectTo : "/admin");
      router.refresh();
    } catch {
      setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-card border border-neutral-200 bg-white p-8 shadow-[0_12px_36px_-16px_rgba(34,41,93,0.18)]">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-button bg-primary text-[20px] font-bold text-accent"
        >
          W
        </span>
        <h1 className="text-[22px] font-black tracking-tight text-primary">
          관리자 로그인
        </h1>
        <p className="text-[13px] text-neutral-500">
          운영 비밀번호를 입력하면 관리자 페이지로 이동합니다.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-semibold text-neutral-700">
            비밀번호
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-button border border-neutral-200 bg-white px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="관리자 비밀번호"
          />
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-button border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-700"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || !password}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-button bg-primary text-[15px] font-bold text-white outline-none transition-colors hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "확인 중..." : "관리자로 들어가기"}
        </button>
      </form>

      <p className="mt-6 text-center text-[12px] text-neutral-400">
        비밀번호는 서버 환경변수(ADMIN_PASSWORD)로 설정합니다.
      </p>
    </div>
  );
}
