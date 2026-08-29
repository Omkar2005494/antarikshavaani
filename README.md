# 🛰️ AntarikshaVaani (अन्तरिक्षवाणी)
> **Sovereign Multi-Agent AI Platform for ISRO Mission Intelligence & Space Data Analytics**  
> *Developed by Team Stackverse-labs • Dayananda Sagar University (DSU), Bangalore*  
> *Bhartiya Antriksh Hackathon 2026 • National Space Day Edition*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rate Limit: Active](https://img.shields.io/badge/Rate%20Limit-20%20req%2Fmin%20(DDoS%20Safe)-brightgreen.svg)](#-rate-limiting--anti-abuse-policy)
[![Legal: Fair Use](https://img.shields.io/badge/Legal-Academic%20Fair%20Use-blue.svg)](LEGAL_DISCLAIMER.md)
[![Hardware: Apple M2 Metal](https://img.shields.io/badge/Hardware-Apple%20M2%20GPU%20(Offline%20LLM)-purple.svg)](#-architecture)

---

## 🌌 Overview
**AntarikshaVaani** is a sovereign, 100% offline, bilingual (Hindi & English) AI mission intelligence platform that democratizes petabytes of raw ISRO planetary telemetry for researchers, students, and scientists.

---

## 🛡️ Rate Limiting & Anti-Abuse Policy
To prevent automated scraping, DDoS attacks, and corporate data harvesting, AntarikshaVaani enforces an in-memory sliding-window rate limiter:
* **Max Rate:** `20 requests/minute` per IP address.
* **Burst Limit:** `8 requests/10-second window` per IP.
* **HTTP Status Code:** `429 Too Many Requests` with automatic `Retry-After` countdown headers.
* **WebSocket Protection:** Real-time quota enforcement with graceful rate limit error frames.

---

## ⚖️ Legal & Open-Science Disclaimer
* AntarikshaVaani is an **independent academic research platform** and is **NOT an official government entity of ISRO or NASA**.
* All planetary science and space weather data are ingested from open-access scientific repositories (ISSDC PRADAN, NASA PDS4, SWOC, Space-Track.org) under **Academic Fair Use (Section 107 of Copyright Act / Section 52(1)(a) of Indian Copyright Act 1957)**.
* For full legal protections and liability waivers, see [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md).

---

## 👥 Team Stackverse-labs
* **Omkar Bhandari** — Team Leader & Core AI Lead (USN: ENG25CS1014)
* **Parth Italia** — Frontend & HUD Lead
* **Ansh Patel** — PDS4 Data Engineer
* **Preet Patel** — ML / RAG Systems Engineer
* **Heet Patel** — Aerospace Research & Presenter
