"""
Rules-only vs ML-only vs Hybrid ka comparison (FYP report ke liye).
Held-out datasates/test.csv par chalta hai (train.py ne banaya).

Chalao:  python ml_scripts/evaluate.py
"""
import sys
from pathlib import Path

import pandas as pd
from sklearn.metrics import confusion_matrix

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.detector import SQLDetector  # noqa: E402
from app.ml.config import RESULTS_PATH, TEST_PATH  # noqa: E402
from app.ml.predictor import predictor  # noqa: E402


def metrics(name, y, pred):
    tn, fp, fn, tp = confusion_matrix(y, pred, labels=[0, 1]).ravel()
    prec = tp / (tp + fp) if tp + fp else 0.0
    rec = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * prec * rec / (prec + rec) if prec + rec else 0.0
    fpr = fp / (fp + tn) if fp + tn else 0.0
    acc = (tp + tn) / len(y)
    return {"method": name, "accuracy": acc, "precision": prec, "recall": rec,
            "f1": f1, "false_positive_rate": fpr, "TP": tp, "FP": fp, "FN": fn, "TN": tn}


def main():
    if not TEST_PATH.exists():
        sys.exit("test.csv nahi mili. Pehle chalao: python ml_scripts/train.py")
    if not predictor.load():
        sys.exit("Model load nahi hua. Pehle chalao: python ml_scripts/train.py")

    test = pd.read_csv(TEST_PATH)
    queries, y = test["query"].astype(str).tolist(), test["label"].astype(int).tolist()
    det = SQLDetector()

    rules_pred = [1 if det.match_rules(det.normalize(q)) else 0 for q in queries]
    ml_pred = [1 if p >= 0.5 else 0 for p in predictor.predict_proba_batch(queries)]
    hybrid_res = [det.detect(q) for q in queries]
    hybrid_pred = [0 if r.is_safe else 1 for r in hybrid_res]

    rows = [metrics("Rules only (purana)", y, rules_pred),
            metrics("ML only", y, ml_pred),
            metrics("Hybrid (rules+ML)", y, hybrid_pred)]
    out = pd.DataFrame(rows)

    show = out.copy()
    for c in ["accuracy", "precision", "recall", "f1", "false_positive_rate"]:
        show[c] = (show[c] * 100).map("{:.2f}%".format)
    print(f"\nTest set: {len(y)} queries  (malicious: {sum(y)}, benign: {len(y) - sum(y)})\n")
    print(show.to_string(index=False))

    out.to_csv(RESULTS_PATH, index=False)
    print(f"\nSaved -> {RESULTS_PATH}")

    # Threshold sweep: (ML_BLOCK, HIGH_RULE_CLEARED_BELOW) ke combos
    ml_scores = predictor.predict_proba_batch(queries)
    threats_list = [det.match_rules(det.normalize(q)) for q in queries]
    print("\n--- Threshold sweep (ML_BLOCK_THRESHOLD x HIGH_RULE_CLEARED_BELOW) ---")
    print(f"{'block_t':>8} {'clear_t':>8} {'precision':>10} {'recall':>8} {'FPR':>8} {'FP':>5} {'FN':>5}")
    for block_t in (0.5, 0.7, 0.9):
        for clear_t in (0.05, 0.1, 0.3, 0.5):
            pred = [1 if det.decide(t, m, block_t=block_t, clear_t=clear_t)[0] else 0
                    for t, m in zip(threats_list, ml_scores)]
            m_ = metrics("x", y, pred)
            print(f"{block_t:>8} {clear_t:>8} {m_['precision']*100:>9.2f}% {m_['recall']*100:>7.2f}% "
                  f"{m_['false_positive_rate']*100:>7.2f}% {m_['FP']:>5} {m_['FN']:>5}")

    # Hybrid ki ghaltiyan dekho (tuning ke liye)
    fps = [(q, r.ml_score) for q, r, t in zip(queries, hybrid_res, y) if t == 0 and not r.is_safe]
    fns = [(q, r.ml_score) for q, r, t in zip(queries, hybrid_res, y) if t == 1 and r.is_safe]
    print(f"\nHybrid False Positives (safe query block hui): {len(fps)}")
    for q, s in fps[:5]:
        print(f"  [{s}] {q[:110]}")
    print(f"\nHybrid False Negatives (attack allow hua): {len(fns)}")
    for q, s in fns[:5]:
        print(f"  [{s}] {q[:110]}")


if __name__ == "__main__":
    main()
