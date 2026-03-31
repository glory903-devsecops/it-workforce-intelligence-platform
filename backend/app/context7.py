from datetime import datetime

class Context7:
    """경험 기반 컨텍스트

    1) 사용자
    2) 팀
    3) 프로젝트
    4) 도메인
    5) 작업
    6) 비용
    7) 규칙
    """

    def __init__(self, user: str, team: str, project: str):
        self.user = user
        self.team = team
        self.project = project
        self.domain = None
        self.task = None
        self.cost = 0.0
        self.rules = []
        self.created_at = datetime.utcnow()

    def bind_domain(self, domain: str):
        self.domain = domain

    def bind_task(self, task: str):
        self.task = task

    def assign_cost(self, cost: float):
        self.cost = cost

    def add_rule(self, rule: str):
        self.rules.append(rule)
