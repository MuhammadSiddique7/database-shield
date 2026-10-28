
const Shield = require('@database-shield/node').default;
const { MySQLWrapper } = require('@database-shield/node');


// =====================================================
// 1. INITIALIZE DATABASE SHIELD
// =====================================================

console.log(' Initializing Database Shield SDK...');

Shield.initialize({
  apiKey: 'ds_live_3b117d47aa363a71b5e6b7206e8d0ef3335d5827a934c8b8d91ce7159278f59f',
  backendUrl: 'http://localhost:5000/api/sdk',
  mode: 'cloud',
  failOpen: false
});

const client = Shield.getClient();


// =====================================================
// 2. MOCK DATABASE CONNECTION
// =====================================================

const mockConnection = {

  query: (sql, values, cb) => {

    let callback = cb;

    if (typeof values === 'function') {
      callback = values;
    }

    console.log(`\n[Database Engine] -> Executing: ${sql}`);

    if (callback) {
      callback(
        null,
        [
          {
            id: 1,
            name: 'Alice',
            role: 'admin'
          }
        ],
        null
      );
    }
  },

  end: () => {
    console.log('\n[Database Connection] Closed.');
  }
};


// =====================================================
// 3. WRAP DATABASE WITH SHIELD
// =====================================================

const safeDb = new MySQLWrapper(
  mockConnection,
  client
);


// =====================================================
// 4. QUERY TEST FUNCTION
// =====================================================

async function testQuery(testNumber, title, sql, expected) {

  console.log('\n=========================================');
  console.log(`TEST ${testNumber}: ${title}`);
  console.log('=========================================');

  console.log(` Query: ${sql}`);
  console.log(` Expected: ${expected}`);

  try {

    await new Promise((resolve, reject) => {

      safeDb.query(sql, (err, results) => {

        if (err) {
          return reject(err);
        }

        console.log('\n QUERY ALLOWED');
        console.log('Result:', results);

        resolve();
      });

    });

  } catch (error) {

    if (error.name === 'ShieldSecurityException') {

      console.log('\n BLOCKED BY DATABASE SHIELD!');

      console.log(`   ├─ Action: BLOCK`);
      console.log(`   ├─ Risk Level: ${error.risk}`);
      console.log(`   └─ Reason: ${error.reason}`);

      console.log(
        '   Query was intercepted before reaching the database.'
      );

    } else {

      console.error('\n ERROR:', error.message);

    }
  }
}


// =====================================================
// 5. RUN DEMO
// =====================================================

async function runDemo() {

  console.log('\n=========================================');
  console.log('     DATABASE SHIELD DEMO');
  console.log('     SQL INJECTION DETECTION');
  console.log('=========================================\n');


  await new Promise(resolve =>
    setTimeout(resolve, 500)
  );

  console.log(
    ' Telemetry: Initial Heartbeat sent to Dashboard.'
  );


  // ===================================================
  // TEST 1 — SAFE QUERY
  // ===================================================

  await testQuery(
    1,
    'SAFE QUERY',
    "SELECT * FROM users WHERE email = 'user@example.com'",
    'ALLOW'
  );


  // ===================================================
  // TEST 2 — BOOLEAN SQL INJECTION
  // ===================================================

  await testQuery(
    2,
    'BOOLEAN-BASED SQL INJECTION',
    "SELECT * FROM users WHERE email = 'admin@example.com' OR 1=1 --'",
    'BLOCK'
  );


  // ===================================================
  // TEST 3 — OR TAUTOLOGY
  // ===================================================

  await testQuery(
    3,
    'OR TAUTOLOGY ATTACK',
    "SELECT * FROM users WHERE username = 'admin' OR '1'='1'",
    'BLOCK'
  );


  // ===================================================
  // TEST 4 — UNION SQL INJECTION
  // ===================================================

  await testQuery(
    4,
    'UNION-BASED SQL INJECTION',
    "SELECT username FROM users WHERE id = 1 UNION SELECT password FROM users",
    'BLOCK'
  );


  // ===================================================
  // TEST 5 — COMMENT INJECTION
  // ===================================================

  await testQuery(
    5,
    'SQL COMMENT INJECTION',
    "SELECT * FROM users WHERE username = 'admin' --",
    'BLOCK'
  );


  // ===================================================
  // TEST 6 — DATABASE ENUMERATION
  // ===================================================

  await testQuery(
    6,
    'DATABASE ENUMERATION',
    "SELECT table_name FROM information_schema.tables",
    'BLOCK'
  );


  // ===================================================
  // TEST 7 — TIME-BASED SQL INJECTION
  // ===================================================

  await testQuery(
    7,
    'TIME-BASED SQL INJECTION',
    "SELECT * FROM users WHERE id = 1 AND SLEEP(5)",
    'BLOCK'
  );


  // ===================================================
  // TEST 8 — STACKED QUERY
  // ===================================================

  await testQuery(
    8,
    'STACKED SQL QUERY',
    "SELECT * FROM users WHERE id = 1; DELETE FROM users",
    'BLOCK'
  );


  // ===================================================
  // TEST 9 — DESTRUCTIVE DROP
  // ===================================================

  await testQuery(
    9,
    'DESTRUCTIVE SQL COMMAND',
    "DROP TABLE users",
    'BLOCK'
  );


  // ===================================================
  // TEST 10 — DELETE ATTACK
  // ===================================================

  await testQuery(
    10,
    'UNAUTHORIZED DELETE QUERY',
    "DELETE FROM users WHERE id = 1",
    'BLOCK'
  );


  // ===================================================
  // TEST 11 — UPDATE ATTACK
  // ===================================================

  await testQuery(
    11,
    'UNAUTHORIZED UPDATE QUERY',
    "UPDATE users SET role = 'admin' WHERE id = 1",
    'BLOCK'
  );


  // ===================================================
  // TEST 12 — MULTI STATEMENT
  // ===================================================

  await testQuery(
    12,
    'MULTI-STATEMENT INJECTION',
    "SELECT * FROM users WHERE id = 1; DROP TABLE users",
    'BLOCK'
  );


  // ===================================================
  // TEST 13 — ADMIN BYPASS
  // ===================================================

  await testQuery(
    13,
    'AUTHENTICATION BYPASS',
    "SELECT * FROM users WHERE username = 'admin' AND password = '' OR 1=1",
    'BLOCK'
  );


  // ===================================================
  // DEMO COMPLETE
  // ===================================================

  console.log('\n=========================================');
  console.log('          DEMO COMPLETED');
  console.log('=========================================');

  console.log('\n  Check Database Shield Dashboard');
  console.log('for:');
  console.log('    Attack Logs');
  console.log('    Risk Levels');
  console.log('    Blocked Queries');
  console.log('    Allowed Queries');
  console.log('    Telemetry');
  console.log('    Security Metrics');


  safeDb.end();

  process.exit(0);
}


// =====================================================
// START DEMO
// =====================================================

runDemo();
