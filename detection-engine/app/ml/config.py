"""Saare paths ek jagah. Folder ka naam badalna ho to sirf yahan badlo."""
from pathlib import Path

# detection-engine/ ka root (is file se 2 level upar: ml -> app -> detection-engine)
BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "datasates"          # agar folder rename karo to "datasets" likh do
MODEL_DIR = BASE_DIR / "saved_models"

DATASET_PATH = DATA_DIR / "queries.csv"    # generate_data.py yahan likhta hai
TEST_PATH = DATA_DIR / "test.csv"          # train.py held-out test set yahan save karta hai
RESULTS_PATH = DATA_DIR / "evaluation_results.csv"
MODEL_PATH = MODEL_DIR / "sqli_model.joblib"
