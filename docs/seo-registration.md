# 검색엔진 등록 가이드 (Google · 네이버 · 다음)

대치위더스(bewithus) 사이트를 Google, 네이버, 다음에 등록하기 위한 URL·메타·제출 절차입니다.

**운영 도메인:** `https://www.bewithus.kr`

> **먼저 할 일:** Vercel 환경변수에 아래를 설정하세요.
>
> ```env
> NEXT_PUBLIC_SITE_URL=https://www.bewithus.kr
> ```

아래 URL의 `{SITE_URL}` 은 `https://www.bewithus.kr` 로 읽으면 됩니다.

---

## 제출용 주소 (핵심)

| 용도 | URL |
|------|-----|
| **사이트맵** | `https://www.bewithus.kr/sitemap.xml` |
| **RSS (공지사항)** | `https://www.bewithus.kr/feed.xml` |
| **robots.txt** | `https://www.bewithus.kr/robots.txt` |

로컬 개발 시 예시:

- 사이트맵: `http://localhost:3000/sitemap.xml`
- RSS: `http://localhost:3000/feed.xml`
- robots: `http://localhost:3000/robots.txt`

---

## 자동 적용되는 메타 태그

Next.js `app/layout.tsx` + `lib/site/metadata.ts` 가 아래 메타를 자동 출력합니다.

- `title`, `description`, `keywords`
- `canonical`, RSS `alternate` 링크
- Open Graph (`og:*`)
- Twitter Card (`twitter:*`)
- `robots` (index, follow)
- Schema.org JSON-LD (`EducationalOrganization`)

HTML 원문 참고: [`docs/seo-meta-tags.html`](./seo-meta-tags.html)

### 소유권 확인 메타 (환경변수)

각 포털에서 발급받은 코드를 `.env.local` 에 넣으면 `<head>` 에 자동 추가됩니다.

```env
GOOGLE_SITE_VERIFICATION=구글에서_발급한_코드
NAVER_SITE_VERIFICATION=네이버에서_발급한_코드
DAUM_SITE_VERIFICATION=다음에서_발급한_코드
```

| 포털 | 출력되는 메타 태그 |
|------|------------------|
| Google Search Console | `<meta name="google-site-verification" content="..." />` |
| 네이버 서치어드바이저 | `<meta name="naver-site-verification" content="..." />` |
| 다음 검색 (Daum Webmaster) | `<meta name="daum-site-verification" content="..." />` |

---

## Vercel 배포 설정 (상세)

SEO·사이트맵·RSS가 올바른 도메인으로 나가려면 **Vercel 대시보드**에서 아래를 순서대로 진행합니다.

### 1. 도메인 연결

**경로:** Vercel 프로젝트 → **Settings** → **Domains**

| 추가할 도메인 | 권장 설정 |
|---------------|-----------|
| `www.bewithus.kr` | **Primary** (메인 주소) |
| `bewithus.kr` (루트) | `www.bewithus.kr` 로 **Redirect** |

- 검색엔진·OG·사이트맵은 모두 `https://www.bewithus.kr` 기준으로 통일합니다.
- `bewithus.kr` 만 등록하고 www 없이 쓰면 canonical·사이트맵 URL이 어긋날 수 있으니, **www를 메인**으로 두는 것을 권장합니다.

**DNS (도메인 등록업체에서 설정)**

Vercel Domains 화면에 표시되는 값을 그대로 따릅니다. 일반적인 예시:

| 호스트 | 타입 | 값 |
|--------|------|-----|
| `www` | CNAME | `cname.vercel-dns.com` |
| `@` (루트) | A | `76.76.21.21` |

또는 Vercel **Nameservers** 로 전체 DNS 를 넘기는 방법도 있습니다.

연결 후 **Valid Configuration** 이 뜰 때까지 기다립니다 (수 분~최대 48시간).

### 2. 환경변수 (Environment Variables)

**경로:** Vercel 프로젝트 → **Settings** → **Environment Variables**

로컬 `.env.local` 과 **동일한 값**을 넣되, **Environment** 는 대부분 **Production** (필요 시 Preview/Development 도 동일하게).

#### 필수 — SEO

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `NEXT_PUBLIC_SITE_URL` | `https://www.bewithus.kr` | 사이트맵·RSS·OG·canonical 의 기준 URL. **끝 슬래시 없이** |

#### 필수 — Supabase (사이트 동작)

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role (서버 전용) |

#### 필수 — 관리자

| 변수명 | 설명 |
|--------|------|
| `ADMIN_PASSWORD` | `/admin/login` 비밀번호 |
| `ADMIN_SESSION_SECRET` | 세션 서명용 긴 랜덤 문자열 |
| `ADMIN_AUTHOR_ID` | 공지 작성 시 Supabase User UUID |

#### 검색엔진 소유권 확인 (포털 등록 후 추가)

| 변수명 | 설명 |
|--------|------|
| `GOOGLE_SITE_VERIFICATION` | Google Search Console HTML 태그의 `content` 값 |
| `NAVER_SITE_VERIFICATION` | 네이버 서치어드바이저 HTML 태그의 `content` 값 |
| `DAUM_SITE_VERIFICATION` | 다음 검색 HTML 태그의 `content` 값 |

> `NEXT_PUBLIC_` 로 시작하는 변수는 **빌드 시** 번들에 반영됩니다. 값을 바꾼 뒤에는 **Redeploy** 가 필요합니다.

### 3. 재배포 (Redeploy)

환경변수 추가·수정 후:

**Deployments** → 최신 배포 **⋯** → **Redeploy** → **Use existing Build Cache** 해제 권장 (SEO 변수 반영 확실히)

또는 Git 에 SEO 관련 코드를 push 하면 자동 배포됩니다.

### 4. 배포 후 URL 확인

브라우저에서 직접 열어 확인합니다.

- https://www.bewithus.kr/sitemap.xml — XML 목록
- https://www.bewithus.kr/feed.xml — RSS
- https://www.bewithus.kr/robots.txt — `Sitemap: https://www.bewithus.kr/sitemap.xml` 포함 여부

홈 페이지 **소스 보기**에서 `og:url`, `canonical`, `application/ld+json` 이 `www.bewithus.kr` 인지 확인합니다.

### 5. Vercel 에서 추가로 할 일 (선택)

| 항목 | 위치 | 권장 |
|------|------|------|
| Production Branch | Settings → Git | `main` (또는 사용 중인 기본 브랜치) |
| Automatic HTTPS | Domains | 기본 활성 — SSL 자동 |
| Deployment Protection | Settings | Preview URL 은 검색엔진에 노출되지 않음 (Production 만 등록) |

코드 변경 없이 Vercel 만으로 할 작업은 **도메인 연결 + 환경변수 + 재배포** 가 전부입니다.

---

## Google Search Console

1. [Google Search Console](https://search.google.com/search-console) 접속
2. **속성 추가** → URL 접두어에 `https://www.bewithus.kr` 입력
3. 소유권 확인: **HTML 태그** 방식 선택 → 발급 코드를 `GOOGLE_SITE_VERIFICATION` 에 설정 후 배포
4. **색인 생성** → **Sitemaps** → `https://www.bewithus.kr/sitemap.xml` 제출

---

## 네이버 서치어드바이저

1. [네이버 서치어드바이저](https://searchadvisor.naver.com/) 접속
2. **사이트 등록** → `https://www.bewithus.kr` 입력
3. 소유권 확인: **HTML 태그** → 코드를 `NAVER_SITE_VERIFICATION` 에 설정 후 배포
4. **요청** → **사이트맵 제출** → `https://www.bewithus.kr/sitemap.xml`
5. (선택) **RSS 제출** → `https://www.bewithus.kr/feed.xml` — 공지사항 갱신 알림에 활용

---

## 다음(Daum) 검색

1. [Daum 검색등록](https://register.search.daum.net/) 또는 다음 웹마스터 도구 접속
2. 사이트 등록 후 **메타 태그** 방식으로 소유권 확인 → `DAUM_SITE_VERIFICATION` 설정
3. 사이트맵 URL 제출: `https://www.bewithus.kr/sitemap.xml`

---

## 사이트맵에 포함되는 페이지

**정적 페이지**

- `/` (홈)
- `/timetable/{school}` — daewon, hanyoung, general, middle, private
- `/teachers`, `/teachers/{school}` — daewon, hanyoung, general
- `/info-session/{school}` — daewon, hanyoung, general
- `/notice`, `/location`, `/facility`

**동적 페이지**

- `/notice/{id}` — 게시된 공지사항 전체 (Supabase `posts`)

**제외**

- `/admin/*` — robots.txt 에서 차단

---

## RSS 피드

- **주소:** `https://www.bewithus.kr/feed.xml`
- **내용:** 최근 공개 공지사항 최대 50건
- **용도:** 네이버 RSS 제출, 공지 갱신 알림

---

## 배포 후 확인 체크리스트

- [ ] Vercel Production 에 `NEXT_PUBLIC_SITE_URL=https://www.bewithus.kr` 설정
- [ ] `https://www.bewithus.kr/sitemap.xml` 브라우저에서 XML 확인
- [ ] `https://www.bewithus.kr/feed.xml` 브라우저에서 RSS 확인
- [ ] `https://www.bewithus.kr/robots.txt` 에 Sitemap 줄 확인
- [ ] 페이지 소스 보기에서 `og:` / `description` / JSON-LD 확인
- [ ] Google · 네이버 · 다음 각각 소유권 확인 완료
- [ ] 세 포털 모두 사이트맵 제출

---

## 관련 소스 파일

| 파일 | 역할 |
|------|------|
| `lib/site/config.ts` | 사이트명, 설명, 도메인 |
| `lib/site/metadata.ts` | Next.js Metadata 생성 |
| `app/sitemap.ts` | `/sitemap.xml` |
| `app/robots.ts` | `/robots.txt` |
| `app/feed.xml/route.ts` | `/feed.xml` |
| `components/seo/OrganizationJsonLd.tsx` | 구조화 데이터 |
| `docs/seo-meta-tags.html` | 메타 태그 HTML 참고 |
