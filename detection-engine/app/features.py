import re
from urllib.parse import unquote

MAX_LEN = 2000  # bohat lambi queries se latency na barhe

_COND_COMMENT = re.compile(r"/\*!\d*")           # /*!50000 ... */  (MySQL conditional comment)
_BLOCK_COMMENT = re.compile(r"/\*.*?\*/", re.DOTALL)
_SPACES = re.compile(r"\s+")


def normalize(query) -> str:
    s = str(query)[:MAX_LEN]

    # URL-encoding utaro (double/triple encoding bhi: %2527 -> %27 -> ')
    for _ in range(3):
        decoded = unquote(s)
        if decoded == s:
            break
        s = decoded

    s = s.lower()
    s = _COND_COMMENT.sub(" ", s)
    s = _BLOCK_COMMENT.sub(" ", s)      # un/**/ion, union/**/select -> normal spacing
    s = _SPACES.sub(" ", s).strip()
    return s