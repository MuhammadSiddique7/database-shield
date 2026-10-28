"""
Demo app jaisi queries (users / email / username / password) ka extra data.
generate_data.py isay khud import karta hai -- is file ko alag se chalane ki zaroorat nahi.
"""
import random

EMAILS = ["user@example.com", "ali@gmail.com", "sara.khan@yahoo.com", "admin@example.com",
          "john.smith@company.org", "fatima@uni.edu.pk", "test@test.com", "bilal123@outlook.com",
          "info@shop.pk", "ayesha@mail.com"]
USERS = ["admin", "ali", "sara", "john", "guest", "manager", "root", "ahmed", "zara", "bilal"]
PASSWORDS = ["secret123", "P@ssw0rd", "abc123", "hello2026", "qwerty", "letmein"]
ROLES = ["admin", "user", "editor", "moderator", "guest"]
TABLES = ["users", "accounts", "customers", "employees", "students"]

ENUM = [
    "SELECT table_name FROM information_schema.tables",
    "SELECT * FROM information_schema.tables",
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'users'",
    "SELECT schema_name FROM information_schema.schemata",
    "SELECT table_name, table_schema FROM information_schema.tables WHERE table_schema = 'public'",
    "SELECT @@version", "SELECT database()", "SELECT user()", "SELECT version()", "SELECT @@datadir",
]


def _n():
    return random.randint(1, 5000)


def gen_demo_rows(obfuscate):
    pick = random.choice
    rows = []

    # ---------------- benign (label 0) ----------------
    benign = {
        "email_lookup": lambda: f"SELECT * FROM users WHERE email = '{pick(EMAILS)}'",
        "login": lambda: f"SELECT * FROM users WHERE username = '{pick(USERS)}' AND password = '{pick(PASSWORDS)}'",
        "user_by_id": lambda: f"SELECT {pick(['username', 'email', 'role'])} FROM users WHERE id = {_n()}",
        "delete_user": lambda: f"DELETE FROM users WHERE id = {_n()}",
        "update_role": lambda: f"UPDATE users SET role = '{pick(ROLES)}' WHERE id = {_n()}",
        "update_email": lambda: f"UPDATE users SET email = '{pick(EMAILS)}' WHERE id = {_n()}",
        "count_role": lambda: f"SELECT COUNT(*) FROM users WHERE role = '{pick(ROLES)}'",
    }
    for name, fn in benign.items():
        for _ in range(150):
            rows.append((fn(), 0, f"b:demo_{name}"))

    # ---------------- attacks (label 1) ----------------
    for _ in range(150):
        e, u, n, k = pick(EMAILS), pick(USERS), _n(), random.randint(2, 10)
        t = pick(TABLES)
        att = {
            "bool_comment": f"SELECT * FROM users WHERE email = '{e}' OR 1=1 --'",
            "tautology": f"SELECT * FROM users WHERE username = '{u}' OR '1'='1'",
            "union_pw": (f"SELECT {pick(['username', 'email', 'name'])} FROM users WHERE id = {n} "
                         f"UNION SELECT {pick(['password', 'password_hash', 'secret'])} FROM users"),
            "comment": f"SELECT * FROM users WHERE username = '{u}' --",
            "time": f"SELECT * FROM users WHERE id = {n} AND SLEEP({k})",
            "stacked": f"SELECT * FROM users WHERE id = {n}; {pick(['DELETE FROM users', 'DROP TABLE users', 'TRUNCATE TABLE users'])}",
            "drop": f"DROP TABLE {t}",
            "authbypass": f"SELECT * FROM users WHERE username = '{u}' AND password = '' OR 1=1",
        }
        for name, q in att.items():
            rows.append((obfuscate(q), 1, f"m:demo_{name}"))
        i = random.randrange(len(ENUM))
        rows.append((obfuscate(ENUM[i]), 1, f"m:demo_enum{i}"))
    return rows
