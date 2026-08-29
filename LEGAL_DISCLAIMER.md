# ⚖️ AntarikshaVaani — Legal Disclaimer, Fair Use & Rate Limiting Policy

**Project Name:** AntarikshaVaani (अन्तरिक्षवाणी)  
**Authors & Maintainers:** Team Stackverse-labs (Dayananda Sagar University, Bangalore)  
**Lead Developer:** Omkar Bhandari  
**License:** MIT Open Source License  
**Effective Date:** August 2026  

---

## 1. Non-Endorsement & Independence Disclaimer
AntarikshaVaani is an **independent, open-source educational and scientific research initiative** developed for the **Bhartiya Antriksh Hackathon / National Space Day 2026**. 
- AntarikshaVaani is **NOT** an official platform of the Indian Space Research Organisation (ISRO), the Department of Space (DoS), NASA, JAXA, or any government organization.
- Mention of ISRO, NASA, or specific missions (e.g., Chandrayaan-2/3, Aditya-L1, Gaganyaan) does **NOT** imply endorsement, partnership, or sponsorship by any government agency.

---

## 2. Fair-Use & Open Scientific Data Attribution
All planetary science, spectral curves, and solar weather data processed by this system are sourced from **publicly accessible open-data scientific repositories**:
1. **ISRO ISSDC PRADAN Portal:** [https://pradan.issdc.gov.in](https://pradan.issdc.gov.in) (Chandrayaan-2 IIRS & Chandrayaan-3 LIBS/ChaSTE calibrated open releases).
2. **ISRO Space Weather Operations Centre (SWOC):** Public solar flare and geomagnetic storm alerts.
3. **NASA Planetary Data System (PDS4):** Open spectral standards.
4. **Space-Track.org / ISTRAC:** Public Two-Line Element (TLE) orbital ephemeris.

### Legal Basis for Data Usage:
- **Indian Copyright Act, 1957 (Section 52(1)(a)):** Fair dealing for private and personal use, including research, education, and review of scientific works.
- **US Copyright Act (17 U.S. Code § 107):** Fair use for non-profit educational and scientific research purposes.

---

## 3. Rate Limiting & Anti-Abuse Terms (Enforced in Code)
To maintain server availability, prevent Denial of Service (DDoS), and prevent unauthorized automated data harvesting, the following technical rate limits are **strictly enforced**:
- **REST API Limit:** Max **20 requests per minute** per client IP address.
- **Burst Limit:** Max **8 requests per 10-second window** per client IP address.
- **WebSocket Throttling:** Max **30 queries per minute** with connection pooling.
- **Response upon Violation:** HTTP `429 Too Many Requests` with a dynamic `Retry-After` header.

**Prohibited Actions:**
- Scraping, automated bot querying, or reverse-engineering rate limit tokens.
- Commercial resale, sublicensing, or packaging of this free public service into paid commercial products without explicit written attribution.

---

## 4. "AS-IS" Warranty Waiver & Limitation of Liability
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
