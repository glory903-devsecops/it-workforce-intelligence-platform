# IT Workforce Intelligence Platform — Prompt Reference

이 문서는 이 프로젝트를 진행하면서 참고된 핵심 프롬프트와 작업 흐름을 정리한 안내서입니다. 다른 코딩 에이전트가 이 프로젝트를 이어갈 때, 빠르게 상황을 파악하고 동일한 방식으로 문제를 해결할 수 있도록 설계되었습니다.

---

## 1. 문서 목적

- 이 저장소에 적용된 주요 챗GPT/코딩 에이전트 프롬프트 패턴을 정리
- 다음 작업자가 프로젝트 구조, 배포 흐름, 우선순위 문제를 바로 이해하도록 지원
- GitHub Actions 및 Pages 배포 오류를 해결하기 위한 실전형 프롬프트 가이드 제공

---

## 2. 핵심 원칙

1. **문제 중심**: 전체 구현보다 현재 실패 지점과 원인 파악에 집중
2. **작은 단계**: 단일 수정, 단일 파일, 단일 원인으로 접근
3. **검증 우선**: 로컬 테스트와 CI 상태를 모두 확인
4. **배포 안정화**: Pages는 한 흐름으로 통일, 중복 배포 제거
5. **문서화**: 변경 사항과 원인, 이후 작업 지침을 명확히 기록

---

## 3. 주요 프롬프트 패턴

### 3.1 초기 코드 확인 및 상태 분석

- "이 저장소의 백엔드와 프론트엔드가 어떻게 구성되어 있는지 확인해 주세요. 현재 프로젝트의 주요 파일과 워크플로우를 검토해 주세요."
- "현재 GitHub Actions가 어떤 실패를 내고 있는지 로그 없이 확인 가능한 부분을 먼저 분석해 주세요."

### 3.2 프론트엔드/UX 및 테스트 구현

- "대시보드 UI 개선을 위해 어떤 컴포넌트가 필요하고, 어디를 수정해야 할지 제안해 주세요."
- "프론트엔드에 대해 E2E나 단위 테스트를 추가하고, 어떤 테스트가 필요한지 정리해 주세요."

### 3.3 GitHub Actions / Pages 배포 문제 해결

- "Actions가 실패하는 정확한 단계와 에러 메시지를 찾아서 알려주세요."
- "GitHub Pages 배포를 위해 workflow를 안전하게 수정하려면 어떤 파일과 설정을 바꿔야 하나요?"
- "Node.js 20 deprecated 경고와 `git exit code 128` 에러를 해결하려면 어떤 변경이 필요합니까?"

### 3.4 버그 수정 및 로컬 검증

- "로컬에서 pytest를 실행했을 때 발생하는 오류를 보여주세요. 왜 실패하는지 원인과 해결책을 제시해 주세요."
- "백엔드에서 `seed_initial_data`가 잘못 동작하는 원인과 이를 바로잡기 위한 코드 수정을 해주세요."

### 3.5 배포 완료 확인

- "배포가 성공했는지 확인하려면 Pages URL에 HTTP 요청을 보내고 상태 코드를 확인해주세요."
- "현재 배포 결과가 정상인지 즉시 검증해 주세요."

---

## 4. 실제 적용된 작업 흐름

### 4.1 코드/워크플로우 진단

- `backend/requirements-dev.txt`, `backend/requirements.txt` 확인
- `.github/workflows/ci.yml`, `.github/workflows/static.yml` 검사
- GitHub Actions run 상태, job 상태, head_sha 및 run 번호 확인

### 4.2 버그 수정

- `backend/app/main.py`의 `seed_initial_data()` 함수에서 `async_session`을 사용하도록 수정
- 로컬 `pytest` 통과 여부 확인

### 4.3 Actions 수정

- `ci.yml`에서 배포 단계를 제거하고 테스트 전용 workflow로 정리
- `static.yml`을 배포 전용으로 통일하고, `node-version: 24` 적용
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` 환경변수 추가

### 4.4 최종 배포 검증

- GitHub Actions run의 `success` 여부 확인
- `curl -I -L -s <Pages URL>`을 통해 HTTP 200 응답 확인

---

## 5. 다음 작업자를 위한 가이드

### 우선 순위

1. 최신 `ci.yml`과 `static.yml`의 상태를 확인
2. GitHub Actions run 각 단계의 최종 상태를 확보
3. 실패가 있는 경우 가장 최근 `Deploy frontend to GitHub Pages` 또는 `Test backend and frontend build`의 로그 텍스트를 확보
4. 로컬 테스트가 실패하면 먼저 `backend/app/main.py`와 `backend/tests/conftest.py`를 검토
5. Pages 배포가 성공하면 `https://glory903-devsecops.github.io/it-workforce-intelligence-platform/` 접속 확인

### 핵심 파일

- `backend/app/main.py`
- `backend/requirements-dev.txt`
- `backend/requirements.txt`
- `.github/workflows/ci.yml`
- `.github/workflows/static.yml`
- `docs/project_plan.md`
- `frontend/package.json`
- `frontend/src/App.tsx`

### 확인할 것

- `frontend/package-lock.json` 경로가 workflow의 `cache-dependency-path`와 일치하는지
- `actions/setup-node@v4`가 `node-version: 24`로 설정되어 있는지
- GitHub Actions permissions에 `pages: write`가 포함되어 있는지
- Pages 배포 브랜치와 publish 디렉터리가 일치하는지

---

## 6. 예시 프롬프트 템플릿

### 6.1 프로젝트 상태 요약 요청

```text
이 저장소의 현재 구성과 GitHub Actions 워크플로우 상태를 검토해 주세요. 백엔드, 프론트엔드, 배포 관련 파일을 요약하고, 현재 가장 시급한 실패 지점을 알려주세요.
```

### 6.2 배포 오류 해결 요청

```text
GitHub Actions 배포가 실패하고 있습니다. .github/workflows/static.yml과 ci.yml을 점검해서, 배포가 안전하게 성공하도록 수정할 수 있는 최소 변경 사항을 제안해 주세요.
```

### 6.3 테스트 오류 원인 파악 요청

```text
로컬 pytest가 실패합니다. backend/app/main.py와 backend/tests/conftest.py를 점검하고, 데이터베이스 시드 및 테스트 셋업 문제를 해결해주세요.
```

### 6.4 배포 검증 요청

```text
Pages URL에 HTTP 요청을 보내 배포가 실제로 성공했는지 확인해 주세요. 응답 코드와 함께 사이트가 정상적으로 열리는지 검증해주세요.
```

---

## 7. 문서 참고 및 확장

- 이 문서는 프로젝트의 핵심 문제 해결 프롬프트를 정리한 것입니다.
- 다음 코딩 에이전트는 이 문서를 먼저 읽고, `docs/project_plan.md`와 `frontend`, `backend`, `.github/workflows` 구조를 함께 확인해야 합니다.
- 필요하다면 이 문서에 추가로 "실패 로그 템플릿"과 "우선수정 파일 목록"을 덧붙여 두면 다음 작업자가 더 빠르게 진입할 수 있습니다.
