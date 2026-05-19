# 대치위더스 (bewithus)

대치위더스 학원의 공식 웹사이트. Next.js 14 (App Router) + Supabase 기반.

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **에디터**: Tiptap (게시판, Phase 3 통합 예정)

## 개발 시작

```bash
npm install
cp .env.local.example .env.local   # 값 채우기 (아래 Supabase 섹션 참고)
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속.

## 디자인 토큰

`tailwind.config.ts` 의 `theme.extend` 가 단일 진실 공급원입니다. 브랜드 컬러를 hex로 직접 입력하는 것은 금지되어 있으며, 자세한 규칙은 [.cursor/rules/design-tokens.mdc](./.cursor/rules/design-tokens.mdc) 를 참조하세요.

---

## Supabase 셋업 가이드

### 1. Supabase 프로젝트 생성

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속 후 **New project** 클릭.
2. 프로젝트 이름(`bewithus`), 리전(`Northeast Asia (Seoul)` 권장), DB 비밀번호 설정.
3. 프로젝트 생성이 끝나면 좌측 메뉴 **Project Settings → API** 에서 다음 값을 확보합니다.
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Project API keys → anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `Project API keys → service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. 환경변수 세팅

루트의 `.env.local.example` 을 복사한 뒤 위에서 받은 값을 채워 넣습니다.

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` 는 RLS 를 우회하는 **관리자 키**입니다. 절대로 브라우저 번들(`/app/`, `/components/`)에서 import 하지 마세요. `lib/supabase/admin.ts` 가 `import "server-only"` 로 보호하고 있습니다.

### 3. 마이그레이션 실행

마이그레이션 SQL: `supabase/migrations/001_initial.sql`

#### 방법 A — Supabase 대시보드 (가장 간단)

1. 대시보드 → **SQL Editor → New query**.
2. `supabase/migrations/001_initial.sql` 내용을 전부 붙여넣기.
3. **Run** 버튼 클릭.

이 SQL 은 idempotent 하게 작성되어 있어 여러 번 실행해도 안전합니다.

#### 방법 B — Supabase CLI

```bash
# 1. CLI 설치 (최초 1회)
npm install -g supabase

# 2. 로그인 (브라우저로 연결)
supabase login

# 3. 프로젝트 연결
supabase link --project-ref <YOUR_PROJECT_REF>

# 4. 마이그레이션 푸시
supabase db push
```

### 4. 첫 관리자 계정 생성

본 프로젝트는 **공개 회원가입을 사용하지 않습니다**. 관리자 계정만 Supabase Auth 를 사용합니다.

1. Supabase 대시보드 → **Authentication → Providers → Email** 진입.
2. **Enable signups** 를 **OFF** 로 변경하여 외부 회원가입을 차단합니다.
3. **Authentication → Users → Add user → Create new user** 클릭.
4. 관리자 이메일과 임시 비밀번호를 입력하고 **Auto Confirm User** 체크 후 생성.
5. 추후 관리자 페이지(`/admin/...`) 에서 해당 계정으로 로그인하여 콘텐츠를 등록합니다.

> RLS 정책 상 **인증된 사용자 = 관리자** 로 간주됩니다. 외부 회원가입을 반드시 비활성화하세요.

### 5. TypeScript 타입 동기화 (선택)

`types/database.ts` 는 수동으로 관리되며 마이그레이션과 동기 상태를 유지합니다. 운영 단계에서 자동 생성으로 전환하려면:

```bash
# Supabase CLI 로그인 + link 가 완료된 상태에서
npx supabase gen types typescript --project-id <YOUR_PROJECT_REF> \
  --schema public > types/database.ts
```

### 6. Storage 버킷

마이그레이션이 다음 3개의 public 버킷을 생성합니다.

| 버킷 ID       | 용도                         |
| ------------- | ---------------------------- |
| `timetables`  | 시간표 이미지                |
| `teachers`    | 강사 프로필 사진             |
| `post-images` | 게시판 첨부 이미지           |

모두 **public read / authenticated write** 정책이 적용되어 있습니다.

---

## 디렉토리 구조 (백엔드 관련)

```
lib/
  supabase/
    client.ts     # 브라우저용 (anon key)
    server.ts     # 서버 컴포넌트/Route Handler (cookies 연동)
    admin.ts     # service_role, 서버 전용 (server-only 보호)
supabase/
  migrations/
    001_initial.sql
types/
  database.ts     # 전체 스키마 TypeScript 타입
```

## 데이터 변경(Mutation) 규칙

- 모든 INSERT/UPDATE/DELETE 는 **`/app/api/admin/**` Route Handler** 또는 **관리자 Server Action** 에서만 수행합니다.
- 클라이언트 컴포넌트는 읽기(`select`) 또는 인증 흐름만 다룹니다.
- `lib/supabase/admin.ts` 를 사용할 때는 호출 직전에 반드시 사용자 인증/권한 검증을 거치세요.
