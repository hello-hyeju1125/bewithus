import { Suspense } from "react";

import LoginForm from "./_components/LoginForm";

/**
 * `useSearchParams()` 를 사용하는 클라이언트 폼을 별도 컴포넌트로 분리하고
 * Suspense 로 감싸 정적 prerender 단계에서 CSR bailout 이 깨지지 않게 합니다.
 */
export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
