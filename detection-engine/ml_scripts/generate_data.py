"""
Synthetic training data banata hai: datasates/queries.csv

Columns:  query, label (0 = benign, 1 = SQL injection), group

'group' train/test split ke liye hai: malicious ke liye payload ki body, benign ke liye
template+table. Is se test set mein aise attacks aate hain jo training mein dekhe nahi gaye
(zyada honest evaluation).

Chalao (detection-engine/ ke root se):   python ml_scripts/generate_data.py
Apna / public dataset use karna ho to: datasates/extra_<naam>.csv rakh do (columns: query,label)
-- train.py usay khud merge kar leta hai.
"""
import csv
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app.ml.config import DATA_DIR, DATASET_PATH  # noqa: E402

random.seed(42)
N_BENIGN_PER_TEMPLATE = 90
N_MALICIOUS_PER_BODY = 45

# --------------------------------------------------------------------------- schema
TABLES = {
    "users": ["id", "username", "email", "role", "created_at", "active"],
    "orders": ["id", "user_id", "total", "status", "created_at"],
    "products": ["id", "name", "price", "stock", "category_id"],
    "customers": ["id", "first_name", "last_name", "city", "phone"],
    "students": ["id", "name", "roll_no", "department", "cgpa"],
    "employees": ["id", "name", "salary", "department", "hired_on"],
    "invoices": ["id", "customer_id", "amount", "paid", "due_date"],
    "rooms": ["id", "room_no", "capacity", "floor", "available"],
}
NAMES = ["ali", "sara", "ahmed", "fatima", "john", "maria", "usman", "ayesha", "bilal", "zara",
         "o''brien", "khan", "smith", "david", "hina"]
STATUS = ["active", "pending", "shipped", "paid", "closed", "open"]
CITIES = ["karachi", "lahore", "islamabad", "multan", "london", "dubai"]
DATES = ["2026-01-15", "2026-03-01", "2025-12-31", "2026-06-30", "2026-09-10"]


def pick(seq):
    return random.choice(seq)


def num():
    return random.randint(1, 5000)


def val_for(col):
    if col in ("id", "user_id", "category_id", "customer_id", "stock", "capacity", "floor"):
        return str(num())
    if col in ("total", "price", "amount", "salary", "cgpa"):
        return str(random.choice([round(random.uniform(1, 9999), 2), num()]))
    if col in ("created_at", "due_date", "hired_on"):
        return f"'{pick(DATES)}'"
    if col in ("active", "paid", "available"):
        return pick(["1", "0", "true", "false"])
    if col == "status":
        return f"'{pick(STATUS)}'"
    if col == "city":
        return f"'{pick(CITIES)}'"
    return f"'{pick(NAMES)}'"


# --------------------------------------------------------------------------- benign
def benign_templates():
    """name -> function(table, cols) -> query. Hard negatives (rules ko trigger karne wali
    legit queries) bhi shamil hain, taake ML false positives kam kare."""
    T = {}

    def cols_sample(cols, k=None):
        k = k or random.randint(1, min(4, len(cols)))
        return ", ".join(random.sample(cols, k))

    T["select_all"] = lambda t, c: f"SELECT * FROM {t}"
    T["select_cols"] = lambda t, c: f"SELECT {cols_sample(c)} FROM {t}"
    T["select_where_eq"] = lambda t, c: f"SELECT {cols_sample(c)} FROM {t} WHERE {(col := pick(c))} = {val_for(col)}"
    T["select_where_and"] = lambda t, c: (
        f"SELECT * FROM {t} WHERE {(a := pick(c))} = {val_for(a)} AND {(b := pick(c))} <> {val_for(b)}")
    T["select_where_or"] = lambda t, c: (
        f"SELECT * FROM {t} WHERE {(a := pick(c))} = {val_for(a)} OR {(b := pick(c))} = {val_for(b)}")
    T["select_order_limit"] = lambda t, c: f"SELECT {cols_sample(c)} FROM {t} ORDER BY {pick(c)} {pick(['ASC','DESC'])} LIMIT {random.randint(5,100)}"
    T["select_like"] = lambda t, c: f"SELECT * FROM {t} WHERE {pick(c)} LIKE '%{pick(NAMES)}%'"
    T["select_in"] = lambda t, c: f"SELECT * FROM {t} WHERE id IN ({num()}, {num()}, {num()})"
    T["select_between"] = lambda t, c: f"SELECT * FROM {t} WHERE {pick(c)} BETWEEN {num()} AND {num() + 5000}"
    T["select_count"] = lambda t, c: f"SELECT COUNT(*) FROM {t} WHERE {(col := pick(c))} = {val_for(col)}"
    T["select_group"] = lambda t, c: f"SELECT {(g := pick(c))}, COUNT(*) AS n FROM {t} GROUP BY {g} HAVING COUNT(*) > {random.randint(1,20)}"
    T["select_agg"] = lambda t, c: f"SELECT MAX({pick(c)}), MIN({pick(c)}), AVG({pick(c)}) FROM {t}"
    T["select_join"] = lambda t, c: (
        f"SELECT a.{pick(c)}, b.id FROM {t} a INNER JOIN {pick(list(TABLES))} b ON a.id = b.id WHERE a.id = {num()}")
    T["select_subquery"] = lambda t, c: f"SELECT * FROM {t} WHERE id IN (SELECT id FROM {pick(list(TABLES))} WHERE id > {num()})"
    T["select_concat"] = lambda t, c: f"SELECT CONCAT({pick(c)}, ' ', {pick(c)}) AS label FROM {t} WHERE id = {num()}"
    T["select_placeholder"] = lambda t, c: f"SELECT {cols_sample(c)} FROM {t} WHERE {pick(c)} = {pick(['?', '$1', ':value', '%s'])}"
    T["select_date"] = lambda t, c: f"SELECT * FROM {t} WHERE created_at >= DATE_SUB(NOW(), INTERVAL {random.randint(1,90)} DAY)"
    T["insert"] = lambda t, c: (
        f"INSERT INTO {t} ({', '.join(c[1:4])}) VALUES ({', '.join(val_for(x) for x in c[1:4])})")
    T["insert_ph"] = lambda t, c: f"INSERT INTO {t} ({', '.join(c[1:4])}) VALUES (?, ?, ?)"
    T["update"] = lambda t, c: f"UPDATE {t} SET {(a := pick(c[1:]))} = {val_for(a)} WHERE id = {num()}"
    T["update_multi"] = lambda t, c: (
        f"UPDATE {t} SET {(a := c[1])} = {val_for(a)}, {(b := c[2])} = {val_for(b)} WHERE id = {num()}")
    T["delete_where"] = lambda t, c: f"DELETE FROM {t} WHERE id = {num()}"
    T["delete_range"] = lambda t, c: f"DELETE FROM {t} WHERE created_at < '{pick(DATES)}'" if "created_at" in c else f"DELETE FROM {t} WHERE id < {num()}"

    # ---- hard negatives: legit, lekin rules ko trigger kar sakti hain ----
    T["hn_where_1_1"] = lambda t, c: f"SELECT * FROM {t} WHERE 1=1 AND {(a := pick(c))} = {val_for(a)}"
    T["hn_where_1_1_b"] = lambda t, c: f"SELECT {cols_sample(c)} FROM {t} WHERE 1 = 1 ORDER BY id DESC LIMIT {random.randint(5,50)}"
    T["hn_line_comment"] = lambda t, c: f"SELECT {cols_sample(c)} FROM {t} WHERE id = {num()} -- {pick(['by id', 'lookup', 'report query', 'active only'])}"
    T["hn_block_comment"] = lambda t, c: f"/* {pick(['audit', 'report', 'cron job', 'dashboard'])} */ SELECT * FROM {t} WHERE id = {num()}"
    T["hn_hash_comment"] = lambda t, c: f"SELECT * FROM {t} WHERE id = {num()} # {pick(['check', 'fix later', 'admin report'])}"
    T["hn_hex_literal"] = lambda t, c: f"SELECT * FROM {t} WHERE id = {num()} AND token = 0x{random.randint(4096, 65535):X}"
    T["hn_alter"] = lambda t, c: f"ALTER TABLE {t} ADD COLUMN {pick(['notes', 'nickname', 'flag', 'phone2'])} VARCHAR({pick([20, 50, 255])})"
    T["hn_delete_all_temp"] = lambda t, c: f"DELETE FROM sessions WHERE expires_at < '{pick(DATES)}'"
    T["hn_union_legit"] = lambda t, c: f"SELECT {(x := pick(c))} FROM {t} UNION SELECT {x} FROM {t}_archive"
    T["hn_create_index"] = lambda t, c: f"CREATE INDEX idx_{t}_{pick(c)} ON {t} ({pick(c)})"
    T["hn_char_fn"] = lambda t, c: f"SELECT CHAR({random.randint(65, 90)}) AS letter, {pick(c)} FROM {t} LIMIT 10"
    return T


def gen_benign():
    rows = []
    for name, fn in benign_templates().items():
        for _ in range(N_BENIGN_PER_TEMPLATE):
            t = pick(list(TABLES))
            q = fn(t, TABLES[t])
            rows.append((q, 0, f"b:{name}:{t}"))
    return rows


# ------------------------------------------------------------------------ malicious
# Textbook / OWASP-level SQL injection bodies (detection training ke liye).
BODIES = [
    # authentication bypass / tautology
    "", "OR 1=1", "OR 2>1", "OR 'a'='a'", "OR ''=''", "OR TRUE", "OR 5=5", "AND 1=1",
    "OR 'x' LIKE 'x'", "OR 1 IN (1)", "OR 3 BETWEEN 1 AND 5", "|| 1=1", "OR NOT 1=2",
    "OR 1=1 LIMIT 1", "OR id IS NOT NULL", "OR 7=7 AND 1=1",
    # union-based
    "UNION SELECT NULL", "UNION SELECT NULL,NULL", "UNION SELECT NULL,NULL,NULL",
    "UNION ALL SELECT 1,2,3", "UNION SELECT username,password FROM users",
    "UNION SELECT table_name,NULL FROM information_schema.tables",
    "UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'",
    "UNION SELECT @@version", "UNION SELECT database(),user()", "UNION SELECT 1,version()",
    "UNION SELECT load_file('/etc/passwd')", "UNION SELECT 1 INTO OUTFILE '/tmp/out.txt'",
    "ORDER BY 10", "ORDER BY 99", "GROUP BY 1 HAVING 1=1",
    # time-based blind
    "AND SLEEP(5)", "OR SLEEP(5)", "AND BENCHMARK(5000000,MD5(1))",
    "AND (SELECT 1 FROM (SELECT SLEEP(5))a)", "; WAITFOR DELAY '0:0:5'", "AND 1=(SELECT pg_sleep(5))",
    # error-based
    "AND EXTRACTVALUE(1,CONCAT(0x7e,(SELECT @@version)))",
    "AND UPDATEXML(1,CONCAT(0x7e,(SELECT user())),1)",
    "AND (SELECT COUNT(*) FROM information_schema.tables)>0",
    "AND 1=CONVERT(int,(SELECT @@version))",
    # boolean blind
    "AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a'",
    "AND ASCII(SUBSTRING(database(),1,1))>64", "AND LENGTH(database())>3",
    "AND (SELECT COUNT(*) FROM users)>0", "AND EXISTS(SELECT * FROM users)",
    # stacked queries
    "; DROP TABLE users", "; DELETE FROM users", "; TRUNCATE TABLE logs",
    "; UPDATE users SET role='admin' WHERE 1=1", "; INSERT INTO users(username,role) VALUES('x','admin')",
    "; SELECT SLEEP(5)", "; EXEC xp_cmdshell('dir')", "; DROP DATABASE shop", "; ALTER TABLE users DROP COLUMN email",
    # encoding evasion
    "OR CHAR(49)=CHAR(49)", "UNION SELECT 0x61646d696e", "AND 0x31=0x31",
    "/*!50000UNION*/ /*!50000SELECT*/ 1,2", "UNION/**/SELECT/**/NULL,NULL",
]

KEYWORDS = ["union", "select", "or", "and", "from", "where", "sleep", "order", "by", "group", "having",
            "insert", "update", "delete", "drop", "table", "waitfor", "delay", "limit", "null"]


def _case_mix(s):
    out = []
    for w in s.split(" "):
        out.append("".join(ch.upper() if random.random() < 0.5 else ch.lower() for ch in w)
                   if w.lower() in KEYWORDS and random.random() < 0.5 else w)
    return " ".join(out)


def obfuscate(s):
    r = random.random()
    if r < 0.30:
        s = _case_mix(s)
    r = random.random()
    if r < 0.10:
        s = s.replace(" ", "/**/")
    elif r < 0.18:
        s = s.replace(" ", "%20")
    elif r < 0.24:
        s = s.replace("'", "%27")
    elif r < 0.30:
        s = s.replace(" ", "  ")
    elif r < 0.34:
        s = s.replace(" ", "\t")
    return s


WRAPPERS = [
    ("str", "{v}' {b}-- "),
    ("str", "{v}' {b}#"),
    ("str", "{v}' {b} AND 'x'='x"),
    ("str", "{v}') {b}-- "),
    ("num", "{v} {b}"),
    ("num", "{v} {b}-- "),
    ("num", "{v}) {b}-- "),
]

# query contexts: (template, kind)
CONTEXTS = [
    ("SELECT * FROM {t} WHERE {c} = '{inj}'", "str"),
    ("SELECT {cols} FROM {t} WHERE {c} = '{inj}' AND active = 1", "str"),
    ("SELECT * FROM {t} WHERE {c} LIKE '%{inj}%'", "str"),
    ("UPDATE {t} SET {c2} = 'x' WHERE {c} = '{inj}'", "str"),
    ("DELETE FROM {t} WHERE {c} = '{inj}'", "str"),
    ("SELECT * FROM {t} WHERE id = {inj}", "num"),
    ("SELECT {cols} FROM {t} WHERE id = {inj} ORDER BY id", "num"),
    ("UPDATE {t} SET {c2} = 'x' WHERE id = {inj}", "num"),
    ("SELECT * FROM {t} WHERE id = {inj} LIMIT 10", "num"),
]


def gen_malicious():
    rows = []
    for body in BODIES:
        for _ in range(N_MALICIOUS_PER_BODY):
            ctx_tpl, kind = pick(CONTEXTS)
            wrap = pick([w for k, w in WRAPPERS if k == kind])
            t = pick(list(TABLES))
            cols = TABLES[t]
            v = pick(NAMES).replace("''", "") if kind == "str" else str(num())
            inj = obfuscate(wrap.format(v=v, b=body))
            q = ctx_tpl.format(t=t, c=pick(cols[1:]), c2=pick(cols[1:]),
                               cols=", ".join(random.sample(cols, 2)), inj=inj)
            rows.append((q, 1, f"m:{body or 'comment_only'}"))
    return rows


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    rows = gen_benign() + gen_malicious()
    seen, unique = set(), []
    for q, label, grp in rows:
        key = (q, label)
        if key in seen:
            continue
        seen.add(key)
        unique.append((q, label, grp))
    random.shuffle(unique)

    with open(DATASET_PATH, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["query", "label", "group"])
        w.writerows(unique)

    n1 = sum(1 for _, l, _ in unique if l == 1)
    print(f"Saved {len(unique)} rows -> {DATASET_PATH}")
    print(f"  benign   : {len(unique) - n1}")
    print(f"  malicious: {n1}")
    print("Note: ye synthetic data hai. Behtar nateeje ke liye datasates/extra_<naam>.csv mein "
          "public/real dataset (columns: query,label) bhi rakho.")


if __name__ == "__main__":
    main()