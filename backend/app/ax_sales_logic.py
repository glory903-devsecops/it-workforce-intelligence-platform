"""Specialized AX logic for SW Sales workforce."""
import re
from typing import List, Optional
from pydantic import BaseModel

class AXCandidate(BaseModel):
    task_template_id: str
    confidence: float

class AXResult(BaseModel):
    stream_id: Optional[str] = None
    domain_id: Optional[str] = None
    capability_id: Optional[str] = None
    task_template_id: Optional[str] = None
    confidence: float = 0.0
    candidate_reasons: List[str] = []
    extracted_entities: List[str] = []
    suggested_work_type: str = "BAU"

def predict_sales_taxonomy(work_title: str, work_detail: str) -> AXResult:
    """Predict taxonomy with sales-specific entity extraction."""
    text = f"{work_title} {work_detail}".lower()
    result = AXResult()
    
    # 1. Product Entity Extraction
    products = {
        "civil": "Civil NX",
        "gen": "Gen",
        "soil": "Soil",
        "gts": "GTS NX",
        "fea": "FEA NX",
        "geox": "GeoX",
        "bridge": "Civil/Bridge",
        "building": "Gen/Building"
    }
    for key, name in products.items():
        if key in text:
            result.extracted_entities.append(name)
            
    # 2. Activity / Intent Identification
    intents = {
        r"(제안|proposal|quotation|견적)": ("SP", "SAL", "CAP010", "TASK008", "SALES_SUPPORT", "제안/견적 관련 활동 인식"),
        r"(데모|demo|시연|presentation)": ("SP", "PRS", "CAP009", "TASK007", "SALES_SUPPORT", "제품 시연/데모 활동 인식"),
        r"(기술지원|support|문의|답변)": ("SP", "SAL", "CAP010", "TASK002", "BAU", "기술 지원 및 고객 응대 패턴"),
        r"(미팅|meeting|방문|출장|visit)": ("GB", "GBD", "CAP011", "TASK009", "BAU", "고객사 방문 및 미팅 식별"),
        r"(교육|training|세미나|seminar)": ("GB", "GBD", "CAP011", "TASK011", "PROJECT", "사용자 교육 및 세미나 지원"),
    }
    
    matched = False
    for pattern, (s_id, d_id, c_id, t_id, w_type, reason) in intents.items():
        if re.search(pattern, text):
            result.stream_id = s_id
            result.domain_id = d_id
            result.capability_id = c_id
            result.task_template_id = t_id
            result.suggested_work_type = w_type
            result.candidate_reasons.append(reason)
            result.confidence = 0.92
            matched = True
            break
            
    if not matched:
        result.confidence = 0.3
        result.candidate_reasons.append("명확한 영업 활동 패턴을 찾지 못함")
        
    return result
