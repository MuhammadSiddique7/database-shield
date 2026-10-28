import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import PageHeader from '../components/common/PageHeader';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('intro');

  const tabs = [
    { id: 'intro', label: 'Introduction' },
    { id: 'auth', label: 'Authentication' },
    { id: 'api', label: 'API Reference' },
    { id: 'integration', label: 'Integration' },
    { id: 'examples', label: 'Examples' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'intro':
        return (
          <div className="space-y-6 text-gray-300">
            <h2 className="text-2xl font-bold text-white mb-4">What is Database Shield?</h2>
            <p>
              Database Shield is an AI-powered security layer designed to sit between your application logic and your database. 
              By analyzing every query in real-time before it executes, it detects and blocks SQL injection attacks, 
              malicious patterns, and unauthorized data access attempts with 99.9% accuracy.
            </p>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">Key Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Advanced Detection:</strong> 30+ sophisticated regex patterns detect UNION-based, boolean tautologies, time-delay attacks, and more.</li>
              <li><strong>Ultra-Low Latency:</strong> High-performance Python FastAPI engine ensures query analysis adds minimal overhead.</li>
              <li><strong>Comprehensive Logging:</strong> Every query is logged with risk scores, confidence levels, and identified threats for later analysis.</li>
              <li><strong>Seamless SDK Integration:</strong> Official Node.js SDK makes database protection invisible and effortless.</li>
            </ul>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">Architecture</h3>
            <p className="mb-4">As a developer, you install the SDK in your backend server. Here is how the request flows when a user (or hacker) interacts with your application:</p>
            <pre className="code-block bg-gray-900/50 p-4 border border-gray-800 text-cyan-400 font-mono text-sm overflow-x-auto">
{`[ 1. End-User / Attacker ] (e.g. browser, mobile app, script)
           │
           ▼ (Sends malicious or safe input)
           │
[ 2. YOUR Developer Server ] (Where you installed our SDK)
           │
           ├──(SDK intercepts query)──> [ 3. OUR Database Shield Cloud ]
           │                                      │
           │                            (Analyzes query in < 50ms)
           │                                      │
           │<──(Returns Allow/Block)──────────────┘
           │
           ├──> If Allow: Your server executes the query on your Database
           │
           └──> If Block: SDK throws ShieldSecurityException (Attack stopped!)`}
            </pre>
          </div>
        );
      case 'auth':
        return (
          <div className="space-y-6 text-gray-300">
            <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
            <p>
              All API requests to Database Shield must be authenticated using an API key. You can generate API keys by creating Projects in your dashboard.
            </p>
            <h3 className="text-xl font-bold text-white mt-8 mb-4">Passing the API Key</h3>
            <p>
              Include your API key in the <code className="text-cyan-400 bg-gray-900 px-1 rounded">Authorization</code> header of every request as a Bearer token:
            </p>
            <SyntaxHighlighter language="http" style={oneDark} className="rounded-lg text-sm">
{`Authorization: Bearer ds_live_xxxxxxxxxxxxxxxxxxxxxxxx`}
            </SyntaxHighlighter>
            <div className="bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mt-6">
              <p className="text-yellow-400 text-sm font-medium">Security Best Practice</p>
              <p className="text-sm mt-1">Never expose your API key in client-side code (browsers, mobile apps). All requests to Database Shield should originate from your secure backend servers.</p>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="space-y-6 text-gray-300">
            <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
            
            <div className="glass-card p-6 border-l-4 border-cyan-400 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-cyan-900/50 text-cyan-400 px-2 py-1 rounded font-mono text-sm font-bold border border-cyan-400/30">POST</span>
                <code className="text-lg text-white font-mono">/api/analyze-query</code>
              </div>
              <p className="text-gray-400 mb-4">Analyzes a database query and returns a verdict on whether it is safe to execute.</p>
              
              <h4 className="font-semibold text-white mb-2">Request Body</h4>
              <SyntaxHighlighter language="json" style={oneDark} className="rounded-lg text-sm mb-4">
{`{
  "query": "SELECT * FROM users WHERE email = 'user@example.com'",
  "databaseType": "PostgreSQL",
  "ipAddress": "192.168.1.1" // Optional, for advanced tracking
}`}
              </SyntaxHighlighter>

              <h4 className="font-semibold text-white mb-2 mt-6">Response (Success)</h4>
              <SyntaxHighlighter language="json" style={oneDark} className="rounded-lg text-sm">
{`{
  "status": "allow",
  "riskLevel": "safe",
  "confidence": 0.99,
  "analysisTimeMs": 12,
  "threats": []
}`}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      case 'integration':
        return (
          <div className="space-y-6 text-gray-300">
            <h2 className="text-2xl font-bold text-white mb-4">Integration Examples</h2>
            
            <h3 className="text-lg font-bold text-white mt-6 mb-2">Node.js (Official SDK)</h3>
            <SyntaxHighlighter language="javascript" style={oneDark} className="rounded-lg text-sm mb-6">
{`const mysql = require('mysql2');
const Shield = require('@database-shield/node').default;
const { MySQLWrapper } = require('@database-shield/node');

// 1. Initialize Shield
Shield.initialize({
  apiKey: process.env.DS_API_KEY,
  backendUrl: 'https://api.databaseshield.com/api/sdk',
  mode: 'cloud'
});

// 2. Create your normal connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'my_app_db'
});

// 3. Wrap it
const safeDb = new MySQLWrapper(db, Shield.getClient());

// 4. Use it safely anywhere in your app!
safeDb.query("SELECT * FROM users WHERE email = 'admin@example.com' OR 1=1 --'", (err, results) => {
  // Database Shield will intercept, analyze, and block this automatically!
});`}
            </SyntaxHighlighter>

            <h3 className="text-lg font-bold text-white mt-6 mb-2">Python (Requests)</h3>
            <SyntaxHighlighter language="python" style={oneDark} className="rounded-lg text-sm mb-6">
{`import os
import requests

def analyze_query(query_string):
    headers = {
        'Authorization': f"Bearer {os.environ.get('DS_API_KEY')}",
        'Content-Type': 'application/json'
    }
    
    payload = {
        'query': query_string,
        'databaseType': 'PostgreSQL'
    }
    
    response = requests.post('https://api.databaseshield.com/v1/analyze', 
                            json=payload, 
                            headers=headers)
                            
    result = response.json()
    
    if result.get('status') == 'block':
        raise ValueError(f"Threat detected: {result.get('threats')}")
        
    return True`}
            </SyntaxHighlighter>
          </div>
        );
      case 'examples':
        return (
          <div className="space-y-8 text-gray-300">
            <h2 className="text-2xl font-bold text-white mb-4">Analysis Examples</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 border-t-4 border-emerald-400">
                <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Safe Query
                </h3>
                <p className="text-sm mb-2 text-gray-400">Standard parameterized-style query</p>
                <SyntaxHighlighter language="sql" style={oneDark} className="rounded-lg text-sm mb-4">
{`SELECT id, name, email 
FROM users 
WHERE status = 'active' 
ORDER BY created_at DESC 
LIMIT 10;`}
                </SyntaxHighlighter>
                <p className="text-sm mb-2 text-gray-400">Expected Response</p>
                <SyntaxHighlighter language="json" style={oneDark} className="rounded-lg text-sm">
{`{
  "status": "allow",
  "riskLevel": "safe",
  "confidence": 0.99
}`}
                </SyntaxHighlighter>
              </div>

              <div className="glass-card p-6 border-t-4 border-red-400">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span> Malicious Query
                </h3>
                <p className="text-sm mb-2 text-gray-400">Classic tautology injection</p>
                <SyntaxHighlighter language="sql" style={oneDark} className="rounded-lg text-sm mb-4">
{`SELECT * FROM users 
WHERE username = 'admin' 
AND password = 'password' OR '1'='1';`}
                </SyntaxHighlighter>
                <p className="text-sm mb-2 text-gray-400">Expected Response</p>
                <SyntaxHighlighter language="json" style={oneDark} className="rounded-lg text-sm">
{`{
  "status": "block",
  "riskLevel": "critical",
  "confidence": 0.98,
  "threats": ["Tautology Injection"]
}`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader 
        title="Documentation" 
        description="Learn how to integrate and use Database Shield in your applications."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id 
                    ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Documentation;
