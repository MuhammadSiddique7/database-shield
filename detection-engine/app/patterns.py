import re

SQL_PATTERNS = [
    # 1. UNION_INJECTION
    {
        'name': 'UNION_INJECTION_BASIC',
        'pattern': re.compile(r'\bunion\b[\s/\*]+(?:all\s+)?\bselect\b', re.IGNORECASE),
        'severity': 'high',
        'description': 'Union based injection combining results of multiple queries',
        'category': 'UNION_INJECTION'
    },
    {
        'name': 'UNION_INJECTION_OBFUSCATED',
        'pattern': re.compile(r'union(?:%20|\s|\+)+(?:all(?:%20|\s|\+)+)?select', re.IGNORECASE),
        'severity': 'high',
        'description': 'URL encoded or obfuscated union injection',
        'category': 'UNION_INJECTION'
    },
    
    # 2. BOOLEAN_INJECTION
    {
        'name': 'BOOLEAN_OR_NUMERIC',
        'pattern': re.compile(r'\bor\b\s+\d+\s*=\s*\d+', re.IGNORECASE),
        'severity': 'high',
        'description': 'Boolean based injection using numeric tautology',
        'category': 'BOOLEAN_INJECTION'
    },
    {
        'name': 'BOOLEAN_OR_STRING',
        'pattern': re.compile(r'\bor\b\s+[\'"][^\'"]*[\'"]\s*=\s*[\'"][^\'"]*[\'"]', re.IGNORECASE),
        'severity': 'high',
        'description': 'Boolean based injection using string tautology',
        'category': 'BOOLEAN_INJECTION'
    },
    {
        'name': 'BOOLEAN_OR_TRUE',
        'pattern': re.compile(r'\bor\b\s+(?:true|not\s+false)\b', re.IGNORECASE),
        'severity': 'high',
        'description': 'Boolean based injection using boolean true',
        'category': 'BOOLEAN_INJECTION'
    },
    {
        'name': 'BOOLEAN_AND_NUMERIC',
        'pattern': re.compile(r'\band\b\s+\d+\s*=\s*\d+', re.IGNORECASE),
        'severity': 'high',
        'description': 'Boolean AND based numeric tautology',
        'category': 'BOOLEAN_INJECTION'
    },
    {
        'name': 'BOOLEAN_OR_LIKE',
        'pattern': re.compile(r'\bor\b\s+1\s+like\s+1', re.IGNORECASE),
        'severity': 'high',
        'description': 'Boolean based injection using LIKE tautology',
        'category': 'BOOLEAN_INJECTION'
    },

    # 3. COMMENT_INJECTION
    {
        'name': 'LINE_COMMENT_HYPHEN',
        'pattern': re.compile(r'--\s|--$', re.IGNORECASE),
        'severity': 'medium',
        'description': 'SQL line comment (--) commonly used to ignore rest of query',
        'category': 'COMMENT_INJECTION'
    },
    {
        'name': 'LINE_COMMENT_HASH',
        'pattern': re.compile(r'#\s|#$', re.IGNORECASE),
        'severity': 'medium',
        'description': 'MySQL line comment (#) commonly used to ignore rest of query',
        'category': 'COMMENT_INJECTION'
    },
    {
        'name': 'INLINE_COMMENT',
        'pattern': re.compile(r'/\*.*?\*/', re.IGNORECASE),
        'severity': 'medium',
        'description': 'Inline comments (/* */) often used for obfuscation',
        'category': 'COMMENT_INJECTION'
    },
    {
        'name': 'CONDITIONAL_COMMENT',
        'pattern': re.compile(r'/\*!.*\*/', re.IGNORECASE),
        'severity': 'high',
        'description': 'MySQL conditional execution comments',
        'category': 'COMMENT_INJECTION'
    },

    # 4. STACKED_QUERIES
    {
        'name': 'STACKED_QUERY_EXECUTION',
        'pattern': re.compile(r';\s*(?:select|insert|update|delete|drop|alter|create|truncate|exec|execute|union|declare)\b', re.IGNORECASE),
        'severity': 'critical',
        'description': 'Stacked queries via semicolon allowing multiple statement execution',
        'category': 'STACKED_QUERIES'
    },

    # 5. DANGEROUS_KEYWORDS
    {
        'name': 'DROP_STATEMENT',
        'pattern': re.compile(r'\bdrop\b\s+\b(?:table|database|index|view|schema)\b', re.IGNORECASE),
        'severity': 'critical',
        'description': 'Destructive DROP statement detected',
        'category': 'DANGEROUS_KEYWORDS'
    },
    {
        'name': 'TRUNCATE_STATEMENT',
        'pattern': re.compile(r'\btruncate\b\s+\btable\b', re.IGNORECASE),
        'severity': 'critical',
        'description': 'Destructive TRUNCATE statement detected',
        'category': 'DANGEROUS_KEYWORDS'
    },
    {
        'name': 'ALTER_TABLE',
        'pattern': re.compile(r'\balter\b\s+\btable\b', re.IGNORECASE),
        'severity': 'high',
        'description': 'Schema modification ALTER TABLE statement',
        'category': 'DANGEROUS_KEYWORDS'
    },
    {
        'name': 'DELETE_WITHOUT_WHERE',
        'pattern': re.compile(r'\bdelete\b\s+\bfrom\b(?!.*\bwhere\b)', re.IGNORECASE),
        'severity': 'high',
        'description': 'DELETE statement without WHERE clause which would empty the table',
        'category': 'DANGEROUS_KEYWORDS'
    },
    {
        'name': 'DELETE_WITH_WHERE',
        'pattern': re.compile(r'\bdelete\b\s+\bfrom\b.*\bwhere\b', re.IGNORECASE),
        'severity': 'medium',
        'description': 'DELETE statement with WHERE clause detected (requires further scrutiny)',
        'category': 'DANGEROUS_KEYWORDS'
    },

    # 6. COMMAND_EXECUTION
    {
        'name': 'STORED_PROCEDURE_EXECUTION',
        'pattern': re.compile(r'\b(?:xp_cmdshell|sp_executesql|sp_execute)\b', re.IGNORECASE),
        'severity': 'critical',
        'description': 'Dangerous stored procedure execution',
        'category': 'COMMAND_EXECUTION'
    },
    {
        'name': 'EXEC_STATEMENT',
        'pattern': re.compile(r'\bexec(?:ute)?\b\s*\(', re.IGNORECASE),
        'severity': 'critical',
        'description': 'Dynamic SQL execution via EXEC',
        'category': 'COMMAND_EXECUTION'
    },

    # 7. DATA_EXTRACTION
    {
        'name': 'FILE_READ_WRITE',
        'pattern': re.compile(r'\bload_file\b|\binto\b\s+\b(?:outfile|dumpfile)\b', re.IGNORECASE),
        'severity': 'high',
        'description': 'File system read/write operations',
        'category': 'DATA_EXTRACTION'
    },
    {
        'name': 'INFORMATION_SCHEMA_ACCESS',
        'pattern': re.compile(r'\binformation_schema\b', re.IGNORECASE),
        'severity': 'high',
        'description': 'Information schema access, typical in reconnaissance',
        'category': 'DATA_EXTRACTION'
    },
    {
        'name': 'SYSTEM_TABLE_ACCESS',
        'pattern': re.compile(r'\b(?:table_name|column_name|schema_name)\b', re.IGNORECASE),
        'severity': 'high',
        'description': 'Access to metadata column names',
        'category': 'DATA_EXTRACTION'
    },

    # 8. TIME_BASED
    {
        'name': 'TIME_DELAY_FUNCTIONS',
        'pattern': re.compile(r'\b(?:sleep|benchmark|pg_sleep)\b\s*\(', re.IGNORECASE),
        'severity': 'high',
        'description': 'Time delay functions commonly used in blind injection',
        'category': 'TIME_BASED'
    },
    {
        'name': 'WAITFOR_DELAY',
        'pattern': re.compile(r'\bwaitfor\b\s+\bdelay\b', re.IGNORECASE),
        'severity': 'high',
        'description': 'WAITFOR DELAY statement for SQL Server time-based injection',
        'category': 'TIME_BASED'
    },

    # 9. TAUTOLOGY
    {
        'name': 'EMPTY_STRING_TAUTOLOGY',
        'pattern': re.compile(r'[\'"]\s*=\s*[\'"]', re.IGNORECASE),
        'severity': 'high',
        'description': 'Empty string comparison tautology',
        'category': 'TAUTOLOGY'
    },
    {
        'name': 'NUMERIC_EQUALITY_TAUTOLOGY',
        'pattern': re.compile(r'\b(\d+)\s*=\s*\1\b', re.IGNORECASE),
        'severity': 'high',
        'description': 'Numeric equality tautology (e.g., 1=1)',
        'category': 'TAUTOLOGY'
    },
    {
        'name': 'STRING_EQUALITY_TAUTOLOGY',
        'pattern': re.compile(r'([\'"][^\'"]+[\'"])\s*=\s*\1', re.IGNORECASE),
        'severity': 'high',
        'description': 'String equality tautology (e.g., "a"="a")',
        'category': 'TAUTOLOGY'
    },

    # 10. ENCODING_EVASION
    {
        'name': 'CHAR_FUNCTION',
        'pattern': re.compile(r'\bchar\b\s*\(\s*\d+(?:\s*,\s*\d+)*\s*\)', re.IGNORECASE),
        'severity': 'medium',
        'description': 'CHAR function often used to evade string literal filters',
        'category': 'ENCODING_EVASION'
    },
    {
        'name': 'HEX_ENCODING',
        'pattern': re.compile(r'0x[0-9a-f]+', re.IGNORECASE),
        'severity': 'medium',
        'description': 'Hexadecimal encoding sometimes used in injections',
        'category': 'ENCODING_EVASION'
    }
]
