# Academic Breakdown: Hybrid AI-Driven DSPM (Based on Abstract 2)

This document provides a comprehensive academic breakdown of your "Abstract 2: Hybrid AI-Driven DSPM" to help you structure your Final Year Project (FYP) thesis proposal or defense. It expands on the provided abstract to align with standard university research standards.

## 1. Research Title (Proposed)
*Intelligent Database Security Posture Management (DSPM): A Hybrid AI-Driven Approach for Zero-Day SQL and NoSQL Injection Detection*

## 2. Problem Statement
Traditional Web Application Firewalls (WAFs) and signature-based detection mechanisms are highly effective against known threats but fail to protect against heavily obfuscated or entirely novel (Zero-Day) injection attacks. Furthermore, modern architectures increasingly rely on NoSQL databases (e.g., MongoDB), introducing new attack vectors that legacy SQL-centric security models cannot process. There is a critical need for a dynamic, context-aware security layer that sits between the application and the database.

## 3. Primary Research Questions
To satisfy academic rigor, your thesis should aim to answer these core questions:
1. **Primary RQ:** How can a hybrid detection engine combining deterministic signature matching with unsupervised machine learning improve the identification of zero-day database injection attacks?
2. **Secondary RQ 1:** To what extent does tokenizing queries into Abstract Syntax Trees (AST) improve the accuracy of anomaly detection models compared to raw string analysis?
3. **Secondary RQ 2:** How can both SQL and NoSQL injection vulnerabilities be effectively detected within a single unified pipeline while maintaining a query analysis latency of less than 50ms?

## 4. Novelty & Originality (Your Unique Selling Points)
Universities look for what makes your project different from existing solutions. Your novelty points are:
*   **The Hybrid Pipeline:** Instead of relying solely on ML (which can be slow) or Regex (which is rigid), your system uses a two-step funnel: immediate regex elimination for known threats, followed by an unsupervised ML structural analysis for zero-day anomalies.
*   **Cross-Paradigm Support:** Securing both relational (SQL) and non-relational (MongoDB) databases in the same architecture.
*   **AST Tokenization:** Using NLP tokenizers (like `sqlparse`) to convert queries into Abstract Syntax Trees before feeding them to the ML model, analyzing the *intent* of the query rather than just its syntax.

## 5. Dataset and Training Strategy
Your methodology for training the AI model is a crucial part of the thesis defense. 

*   **Datasets Used:**
    *   **CSIC 2010 HTTP Dataset:** (Adapted for database query strings) to provide a foundation of known web-based attack patterns.
    *   **Synthetic Datasets:** Generated using automated penetration testing tools like **SQLmap** to create varied and obfuscated injection payloads.
*   **Training Strategy (Unsupervised Learning):**
    *   **Algorithm:** Isolation Forest (or similar anomaly detection algorithms via Scikit-Learn).
    *   **Phase 1: Baseline Establishment:** During a "learning phase," the system will record normal, safe application traffic to learn the standard baseline structure of queries for the specific application.
    *   **Phase 2: Feature Extraction:** Queries are not fed as raw text. They are sanitized and tokenized into ASTs. The structural deviations from the AST baseline act as the features for the ML model.
    *   **Phase 3: Anomaly Detection:** When a query's structure deviates significantly from the learned baseline (even if it doesn't match known regex signatures), the model flags it as an anomaly.

## 6. Literature Review Outline
For your thesis chapter, you will need to review existing research. Here is a guided outline of topics you must cover:
1.  **Evolution of Web Application Security:** From network firewalls to WAFs, and their limitations in understanding database context.
2.  **Deterministic vs. Probabilistic Detection:** A review of Rule-based (Regex) engines vs. Machine Learning models in cybersecurity.
3.  **The Shift to NoSQL:** How MongoDB and other NoSQL databases are vulnerable to JSON-based injections, and why SQL-based defenses fail here.
4.  **Anomaly Detection in Cybersecurity:** A review of unsupervised learning models (like Isolation Forests and One-Class SVMs) used for detecting zero-day threats.

## 7. Methodology & Architecture
*   **Decoupled Architecture:** Using a Node.js/Express proxy routing to a Python FastAPI microservice ensures the heavy ML lifting doesn't block the main application thread.
*   **Stateful Mitigation:** Beyond just stopping the query, the system implements IP reputation blocklisting to thwart persistent attackers at the edge.
*   **Telemetry:** Real-time analytics aggregated in MongoDB and visualized via React 18 / Recharts.

## 8. Expected Outcomes & Evaluation Metrics
How will you prove your project is successful?
*   **Accuracy:** Achieving a high True Positive (TP) rate for zero-day attacks with a near-zero False Positive (FP) rate to prevent blocking legitimate users.
*   **Performance Overhead:** Proving through benchmark testing that the query interception and analysis pipeline adds less than **50ms** of latency.
*   **Dashboard Efficacy:** Successfully visualizing attack vectors and system health in real-time.
