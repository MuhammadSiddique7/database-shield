from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class ThreatDetail(BaseModel):
    type: str
    description: str
    severity: str  # low, medium, high, critical
    rule_id: str = ''  # patterns.py wale pattern ka 'name' (ya ML-001)


class QueryInput(BaseModel):
    query: str
    database_type: str = 'MySQL'


class DetectionResult(BaseModel):
    is_safe: bool
    risk_level: str  # none, low, medium, high, critical
    confidence: float  # 0-100
    threats: List[ThreatDetail] = []
    reason: str
    details: Dict[str, Any] = {}
    # --- naye fields (backend ko inki zaroorat nahi, purana response bhi chalta hai) ---
    ml_score: Optional[float] = None   # 0..1, model na ho to None
    decision_source: str = 'rules'     # rules | rules+ml | ml | ml_override
    ruleId: Optional[str] = None       # sdkController.js yahi field expect karta hai