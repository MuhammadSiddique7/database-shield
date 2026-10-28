import argparse
import hashlib
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import FeatureUnion, Pipeline

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.ml.config import DATA_DIR, DATASET_PATH, MODEL_DIR, MODEL_PATH, TEST_PATH  # noqa: E402
from app.ml.features import normalize  # noqa: E402


def load_data() -> pd.DataFrame:
    if not DATASET_PATH.exists():
        sys.exit(f"{DATASET_PATH} nahi mili. Pehle chalao: python ml_scripts/generate_data.py")

    frames = [pd.read_csv(DATASET_PATH)]
    for extra in sorted(DATA_DIR.glob("extra_*.csv")):
        df = pd.read_csv(extra)
        if not {"query", "label"} <= set(df.columns):
            print(f"[skip] {extra.name}: columns 'query,label' chahiye")
            continue
        if "group" not in df.columns:
            df["group"] = ["x:" + hashlib.md5(str(q).encode()).hexdigest()[:10] for q in df["query"]]
        frames.append(df[["query", "label", "group"]])
        print(f"[+] {extra.name}: {len(df)} rows")

    df = pd.concat(frames, ignore_index=True)
    df = df.dropna(subset=["query", "label"])
    df["query"] = df["query"].astype(str)
    df["label"] = df["label"].astype(int)
    return df.drop_duplicates(subset=["query", "label"]).reset_index(drop=True)


def build_pipeline() -> Pipeline:
    features = FeatureUnion([
        # char n-grams: symbols ('  --  /*  =) pakarte hain, obfuscation par bhi chalte hain
        ("char", TfidfVectorizer(analyzer="char", ngram_range=(2, 5), preprocessor=normalize,
                                 sublinear_tf=True, min_df=2, max_features=150_000)),
        # word n-grams: "union select", "or 1 = 1" jaise SQL phrases
        ("word", TfidfVectorizer(analyzer="word", ngram_range=(1, 3), preprocessor=normalize,
                                 token_pattern=r"[a-z_@]+|\d+|[^\sa-z\d]", sublinear_tf=True, min_df=2)),
    ])
    clf = LogisticRegression(C=10, max_iter=3000, class_weight="balanced")
    return Pipeline([("features", features), ("clf", clf)])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--full", action="store_true", help="poore data par train (test set nahi)")
    args = ap.parse_args()

    df = load_data()
    print(f"\nTotal rows: {len(df)}  (malicious: {int(df.label.sum())}, benign: {int((df.label == 0).sum())})")

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    model = build_pipeline()

    if args.full:
        model.fit(df["query"], df["label"])
        joblib.dump(model, MODEL_PATH)
        print(f"\nFinal model (poore data par) saved -> {MODEL_PATH}")
        return

    # Group split: test mein aise attack-payloads / templates aate hain jo train mein nahi the
    splitter = GroupShuffleSplit(n_splits=1, test_size=0.25, random_state=42)
    train_idx, test_idx = next(splitter.split(df, df["label"], groups=df["group"]))
    train, test = df.iloc[train_idx], df.iloc[test_idx]
    print(f"Train: {len(train)}  Test: {len(test)} (unseen groups)")

    model.fit(train["query"], train["label"])

    proba = model.predict_proba(test["query"])[:, 1]
    pred = (proba >= 0.5).astype(int)
    print("\n=== ML-only test report (threshold 0.5) ===")
    print(classification_report(test["label"], pred, target_names=["benign", "malicious"], digits=4))
    tn, fp, fn, tp = confusion_matrix(test["label"], pred).ravel()
    print(f"Confusion: TN={tn} FP={fp} FN={fn} TP={tp}")
    print(f"ROC-AUC  : {roc_auc_score(test['label'], proba):.4f}")

    joblib.dump(model, MODEL_PATH)
    test[["query", "label", "group"]].to_csv(TEST_PATH, index=False)
    print(f"\nModel saved    -> {MODEL_PATH}")
    print(f"Test set saved -> {TEST_PATH}")
    print("Ab chalao: python ml_scripts/evaluate.py")


if __name__ == "__main__":
    main()