# IT Workforce Intelligence Platform

### 2026 운영 데이터 기반 2027 IT 예산 산정을 위한 리소스 분석 및 표준화 플랫폼

---

## 1. Project Overview

**IT Workforce Intelligence Platform**은  
정규직, 계약직, 외주 협력사 등 300명 이상의 IT 인력이 수행하는 업무를 **동일한 기준으로 기록·정규화·분석**하여,  
조직별 운영 리소스와 비용 구조를 정량화하고 **다음 연도 IT 예산 및 운영 전략 수립**에 활용할 수 있도록 설계한 데이터 기반 IT 운영 의사결정 플랫폼입니다.

이 프로젝트는 단순한 업무일지 시스템이 아닙니다.  
핵심 목적은 다음과 같습니다.

- IT 인력 운영 현황의 가시화
- 팀별/역량별 업무 투입시간 정량화
- 정규직·계약직·외주 인력 비용 구조 분석
- 반복업무, 장애업무, 개선업무 비중 분석
- 2026년 실적 데이터를 기반으로 2027년 IT 예산 산정

---

## 2. Background

대규모 IT 조직에서는 인프라 운영, 애플리케이션 운영, 네트워크 관리, DB 운영, 보안 대응, 헬프데스크, 협력사 관리 등 다양한 업무가 동시에 수행됩니다.

하지만 실제 예산 수립 단계에서는 다음과 같은 문제가 반복됩니다.

- 어떤 팀이 어떤 업무에 얼마나 시간을 쓰는지 명확하지 않음
- 같은 업무도 팀마다 다른 이름과 형식으로 기록됨
- 정규직/계약직/외주 인력 간 투입 구조 비교가 어려움
- 장애 대응, 정기 운영, 프로젝트성 업무가 혼재됨
- 예산이 경험 기반으로 책정됨

이 플랫폼은 업무 입력 방식을 표준화하고, 입력 데이터를 Taxonomy 기반으로 정규화하여  
**운영 리소스 분석 → 비용 환산 → 예산 예측**으로 이어지는 구조를 제공합니다.

---

## 3. Problem Statement

IT 예산 수립의 정확도를 높이기 위해서는

> "누가 바쁜가"가 아니라  
> "어떤 Capability에 얼마나 많은 시간이 지속적으로 투입되는가"

를 파악해야 합니다.

현업 데이터는 다음과 같은 한계를 가집니다.

### 3.1 입력 기준 불일치

- 동일 업무의 다양한 표현
- 팀별 업무 단위 차이
- 자유 서술 위주 기록

### 3.2 리소스 분석 어려움

- 인력 유형별 비교 어려움
- 반복업무 vs 장애업무 구분 어려움
- 시스템별 운영 비용 분석 어려움

### 3.3 예산 연결성 부족

- 시간 데이터가 비용으로 연결되지 않음
- 외주 전환 판단 기준 부족
- 정량 근거 부족

---

## 4. Project Goal

### 4.1 업무 기록 표준화

모든 IT 인력이 동일한 기준으로 업무 기록

### 4.2 데이터 정규화

업무 데이터를 Capability 기반으로 구조화

### 4.3 리소스 분석

조직별, 인력유형별 업무시간 분석

### 4.4 예산 전략 지원

2026 데이터 기반 2027 예산 예측

---

## 5. Key Concept

이 플랫폼의 핵심은 업무 기록 시스템이 아니라

**Capability-based Resource Planning System**

입니다.

목적은 업무 기록이 아니라

**조직 운영 역량에 대한 시간 소비 구조 분석**

입니다.

---

## 6. Scope

### In Scope

- 업무 입력 표준화
- Capability taxonomy 설계
- 데이터 품질 관리
- 리소스 분석
- 비용 계산
- 예산 예측

### Out of Scope

- ERP 연동
- 평가 시스템 연동
- 결재 시스템 구현
- 실시간 운영 시스템

---

## 7. Target Users

### 실무자

- 일일 업무 기록

### 팀장

- 업무 패턴 검토

### IT 기획 담당자

- 리소스 분석
- 예산 산정

### 임원

- 비용 구조 이해
- 전략 수립

---

## 8. Capability Taxonomy

### L1 Domain

- IT Strategy & Governance
- Infrastructure Operations
- Network Operations
- Database Operations
- Application Operations
- Security Operations
- End-user IT Services
- Data & Reporting
- Project & Change Management
- Vendor & Resource Management

---

### L2 Capability 예시

- VPN Operations
- Firewall Operations
- DB Administration
- Helpdesk
- Release Management
- Budget Planning
- Outsourcing Management

---

### L3 Activity 예시

- VPN 계정 생성
- 방화벽 정책 변경
- DB 성능 점검
- 배포 수행
- 사용자 문의 대응
- 장애 분석
- 협력사 대응

---

### Work Type

- BAU
- INCIDENT
- REQUEST
- CHANGE
- PROJECT
- IMPROVEMENT
- GOVERNANCE
- VENDOR

---

## 9. Data Model

### Master Data

- Department
- Team
- Employee
- System
- Domain
- Capability
- Activity
- Work Type

---

### Transaction Data

- Task Log
- Data Quality Issue
- Budget Forecast

---

### 주요 입력 데이터

- 날짜
- 직원
- 팀
- 인력유형
- Domain
- Capability
- Activity
- Work Type
- 시스템
- 시간
- 난이도
- 반복주기
- 영향도

---

## 10. Workflow

### Step 1 업무 입력

직원이 일일 업무 기록

---

### Step 2 정규화

Capability 구조 기준 저장

---

### Step 3 품질 검증

이상 데이터 탐지

---

### Step 4 관리자 검토

팀 단위 패턴 검토

---

### Step 5 분석

리소스 사용량 집계

---

### Step 6 예산 예측

2027 예산 산정

---

## 11. Data Quality Strategy

### 입력 표준화

- dropdown 중심 입력
- 자유 텍스트 최소화

---

### 검증 규칙

예시

- 하루 12시간 초과 입력
- 장애인데 시스템 미입력
- 중복 시간 입력
- 비활성 activity 사용

---

### 품질 상태

- OPEN
- REVIEWED
- RESOLVED
- IGNORED

---

## 12. Key Features

### Work Log 입력

일일 업무 기록

### Approval

팀장 검토

### Quality Monitor

데이터 품질 검증

### Dashboard

- 팀별 업무시간
- Capability별 비용
- 외주 비율
- 장애 비율

### Budget Forecast

- FTE 계산
- 비용 계산
- 예산 예측

---

## 13. Budget Forecast Logic

### FTE 계산

FTE = 총 투입시간 / 연간 근무시간

예시

연간 근무시간 = 1760시간

총 업무시간 = 3520시간

필요 인력 = 2명

---

### 비용 계산

비용 = 업무시간 × 시간당 비용

---

### Forecast 방식

- Historical
- Manual
- Hybrid

---

## 14. Strategic Use Cases

### 예산 수립

연간 운영비 산정

### 인력 재배치

과다/과소 투입 영역 식별

### 외주 전략

외주 대상 업무 식별

### 자동화 후보 탐색

반복업무 자동화 후보 분석

---

## 15. Expected Benefits

- 운영 리소스 가시화
- 예산 근거 확보
- 비용 구조 분석
- 자동화 후보 식별
- 외주 전략 수립
- 운영 효율 개선

---

## 16. MVP Scope

- 5개 팀
- 30명 데이터
- 3개월 기록
- 10개 시스템
- 100개 activity
- 10개 품질 규칙

---

## 17. System Architecture

### Frontend

React

### Backend

FastAPI

### Database

PostgreSQL

### Analytics

Python
Metabase

---

## 18. Development Setup

### 18.1 요구 도구

- Python 3.12 이상
- Node.js 20 이상
- Docker / Docker Compose
- VS Code 확장: Python, Pylance, ESLint, Prettier, Docker

### 18.2 빠른 시작

1. PostgreSQL 및 앱 실행
   - `docker-compose up --build`
2. 백엔드 개발 서버
   - `cd backend`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
3. 프론트엔드 개발 서버
   - `cd frontend`
   - `npm install`
   - `npm run dev`

### 18.3 API 엔드포인트 예시

- `GET /` : 헬스 체크
- `POST /task-logs` : Task Log 기록 생성
- `GET /task-logs` : Task Log 목록 조회

---

## 19. Repository Structure
