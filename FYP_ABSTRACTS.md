# FYP Abstracts: Database Attacks Detection and Prevention

Here are two versions of the abstract for your Final Year Project (FYP). 
- **Abstract 1** focuses on the current state (Deterministic Rule-Based Detection). 
- **Abstract 2** focuses on the complete vision including the upcoming Version 2 (AI/ML Hybrid Detection). You can choose the one that best fits the scope of your FYP defense.

---

## Abstract 1: Rule-Based Real-Time Interception (Current V1 Focus)

**Abstract Summary:**
This project presents "Database Shield," a cloud-based Security-as-a-Service (SECaaS) platform designed to intercept, analyze, and mitigate database injection attacks in real-time. By utilizing a highly decoupled microservices architecture, it provides developers with seamless SDK integrations to protect their backend architectures without requiring complex code modifications.

**Problem Statement:**
SQL Injection (SQLi) remains one of the most prevalent and critical vulnerabilities in modern web applications. Traditional Web Application Firewalls (WAFs) operate at the HTTP edge and often lack deep context into the actual database query logic. Furthermore, integrating robust database security directly into backend application code is time-consuming and prone to human error, leaving applications vulnerable to tautologies, destructive keywords, and stacked queries.

**Solution:**
Database Shield offers a plug-and-play architectural solution. A Node.js SDK wraps the application’s native database connection object. Before any query executes against the real database, the SDK asynchronously forwards the payload to a high-performance Python FastAPI Detection Engine. If the engine flags the query as malicious, the SDK intercepts the execution, throwing an exception and halting the attack instantly.

**Technical Details:**
The system is composed of a React 18/Tailwind CSS frontend for analytics, a Node.js/Express core backend for telemetry and API key management, and a Python 3.14 Detection Engine. The detection engine currently employs a deterministic, regex-based evaluator utilizing over 30 sophisticated patterns categorized by threat type (e.g., UNION injections, time-delay attacks). 

**Objectives:**
1. To develop a low-latency query interception mechanism via an application-level SDK.
2. To accurately identify and categorize SQL injection attempts using deterministic pattern matching.
3. To provide developers with a real-time visual dashboard detailing query volumes, risk levels, and attack telemetry.

**Datasets:**
The rule-based detection engine was built and tested against a curated dataset of over 10,000 SQL injection payloads combined from open-source penetration testing repositories (such as SecLists) and normal, safe application queries to ensure a zero false-positive rate during acceptance testing.

---

## Abstract 2: Hybrid AI-Driven DSPM (V2 Vision Focus)

**Abstract Summary:**
This project introduces an intelligent Database Security Posture Management (DSPM) platform capable of intercepting both known and zero-day database injection attacks. By combining deterministic signature matching with Machine Learning anomaly detection, the system provides an ultra-low-latency, highly accurate defensive layer between web applications and their underlying databases.

**Problem Statement:**
While signature-based detection effectively stops known SQL injection patterns, it struggles against heavily obfuscated or entirely novel (Zero-Day) attacks. Furthermore, the rise of NoSQL databases (like MongoDB) has introduced new vectors of attack that traditional SQL-centric security models cannot comprehend. A dynamic, context-aware approach is required to secure modern web architectures.

**Solution:**
The proposed system integrates a hybrid Python-based Detection Engine accessed via lightweight, language-specific SDKs. The engine first sanitizes and tokenizes incoming queries into Abstract Syntax Trees (AST). It then passes the query through a two-step pipeline: a strict regex-based filter for immediate signature detection, followed by an unsupervised Machine Learning model (Anomaly Detection) designed to identify structural deviations from the application's baseline behavior.

**Technical Details:**
The architecture relies on a Node.js/Express proxy that routes traffic from the client SDKs to a Python FastAPI microservice. The next iteration of the Python engine will utilize NLP tokenizers (like `sqlparse`) and Scikit-Learn/TensorFlow for anomaly detection. Real-time metrics and attacker IP reputations are aggregated in MongoDB and visualized through a React 18 dashboard utilizing Recharts and Framer Motion.

**Objectives:**
1. To create a hybrid detection engine combining regex heuristics with ML anomaly detection.
2. To protect against both SQL and NoSQL (MongoDB) injection vulnerabilities.
3. To implement automated, stateful mitigation strategies, such as IP reputation blocklisting, to stop persistent attackers at the edge.
4. To maintain query analysis overhead below 50ms to ensure high application availability.

**Datasets:**
The ML models will be trained and evaluated using the highly regarded CSIC 2010 HTTP Dataset (adapted for query strings) alongside synthetic datasets generated via SQLmap. Safe baseline data will be established by recording normal application traffic during a simulated learning phase, providing the baseline for the Isolation Forest anomaly detection algorithms.
