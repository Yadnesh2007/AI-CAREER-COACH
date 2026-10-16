# ⚡ CareerProof — AI Career Coach
> **"Every Skill Has Evidence"**
> An end-to-end, source-grounded employability and career intelligence system that compares authentic job requirements with verifiable code evidence in GitHub repositories, identifies honest evidence gaps, and automatically reassesses candidates upon real GitHub commits.

---

## 🌟 Core System Architecture

```
                       +---------------------------------------+
                       |      Candidate Web Interface          |
                       |  Next.js / React 18 + Tailwind CSS    |
                       |  21st.dev Dark Hybrid UI + Recharts   |
                       |         (http://localhost:3000)       |
                       +-------------------+-------------------+
                                           |
                              Live REST    | Real-Time Polling
                              & Webhook    | & Version Sync
                                           v
                       +---------------------------------------+
                       |          FastAPI API Gateway          |
                       |     Pydantic v2 + HMAC Webhook Ingress|
                       |         (http://localhost:8000)       |
                       +-------------------+-------------------+
                                           |
                                           v
         +---------------------------------+---------------------------------+
         |                                 |                                 |
         v                                 v                                 v
+------------------+             +-------------------+             +-------------------+
|  SQLite/Postgres |             | Static Code AST   |             | Durable Queue &   |
|  Relational DB   |             | & Lexer Engine    |             | Worker Processor  |
|  - Users         |             | - Python AST      |             | - Incremental     |
|  - Repositories  |             | - sqlglot Parser  |             |   Reassessment    |
|  - Jobs & Req    |             | - REST Route Insp |             | - Downgrades upon |
|  - Evidence/Verd |             | - Pytest Suites   |             |   code deletion   |
|  - Change Events |             | - Immutable SHAs  |             | - Webhook Dedupe  |
+------------------+             +-------------------+             +-------------------+
```

---

## 🚀 Quick Start (Running Both Services Locally)

### 1. Start the FastAPI Backend (Port 8000)
```bash
# Navigate to backend and activate virtualenv
cd backend
source venv/bin/activate

# Launch the FastAPI server with SQLite DB & auto-seeding
PYTHONPATH=. python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend health check: [http://localhost:8000/health](http://localhost:8000/health)
* Interactive OpenAPI Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Start the Frontend (Port 3000)
```bash
# Open a new terminal window, navigate to frontend and run
cd frontend
npm run dev
```
* Access the application in your browser: [http://localhost:3000](http://localhost:3000)

---

## 🎯 7 Innovation Concepts Implemented

1. **Commit-to-Career Impact Map (`/impact`)**: Real-time 4-stage pipeline visualizing `[HMAC Ingress] ➔ [Queue Worker] ➔ [AST Static Engine] ➔ [Immutable Version Promotion]`. Displays before/after skill verdict diffs with exact commit SHAs.
2. **Skill Proof Engine (`/passport`)**: Generates an auditable, exportable Skill Evidence Passport citing exact repositories, branch, commit SHAs, line numbers (`#L13-L24`), rule IDs, and observed behaviors across 4 proof depth dimensions (Implementation, Application, Tests, Docs).
3. **AI Project Generator & Gap Lab (`/gaplab`)**: Generates concrete, repo-specific engineering tasks targeting honest gaps (e.g. authoring relational queries with multi-table JOINs and parameterization) with interactive checklists.
4. **Code Defense Mode (`/defense`)**: Verbal technical interview defense module tied directly to verified code citations, prompting candidates to explain architectural choices, error handling (HTTP 400 vs 500), and injection defenses with AI feedback.
5. **Career Skill Dependency Map (`/skillmap`)**: Interactive hierarchical graph displaying prerequisite relations between foundational Python constructs and scalable database architectures.
6. **Honest AI & Evidence Freshness**: Transparent four-state verdict language:
   - `demonstrated`: verified implementation in reviewed scope
   - `partially_demonstrated`: single observation or missing test corroboration
   - `not_demonstrated_in_reviewed_scope`: honest absence without declaring candidate incompetence
   - `unable_to_assess`: intentionally inaccessible/unsupported cases
7. **Judge Proof Dossier (`/dossier`)**: Built-in 5-minute judge walkthrough with one-click live commit simulation, measuring round-trip commit-to-career updates in `< 1.5 seconds`.

---

## 🛠️ Verification of the Real Commit-to-Career Loop

1. Open [http://localhost:3000](http://localhost:3000). Notice that `sql_query_writing` is initially marked **Not Demonstrated in Reviewed Scope**.
2. Click **⚡ Push SQL Queries** (or click the button in the Navbar).
3. The backend executes `process_repo_push`, analyzes the newly added `database/queries.sql` via `sqlglot`, registers the verified JOIN and parameterization evidence, promotes `sql_query_writing` to **Demonstrated**, and updates the assessment to `v2.0`.
4. Click **Simulate Delete SQL (Downgrade)** to observe an honest downgrade when code evidence is removed!
