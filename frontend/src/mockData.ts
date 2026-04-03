/**
 * Mock data for demo/GitHub Pages — MIDAS SW Sales 300 employees
 * 이 데이터는 API 없이도 대시보드가 동작할 수 있도록 정적 데이터를 제공합니다.
 */

export const mockDashboardSummary = {
  total_employees: 300,
  total_task_logs: 156000,
  total_hours: 362400.0,
  total_regions: 10,
  avg_hours_per_employee: 1208.0,
  quality_issues_count: 24,
  budget_forecast_total: 12546000000,
};

export const mockRegionSummary = [
  { region: "서울", employee_count: 45, total_hours: 54360.0, total_cost: 1630800000 },
  { region: "경기", employee_count: 42, total_hours: 50760.0, total_cost: 1522800000 },
  { region: "부산", employee_count: 30, total_hours: 36240.0, total_cost: 1087200000 },
  { region: "대구", employee_count: 28, total_hours: 33810.0, total_cost: 1014300000 },
  { region: "인천", employee_count: 30, total_hours: 36240.0, total_cost: 1087200000 },
  { region: "대전", employee_count: 28, total_hours: 33810.0, total_cost: 1014300000 },
  { region: "광주", employee_count: 25, total_hours: 30200.0, total_cost: 906000000 },
  { region: "강원", employee_count: 24, total_hours: 29000.0, total_cost: 870000000 },
  { region: "제주", employee_count: 22, total_hours: 26580.0, total_cost: 797400000 },
  { region: "해외", employee_count: 26, total_hours: 31400.0, total_cost: 942000000 },
];

export const mockMonthlyTrend = [
  { month: "1월", total_hours: 28800.0, task_count: 12500 },
  { month: "2월", total_hours: 27200.0, task_count: 11800 },
  { month: "3월", total_hours: 31200.0, task_count: 13500 },
  { month: "4월", total_hours: 30000.0, task_count: 13000 },
  { month: "5월", total_hours: 29600.0, task_count: 12800 },
  { month: "6월", total_hours: 30800.0, task_count: 13300 },
  { month: "7월", total_hours: 31600.0, task_count: 13700 },
  { month: "8월", total_hours: 28000.0, task_count: 12100 },
  { month: "9월", total_hours: 32400.0, task_count: 14000 },
  { month: "10월", total_hours: 33200.0, task_count: 14400 },
  { month: "11월", total_hours: 31200.0, task_count: 13500 },
  { month: "12월", total_hours: 28400.0, task_count: 12300 },
];

export const mockWorkTypeDistribution = [
  { work_type: "BAU", total_hours: 90600.0, percentage: 25.0 },
  { work_type: "MEETING", total_hours: 72480.0, percentage: 20.0 },
  { work_type: "PROPOSAL", total_hours: 54360.0, percentage: 15.0 },
  { work_type: "DEMO", total_hours: 43488.0, percentage: 12.0 },
  { work_type: "TRAVEL", total_hours: 36240.0, percentage: 10.0 },
  { work_type: "TRAINING", total_hours: 25368.0, percentage: 7.0 },
  { work_type: "ADMIN", total_hours: 21744.0, percentage: 6.0 },
  { work_type: "SUPPORT", total_hours: 18120.0, percentage: 5.0 },
];

export const mockDomainDistribution = [
  { domain: "고객 영업", total_hours: 144960.0, percentage: 40.0 },
  { domain: "기술 지원", total_hours: 72480.0, percentage: 20.0 },
  { domain: "마케팅/홍보", total_hours: 54360.0, percentage: 15.0 },
  { domain: "파트너 관리", total_hours: 50736.0, percentage: 14.0 },
  { domain: "내부 행정", total_hours: 39864.0, percentage: 11.0 },
];

export const mockDomains = [
  { id: 1, name: "고객 영업", description: "고객사 방문, 제안, 계약 체결 등 직접 영업 활동" },
  { id: 2, name: "기술 지원", description: "제품 기술 설명, 데모, 기술 문의 대응" },
  { id: 3, name: "마케팅/홍보", description: "세미나, 전시회, 콘텐츠 제작 등 마케팅 활동" },
  { id: 4, name: "파트너 관리", description: "리셀러, 총판, 해외 파트너 관리" },
  { id: 5, name: "내부 행정", description: "보고서, 회의, 교육, 평가 등 내부 업무" },
];

export const mockCapabilities = [
  { id: 1, domain_id: 1, name: "신규 고객 개발" },
  { id: 2, domain_id: 1, name: "기존 고객 관리" },
  { id: 3, domain_id: 1, name: "제안/입찰" },
  { id: 4, domain_id: 1, name: "계약 관리" },
  { id: 5, domain_id: 2, name: "제품 데모" },
  { id: 6, domain_id: 2, name: "기술 문의 대응" },
  { id: 7, domain_id: 2, name: "교육/워크숍" },
  { id: 8, domain_id: 3, name: "세미나 운영" },
  { id: 9, domain_id: 3, name: "전시회 참가" },
  { id: 10, domain_id: 3, name: "콘텐츠 제작" },
  { id: 11, domain_id: 4, name: "리셀러 관리" },
  { id: 12, domain_id: 4, name: "해외 파트너" },
  { id: 13, domain_id: 5, name: "영업 보고" },
  { id: 14, domain_id: 5, name: "사내 회의" },
  { id: 15, domain_id: 5, name: "교육/역량개발" },
];

export const mockActivities = [
  { id: 1, capability_id: 1, name: "콜드콜/이메일 발송" },
  { id: 2, capability_id: 1, name: "고객 방문 미팅" },
  { id: 3, capability_id: 1, name: "니즈 분석 보고서 작성" },
  { id: 4, capability_id: 2, name: "유지보수 갱신 안내" },
  { id: 5, capability_id: 2, name: "업그레이드 제안" },
  { id: 6, capability_id: 3, name: "RFP 분석" },
  { id: 7, capability_id: 3, name: "제안서 작성" },
  { id: 8, capability_id: 3, name: "프레젠테이션" },
  { id: 9, capability_id: 5, name: "midas Civil 시연" },
  { id: 10, capability_id: 5, name: "midas Gen 시연" },
  { id: 11, capability_id: 6, name: "원격 지원" },
  { id: 12, capability_id: 7, name: "신규 사용자 교육" },
];

export const mockTeams = [
  { id: 1, name: "서울영업팀", region: "서울", department_id: 1 },
  { id: 2, name: "경기영업팀", region: "경기", department_id: 1 },
  { id: 3, name: "인천영업팀", region: "인천", department_id: 1 },
  { id: 4, name: "대전영업팀", region: "대전", department_id: 1 },
  { id: 5, name: "대구영업팀", region: "대구", department_id: 1 },
  { id: 6, name: "부산영업팀", region: "부산", department_id: 1 },
  { id: 7, name: "광주영업팀", region: "광주", department_id: 1 },
  { id: 8, name: "강원영업팀", region: "강원", department_id: 1 },
  { id: 9, name: "제주영업팀", region: "제주", department_id: 1 },
  { id: 10, name: "해외영업팀", region: "해외", department_id: 1 },
];

export const mockWorkTypes = [
  { id: 1, name: "BAU" },
  { id: 2, name: "MEETING" },
  { id: 3, name: "PROPOSAL" },
  { id: 4, name: "DEMO" },
  { id: 5, name: "TRAINING" },
  { id: 6, name: "ADMIN" },
  { id: 7, name: "TRAVEL" },
  { id: 8, name: "SUPPORT" },
];

export const mockSystems = [
  { id: 1, name: "Salesforce CRM" },
  { id: 2, name: "SAP ERP" },
  { id: 3, name: "MIDAS Portal" },
  { id: 4, name: "midas Civil" },
  { id: 5, name: "midas Gen" },
  { id: 6, name: "midas GTS NX" },
  { id: 7, name: "midas FEA" },
  { id: 8, name: "MS Teams" },
  { id: 9, name: "이메일 시스템" },
  { id: 10, name: "영업관리시스템" },
];

// Generate 300 mock employees
const lastNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "전"];
const firstNames = ["민준", "서준", "도윤", "예준", "시우", "하준", "지호", "주원", "지후", "준서", "현우", "건우", "수빈", "서연", "하은", "민서", "하린", "윤서", "예은", "채원"];
const positions = ["사원", "주임", "대리", "과장", "차장", "부장"];
const wtypes = ["정규직", "정규직", "정규직", "정규직", "계약직", "외주"];

export const mockEmployees = Array.from({ length: 300 }, (_, i) => ({
  id: i + 1,
  name: `${lastNames[i % 20]}${firstNames[i % 20]}`,
  employee_code: `MDS-2025${String(i + 1).padStart(4, "0")}`,
  workforce_type: wtypes[i % 6],
  position: positions[Math.min(Math.floor(i / 50), 5)],
  region: mockTeams[i % 10].region,
  team_id: (i % 10) + 1,
}));

export const mockQualityIssues = [
  { id: 1, task_log_id: 142, issue_type: "과다시간 입력", description: "하루 12시간을 초과한 업무 기록", status: "OPEN", created_at: "2025-03-15T09:30:00" },
  { id: 2, task_log_id: 891, issue_type: "인력 유형 오류", description: "인력 유형이 올바르지 않음", status: "RESOLVED", created_at: "2025-05-22T14:15:00" },
  { id: 3, task_log_id: 2341, issue_type: "과다시간 입력", description: "하루 12시간을 초과한 업무 기록", status: "OPEN", created_at: "2025-07-10T11:00:00" },
  { id: 4, task_log_id: 4123, issue_type: "활동-능력치 불일치", description: "Activity가 Capability에 속하지 않음", status: "REVIEWED", created_at: "2025-09-03T16:45:00" },
];

export const mockBudgetForecasts = [
  { id: 1, year: 2026, region: "서울", team_name: "서울영업팀", workforce_type: "정규직", domain_name: "고객 영업", total_hours: 22890, total_cost: 686700000, headcount_fte: 13.0, forecast_type: "Historical", notes: "2025년 실적 기반 자동 산출", created_at: "2026-01-15T10:00:00" },
  { id: 2, year: 2026, region: "경기", team_name: "경기영업팀", workforce_type: "정규직", domain_name: "고객 영업", total_hours: 21350, total_cost: 640500000, headcount_fte: 12.1, forecast_type: "Historical", notes: "2025년 실적 기반 자동 산출", created_at: "2026-01-15T10:00:00" },
  { id: 3, year: 2026, region: "부산", team_name: "부산영업팀", workforce_type: "정규직", domain_name: "기술 지원", total_hours: 15240, total_cost: 457200000, headcount_fte: 8.7, forecast_type: "Historical", notes: "2025년 실적 기반 자동 산출", created_at: "2026-01-15T10:00:00" },
  { id: 4, year: 2026, region: "대전", team_name: "대전영업팀", workforce_type: "계약직", domain_name: "마케팅/홍보", total_hours: 12600, total_cost: 378000000, headcount_fte: 7.2, forecast_type: "Historical", notes: "2025년 실적 기반 자동 산출", created_at: "2026-01-15T10:00:00" },
  { id: 5, year: 2026, region: "해외", team_name: "해외영업팀", workforce_type: "외주", domain_name: "파트너 관리", total_hours: 9800, total_cost: 882000000, headcount_fte: 5.6, forecast_type: "Historical", notes: "2025년 실적 기반 자동 산출 (외주 단가 적용)", created_at: "2026-01-15T10:00:00" },
];
