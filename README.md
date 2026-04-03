# 🏢 MIDAS SW Sales Workforce Intelligence Platform

> **마이다스(MIDAS) SW 영업 인력 리소스 분석 및 2026 예산 예측 플랫폼**

전국 10개 지역, 300명 SW 영업 담당자의 업무 리소스를 데이터 기반으로 분석하고, 2025년 운영 실적을 기반으로 2026년 예산안을 자동 산출하는 의사결정 지원 플랫폼입니다.

---

## 📊 주요 기능

| 기능 | 설명 |
|------|------|
| **대시보드** | KPI 카드 + 월별/지역별/업무유형/도메인별 차트 |
| **업무 기록** | 영업 담당자의 일일 업무를 표준화된 항목으로 기록 |
| **품질 모니터** | 데이터 입력 오류 자동 감지 및 추적 |
| **예산 예측** | 2025년 실적 기반 2026년 예산 자동 산출 (5% 성장률) |
| **영업 인력** | 300명 영업 담당자 검색/필터 (지역/인력유형) |

## 💰 시간당 비용 기준

| 인력 유형 | 시간당 비용 |
|----------|-----------|
| 정규직 | 30,000원 |
| 계약직 | 30,000원 |
| 외주 | 90,000원 |

## 🛠️ 기술 스택

- **Backend**: Python + FastAPI + SQLAlchemy (Async) + SQLite
- **Frontend**: React 18 + Vite + Tailwind CSS v4 + Recharts
- **Testing**: Pytest (39 unit tests ✅)
- **Deployment**: GitHub Actions → GitHub Pages (Mock 데이터 기반 데모)
- **Design**: MIDAS 네이비(#1B3A6B) + 골드(#F5A623) 브랜딩

## 🚀 로컬 실행

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
서버 최초 실행 시 300명 영업 인력 + 2025년 업무 데이터가 자동 시딩됩니다.

### Frontend
```bash
cd frontend
npm install
VITE_API_BASE=http://localhost:8000 npm run dev
```

### 테스트 실행
```bash
cd backend
pip install -r requirements-dev.txt
python -m pytest tests/ -v
```

## 📁 프로젝트 구조

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entrypoint + startup seed
│   │   ├── models.py         # SQLAlchemy ORM models
│   │   ├── schemas.py        # Pydantic v2 schemas
│   │   ├── repository.py     # DB query layer
│   │   ├── routers.py        # API endpoints
│   │   ├── use_cases.py      # Business logic + data seeding
│   │   └── database.py       # DB engine config
│   └── tests/
│       ├── conftest.py        # Test fixtures
│       ├── test_main.py       # API endpoint tests (23)
│       ├── test_budget_forecast.py  # Budget tests (6)
│       └── test_use_cases.py  # Use case tests (10)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── TaskLogPage.tsx
│   │   │   ├── QualityPage.tsx
│   │   │   ├── BudgetPage.tsx
│   │   │   └── EmployeePage.tsx
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   ├── mockData.ts
│   │   ├── types.ts
│   │   └── index.css         # Tailwind v4 theme
│   └── vite.config.ts
└── .github/workflows/deploy.yml
```

## 🏢 데이터 구조

**영업 조직**: SW영업본부 → 10개 지역팀 (서울, 경기, 인천, 대전, 대구, 부산, 광주, 강원, 제주, 해외)

**영업 도메인**: 고객 영업 / 기술 지원 / 마케팅·홍보 / 파트너 관리 / 내부 행정

**업무 유형**: BAU / MEETING / PROPOSAL / DEMO / TRAINING / ADMIN / TRAVEL / SUPPORT

**사용 시스템**: Salesforce CRM, SAP ERP, MIDAS Portal, midas Civil/Gen/GTS NX/FEA, MS Teams 등

## 📋 라이선스

MIT License
