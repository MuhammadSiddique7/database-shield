from typing import List, Optional

import joblib

from .config import MODEL_PATH


class SQLiPredictor:
    def __init__(self, path=MODEL_PATH):
        self.path = path
        self.model = None

    @property
    def available(self) -> bool:
        return self.model is not None

    def load(self) -> bool:
        """Model load karo. File na mile ya kharab ho to False (engine rules-only chalega)."""
        try:
            self.model = joblib.load(self.path)
            return True
        except FileNotFoundError:
            print(f"[ML] Model file nahi mili: {self.path} -> rules-only mode")
        except Exception as exc:  # sklearn version mismatch, corrupt file, etc.
            print(f"[ML] Model load fail ({exc}) -> rules-only mode")
        self.model = None
        return False

    def predict_proba(self, query: str) -> Optional[float]:
        """SQL injection hone ki probability (0..1). Model na ho to None."""
        if self.model is None:
            return None
        return float(self.model.predict_proba([query])[0][1])

    def predict_proba_batch(self, queries: List[str]) -> List[float]:
        if self.model is None:
            raise RuntimeError("Model loaded nahi hai")
        return [float(p) for p in self.model.predict_proba(list(queries))[:, 1]]


# Poori app ek hi instance share karti hai
predictor = SQLiPredictor()
