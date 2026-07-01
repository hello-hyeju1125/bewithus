# W대치위더스 검색엔진 등록 안내 (고객용)

**사이트 주소:** https://www.bewithus.kr  
**작업 예상 시간:** 포털당 10~20분 (총 1시간 내외)  
**필요 계정:** Google 계정, 네이버 계정, Daum(카카오) 계정

---

## 시작하기 전에 (완료 여부 확인)

아래 주소를 브라우저에 입력했을 때 **정상적으로 열리면** 등록을 시작해도 됩니다.

| 확인 항목 | 주소 | 정상일 때 |
|-----------|------|-----------|
| 사이트맵 | https://www.bewithus.kr/sitemap.xml | XML 형태의 URL 목록 |
| RSS | https://www.bewithus.kr/feed.xml | 공지사항 목록 (RSS) |
| robots | https://www.bewithus.kr/robots.txt | `Sitemap: https://www.bewithus.kr/sitemap.xml` 문구 포함 |

> 위 주소가 **404(페이지 없음)** 이면, 개발팀에 먼저 문의해 주세요.

---

## 제출할 주소 (복사해서 사용)

등록 과정에서 아래 주소를 그대로 붙여 넣으면 됩니다.

```
사이트 주소:     https://www.bewithus.kr
사이트맵:        https://www.bewithus.kr/sitemap.xml
RSS (공지):      https://www.bewithus.kr/feed.xml
```

> **중요:** 반드시 `www` 가 포함된 주소를 사용해 주세요. (`bewithus.kr` 만 쓰지 마세요)

---

## 공통: 소유권 확인(메타 태그) 방법

Google·네이버·다음 모두 **“이 사이트가 내 것”** 을 확인하기 위해 **인증 코드**를 발급합니다.

### 진행 순서 (세 포털 모두 동일)

1. 포털에서 **HTML 태그** (또는 **메타 태그**) 방식 선택
2. 화면에 나온 태그 예시:
   ```html
   <meta name="google-site-verification" content="abc123xyz..." />
   ```
3. **`content="..."` 안의 글자만** 복사 (따옴표 제외)
4. **Vercel** → 프로젝트 → **Settings** → **Environment Variables** 에 추가
5. **Redeploy(재배포)** 실행
6. 2~3분 후 포털에서 **확인** 버튼 클릭

### Vercel에 넣을 환경변수 이름

| 포털 | 환경변수 이름 | 값 |
|------|---------------|-----|
| Google | `GOOGLE_SITE_VERIFICATION` | Google에서 발급한 코드 |
| 네이버 | `NAVER_SITE_VERIFICATION` | 네이버에서 발급한 코드 |
| 다음 | `DAUM_SITE_VERIFICATION` | 다음에서 발급한 코드 |

- Environment: **Production** 선택
- 코드 입력 후 **Save** → **Deployments** → **Redeploy**

> HTML 파일을 직접 수정할 필요는 없습니다. Vercel에 코드만 넣으면 사이트에 자동 반영됩니다.

---

## 1. Google 검색 등록

**접속:** https://search.google.com/search-console

### 단계

1. Google 계정으로 로그인
2. **속성 추가** 클릭
3. **URL 접두어** 선택 → `https://www.bewithus.kr` 입력 → **계속**
4. **소유권 확인** 화면에서 **HTML 태그** 선택
5. `content="..."` 안 코드 복사
6. Vercel에 `GOOGLE_SITE_VERIFICATION` 추가 → 재배포
7. Search Console에서 **확인** 클릭
8. 왼쪽 메뉴 **Sitemaps(사이트맵)** → 새 사이트맵에 아래만 입력 후 **제출**
   ```
   sitemap.xml
   ```
   (또는 전체 URL `https://www.bewithus.kr/sitemap.xml`)

### 완료 확인

- Search Console 대시보드에 데이터가 수일~수주 내 수집되기 시작합니다.
- “색인 생성 요청됨” 상태가 보이면 정상입니다.

---

## 2. 네이버 검색 등록

**접속:** https://searchadvisor.naver.com/

### 단계

1. 네이버 계정으로 로그인
2. **웹마스터 도구** → **사이트 등록**
3. 사이트 URL: `https://www.bewithus.kr` 입력
4. **HTML 태그** 방식으로 소유 확인
5. `content="..."` 코드 복사 → Vercel `NAVER_SITE_VERIFICATION` → 재배포
6. 서치어드바이저에서 **소유 확인**
7. **요청** → **사이트맵 제출**
   ```
   https://www.bewithus.kr/sitemap.xml
   ```
8. **(선택)** **요청** → **RSS 제출**
   ```
   https://www.bewithus.kr/feed.xml
   ```
   공지사항이 올라올 때 네이버에 알리는 데 도움이 됩니다.

### 완료 확인

- 사이트맵 상태가 “수집” 또는 “성공”으로 표시되면 정상입니다.

---

## 3. 다음(Daum) 검색 등록

**접속:** https://register.search.daum.net/

### 단계

1. Daum(카카오) 계정으로 로그인
2. **사이트 등록** → URL: `https://www.bewithus.kr`
3. **메타 태그** 방식으로 소유 확인
4. `content="..."` 코드 복사 → Vercel `DAUM_SITE_VERIFICATION` → 재배포
5. 다음에서 **확인**
6. 사이트맵 URL 제출:
   ```
   https://www.bewithus.kr/sitemap.xml
   ```

---

## 작업 완료 체크리스트

등록이 끝나면 아래를 하나씩 체크해 주세요.

- [ ] Google Search Console — 소유권 확인 완료
- [ ] Google — 사이트맵 제출 완료
- [ ] 네이버 서치어드바이저 — 소유권 확인 완료
- [ ] 네이버 — 사이트맵 제출 완료
- [ ] 네이버 — RSS 제출 (선택)
- [ ] 다음 — 소유권 확인 및 사이트맵 제출 완료

---

## 자주 묻는 질문

### Q. 소유권 확인이 실패합니다.

- Vercel에 코드를 넣은 뒤 **재배포**했는지 확인해 주세요.
- 재배포 후 **2~3분** 기다린 뒤 다시 “확인”을 눌러 보세요.
- `https://www.bewithus.kr` 에 접속 → **페이지 소스 보기** → `site-verification` 검색 → 해당 meta 태그가 보이는지 확인해 주세요.

### Q. 사이트맵 제출이 실패합니다.

- 주소에 오타가 없는지 확인 (`https://`, `www` 포함)
- 브라우저에서 https://www.bewithus.kr/sitemap.xml 이 열리는지 먼저 확인

### Q. 등록 후 바로 검색에 안 나옵니다.

정상입니다. 검색 결과 반영까지 **수일~수주** 걸릴 수 있습니다. 사이트맵 제출과 소유권 확인만 완료하면 이후는 각 검색엔진이 자동으로 수집합니다.

### Q. HTML 태그를 직접 넣어야 하나요?

아닙니다. **Vercel 환경변수**에 코드만 넣으면 사이트가 자동으로 처리합니다.

### Q. 개발팀에 문의가 필요한 경우

- 사이트맵/RSS 주소가 404일 때
- Vercel 접근 권한이 없을 때
- 소유권 확인 코드를 넣었는데도 계속 실패할 때 (재배포 후 24시간 경과)

---

## 문의 시 전달해 주실 정보

문제 발생 시 아래를 스크린샷과 함께 보내 주시면 빠르게 도와드릴 수 있습니다.

1. 어떤 포털에서 문제가 생겼는지 (Google / 네이버 / 다음)
2. 어느 단계에서 막혔는지 (소유권 확인 / 사이트맵 제출)
3. 화면에 표시된 오류 메시지

---

*본 문서는 W대치위더스(www.bewithus.kr) 검색엔진 등록 전용 안내입니다.*
