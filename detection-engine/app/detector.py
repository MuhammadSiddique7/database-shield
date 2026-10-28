from typing import List, Optional, Tuple
from urllib.parse import unquote

from .models import DetectionResult, ThreatDetail
from .patterns import SQL_PATTERNS
from .ml.predictor import predictor

# ---- Hybrid decision thresholds (evaluate.py se tune karo) ----
ML_BLOCK_THRESHOLD = 0.70      # koi rule match nahi, phir bhi ML itna sure ho to block
ML_CONFIRM_THRESHOLD = 0.50    # sirf medium rules match hon to ML itna kahe tab block
HIGH_RULE_CLEARED_BELOW = 0.30 # high rule match, lekin ML isse kam kahe -> allow (false positive)
# 'critical' rules (DROP, stacked queries, xp_cmdshell...) ko ML kabhi override nahi karta.

SEVERITY_RANK = {'none': 0, 'low': 1, 'medium': 2, 'high': 3, 'critical': 4}


class SQLDetector:
    def __init__(self):
        self.patterns = SQL_PATTERNS

    # ------------------------------------------------------------------ rules
    def normalize(self, query: str) -> str:
        normalized = query
        # Poora URL-decode (double encoding bhi), pehle sirf 7 codes decode hote the
        for _ in range(3):
            decoded = unquote(normalized)
            if decoded == normalized:
                break
            normalized = decoded

        normalized = normalized.lower()
        normalized = ' '.join(normalized.split())
        return normalized.strip()

    def match_rules(self, normalized_query: str) -> List[ThreatDetail]:
        threats = []
        for p in self.patterns:
            if p['pattern'].search(normalized_query):
                threats.append(ThreatDetail(
                    type=p['category'],
                    description=p['description'],
                    severity=p['severity'],
                    rule_id=p['name'],
                ))
        return threats

    # ----------------------------------------------------------------- hybrid
    def decide(self, threats: List[ThreatDetail], ml: Optional[float],
               block_t: float = None, confirm_t: float = None, clear_t: float = None) -> Tuple[bool, str]:
        """(block?, decision_source). Thresholds optional hain (evaluate.py sweep ke liye)."""
        block_t = ML_BLOCK_THRESHOLD if block_t is None else block_t
        confirm_t = ML_CONFIRM_THRESHOLD if confirm_t is None else confirm_t
        clear_t = HIGH_RULE_CLEARED_BELOW if clear_t is None else clear_t

        if ml is None:  # model nahi -> purana rules-only behaviour
            return bool(threats), 'rules'

        severity = self.calculate_risk(threats)

        if severity == 'critical':
            return True, 'rules'
        if severity == 'high':
            if ml < clear_t:
                return False, 'ml_override'
            return True, 'rules+ml'
        if severity in ('medium', 'low'):
            if ml >= confirm_t:
                return True, 'rules+ml'
            return False, 'ml_override'

        # koi rule match nahi
        if ml >= block_t:
            return True, 'ml'
        return False, 'rules+ml'

    def detect(self, query: str, database_type: str = 'MySQL') -> DetectionResult:
        normalized_query = self.normalize(query)
        threats = self.match_rules(normalized_query)
        ml = predictor.predict_proba(query)  # ML apni normalize() khud karta hai

        block, source = self.decide(threats, ml)

        if block and source == 'ml':
            threats.append(ThreatDetail(
                type='ML_DETECTION',
                description=f'ML model flagged this query as SQL injection (score {ml:.2f})',
                severity='high',
                rule_id='ML-001',
            ))

        risk_level = self.calculate_risk_final(threats, block, source, ml)
        confidence = self.calculate_confidence(threats, normalized_query, block, ml)

        return DetectionResult(
            is_safe=not block,
            risk_level=risk_level,
            confidence=confidence,
            threats=threats,
            reason=self.generate_reason(threats, block, source, ml),
            details={
                'database_type': database_type,
                'threat_count': len(threats),
                'ml_available': ml is not None,
            },
            ml_score=None if ml is None else round(ml, 4),
            decision_source=source,
            ruleId=threats[0].rule_id if (threats and block) else None,
        )

    # ---------------------------------------------------------------- scoring
    def calculate_risk(self, threats: list) -> str:
        highest, max_val = 'none', 0
        for t in threats:
            val = SEVERITY_RANK.get(t.severity, 0)
            if val > max_val:
                max_val, highest = val, t.severity
        return highest

    def calculate_risk_final(self, threats, block, source, ml) -> str:
        if block:
            if source == 'ml':
                return 'high' if ml >= 0.97 else 'medium'
            return self.calculate_risk(threats)
        # allow
        if threats or (ml is not None and ml >= 0.5):
            return 'low'  # suspicious signals the, lekin allow kiya
        return 'none'

    def calculate_confidence(self, threats, query, block, ml) -> float:
        if ml is not None:
            if block:
                rule_conf = self._rule_confidence(threats)
                return round(min(max(ml * 100, rule_conf if threats else 0), 99.9), 1)
            return round(min(max((1 - ml) * 100, 50.0), 99.9), 1)
        # model nahi: purana formula
        return self._rule_confidence(threats) if threats else 95.0

    @staticmethod
    def _rule_confidence(threats) -> float:
        if not threats:
            return 95.0
        base = 60.0 + (len(threats) * 8.0)
        if any(t.severity == 'critical' for t in threats):
            base += 10.0
        base += len(set(t.type for t in threats)) * 5.0
        return round(min(base, 99.5), 1)

    def generate_reason(self, threats, block, source, ml) -> str:
        if not block:
            if source == 'ml_override':
                return 'Pattern match hua lekin ML model ne query ko safe maana. Allowed.'
            return 'Query appears safe. No SQL injection patterns detected.'
        if source == 'ml':
            return f'No rule matched, but ML model detected SQL injection (score {ml:.2f}).'
        if len(threats) == 1:
            return f'Detected: {threats[0].description}'
        types = sorted(set(t.type for t in threats))
        return f'Multiple threats detected: {", ".join(types)}. {len(threats)} potential attack patterns found.'