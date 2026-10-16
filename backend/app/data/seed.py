import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.db_models import (
    User, GitHubInstallation, Repository, Job, JobRequirement, Evidence, Assessment, RequirementVerdict, AssessmentHistoryEntryModel, GapTask
)

INITIAL_PYTHON_CODE = """from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Candidate Portfolio Service", version="1.0.0")

class ProfileUpdateRequest(BaseModel):
    bio: str
    skills: List[str]

class UserProfile(BaseModel):
    id: str
    name: str
    skills: List[str]

@app.get("/api/v1/profile/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: str):
    \"\"\"Retrieve candidate profile with strict schema validation.\"\"\"
    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user_id")
    return UserProfile(id=user_id, name="Candidate Engineer", skills=["Python", "FastAPI"])

@app.post("/api/v1/profile/{user_id}/update")
async def update_user_profile(user_id: str, payload: ProfileUpdateRequest):
    \"\"\"Update candidate technical skills and profile attributes.\"\"\"
    return {"status": "success", "updated_skills": payload.skills}
"""

INITIAL_TEST_CODE = """import pytest
from app.main import app

def test_get_user_profile():
    # Verify basic response structure
    assert True, "Profile endpoint responds with valid schema"

def test_update_profile_validation():
    # Verify request payload validation
    assert True, "Pydantic validates skills list"
"""

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return
        
    user_id = "usr_dev_yadnesh_01"
    user = User(
        id=user_id,
        email="student@careerproof.ai",
        display_name="Yadnesh (Candidate Software Engineer)"
    )
    db.add(user)
    
    install = GitHubInstallation(
        id=1,
        user_id=user_id,
        account_login="Yadnesh2007",
        repository_selection="selected"
    )
    db.add(install)
    
    repo_id = "repo_sahayog_01"
    initial_sha = "e4b9c10a28f7"
    repo = Repository(
        id=repo_id,
        user_id=user_id,
        github_repo_id=98273612,
        full_name="Yadnesh2007/SAHAYOG",
        default_branch="main",
        selected_branch="main",
        latest_scanned_sha=initial_sha,
        installation_id=1,
        is_selected=True
    )
    db.add(repo)
    
    # Job
    job_id = "job_stripe_swe_01"
    job_url = "https://stripe.com/jobs/listings/backend-software-engineer-early-career-2026"
    job = Job(
        id=job_id,
        user_id=user_id,
        title="Backend Software Engineer (New Grad / Early Career)",
        employer="Stripe",
        source_url=job_url,
        fetched_at=datetime.utcnow().isoformat() + "Z",
        retrieval_status="verified"
    )
    db.add(job)
    
    # Requirements
    req_py = JobRequirement(
        id="req_py_01",
        job_id=job_id,
        skill_key="python",
        original_text="Proficiency in Python writing clean, maintainable, object-oriented, and asynchronous backend services.",
        source_url=job_url,
        importance="required",
        confirmed=True
    )
    req_sql = JobRequirement(
        id="req_sql_02",
        job_id=job_id,
        skill_key="sql_query_writing",
        original_text="Demonstrated experience authoring relational SQL queries including multi-table JOINs, aggregations, and safe parameterization.",
        source_url=job_url,
        importance="required",
        confirmed=True
    )
    req_rest = JobRequirement(
        id="req_rest_03",
        job_id=job_id,
        skill_key="rest_api",
        original_text="Hands-on experience developing RESTful HTTP APIs, request validation schemas, and service response contracts.",
        source_url=job_url,
        importance="required",
        confirmed=True
    )
    req_test = JobRequirement(
        id="req_test_04",
        job_id=job_id,
        skill_key="automated_testing",
        original_text="Ability to write automated unit and integration tests using frameworks like pytest or unittest.",
        source_url=job_url,
        importance="preferred",
        confirmed=True
    )
    db.add_all([req_py, req_sql, req_rest, req_test])
    
    # Evidence for Python and REST API
    ev1 = Evidence(
        id="ev_py_01",
        skill_key="python",
        repository_id=repo_id,
        repo_full_name="Yadnesh2007/SAHAYOG",
        commit_sha=initial_sha,
        file_path="app/main.py",
        start_line=13,
        end_line=24,
        permalink=f"https://github.com/Yadnesh2007/SAHAYOG/blob/{initial_sha}/app/main.py#L13-L24",
        snippet="async def get_user_profile(user_id: str):\n    if not user_id:\n        raise HTTPException(status_code=400, detail='Missing user_id')\n    return UserProfile(id=user_id, name='Candidate Engineer', skills=['Python', 'FastAPI'])",
        evidence_strength="implementation",
        observed_behavior="Defined asynchronous endpoint handler 'get_user_profile' with concrete conditional validation and structured model response",
        limitations=["Evaluates structural logic in reviewed scope; does not test runtime exception performance."],
        analyzer_rule_id="py_ast_function_def"
    )
    ev2 = Evidence(
        id="ev_py_02",
        skill_key="python",
        repository_id=repo_id,
        repo_full_name="Yadnesh2007/SAHAYOG",
        commit_sha=initial_sha,
        file_path="app/main.py",
        start_line=8,
        end_line=11,
        permalink=f"https://github.com/Yadnesh2007/SAHAYOG/blob/{initial_sha}/app/main.py#L8-L11",
        snippet="class UserProfile(BaseModel):\n    id: str\n    name: str\n    skills: List[str]",
        evidence_strength="implementation",
        observed_behavior="Defined Pydantic model 'UserProfile' implementing type-safe serialization",
        limitations=["Pydantic schema definition verified; does not test DB mapping."],
        analyzer_rule_id="py_ast_class_def"
    )
    ev3 = Evidence(
        id="ev_rest_01",
        skill_key="rest_api",
        repository_id=repo_id,
        repo_full_name="Yadnesh2007/SAHAYOG",
        commit_sha=initial_sha,
        file_path="app/main.py",
        start_line=13,
        end_line=20,
        permalink=f"https://github.com/Yadnesh2007/SAHAYOG/blob/{initial_sha}/app/main.py#L13-L20",
        snippet="@app.get('/api/v1/profile/{user_id}', response_model=UserProfile)\nasync def get_user_profile(user_id: str):",
        evidence_strength="implementation",
        observed_behavior="Defined HTTP GET route '/api/v1/profile/{user_id}' with typed response contract and HTTP 400 error handling",
        limitations=["Static route verified; does not measure API gateway TLS."],
        analyzer_rule_id="rest_route_endpoint_def"
    )
    ev4 = Evidence(
        id="ev_test_01",
        skill_key="automated_testing",
        repository_id=repo_id,
        repo_full_name="Yadnesh2007/SAHAYOG",
        commit_sha=initial_sha,
        file_path="tests/test_profile.py",
        start_line=4,
        end_line=7,
        permalink=f"https://github.com/Yadnesh2007/SAHAYOG/blob/{initial_sha}/tests/test_profile.py#L4-L7",
        snippet="def test_get_user_profile():\n    assert True, 'Profile endpoint responds with valid schema'",
        evidence_strength="test",
        observed_behavior="Authored test suite function 'test_get_user_profile' with assertion checks",
        limitations=["Static test inspected; does not verify live CI pipeline run."],
        analyzer_rule_id="test_suite_assertions_def"
    )
    db.add_all([ev1, ev2, ev3, ev4])
    
    # Initial Assessment (Version 1)
    assessment_id = "asmt_init_stripe_01"
    now_iso = datetime.utcnow().isoformat() + "Z"
    assessment = Assessment(
        id=assessment_id,
        user_id=user_id,
        version=1,
        job_id=job_id,
        repository_ids=[repo_id],
        state="completed",
        freshness="current",
        evaluated_at=now_iso,
        current_sha_by_repo={repo_id: initial_sha},
        reviewed_scope={
            "repos": ["Yadnesh2007/SAHAYOG"],
            "branches": ["main"],
            "excluded_paths": [".env*", "*.lock", "vendor/", "node_modules/"],
            "unsupported_paths": [],
            "incomplete": False
        },
        coverage={
            "demonstrated": 2,
            "total_assessable": 4,
            "formula": "2/4 requirements demonstrated by verified code evidence"
        },
        limitations=[
            "Verifiable static analysis strictly bounds claims to inspected files.",
            "Absence of evidence does NOT declare absence of student ability."
        ]
    )
    db.add(assessment)
    
    # Verdicts
    v_py = RequirementVerdict(
        id="verd_py_01",
        assessment_id=assessment_id,
        requirement_id="req_py_01",
        skill_key="python",
        status="demonstrated",
        exact_claim="Demonstrated Python backend service logic in reviewed codebase",
        rationale="Found 2 verified code implementations in app/main.py (async handlers, Pydantic schemas) at commit e4b9c10.",
        limitations=["Narrow evidence claim based strictly on static code analysis."],
        confidence="high",
        evidence_ids=["ev_py_01", "ev_py_02"],
        reviewed_scope="Repositories: Yadnesh2007/SAHAYOG (HEAD @ e4b9c10)"
    )
    v_rest = RequirementVerdict(
        id="verd_rest_03",
        assessment_id=assessment_id,
        requirement_id="req_rest_03",
        skill_key="rest_api",
        status="demonstrated",
        exact_claim="Demonstrated REST API development in reviewed codebase",
        rationale="Observed verified HTTP GET endpoint handler with response model contract in app/main.py.",
        limitations=["Static route verified; does not measure production API gateway."],
        confidence="high",
        evidence_ids=["ev_rest_01"],
        reviewed_scope="Repositories: Yadnesh2007/SAHAYOG (HEAD @ e4b9c10)"
    )
    v_test = RequirementVerdict(
        id="verd_test_04",
        assessment_id=assessment_id,
        requirement_id="req_test_04",
        skill_key="automated_testing",
        status="partially_demonstrated",
        exact_claim="Partially demonstrated automated testing (1 test observed)",
        rationale="Observed 1 test suite in tests/test_profile.py. Integration or multiple test assertions recommended.",
        limitations=["Single test observation qualifies as partial evidence."],
        confidence="medium",
        evidence_ids=["ev_test_01"],
        reviewed_scope="Repositories: Yadnesh2007/SAHAYOG (HEAD @ e4b9c10)"
    )
    v_sql = RequirementVerdict(
        id="verd_sql_02",
        assessment_id=assessment_id,
        requirement_id="req_sql_02",
        skill_key="sql_query_writing",
        status="not_demonstrated_in_reviewed_scope",
        exact_claim="Not demonstrated in reviewed scope (Yadnesh2007/SAHAYOG)",
        rationale="No relational SQL query operations or DML statements found in reviewed branch at commit e4b9c10.",
        limitations=[
            "Honest evidence caveat: Absence of code evidence in this repository does NOT mean the student lacks SQL ability; it means evidence has not been submitted or demonstrated in reviewed scope."
        ],
        confidence="high",
        evidence_ids=[],
        reviewed_scope="Repositories: Yadnesh2007/SAHAYOG (HEAD @ e4b9c10)"
    )
    db.add_all([v_py, v_rest, v_test, v_sql])
    
    # Gap Task
    gap_task = GapTask(
        id="gap_sql_01",
        assessment_id=assessment_id,
        requirement_id="req_sql_02",
        target_repository_id=repo_id,
        title="Author Relational Placement Tracker Queries with Parameterized JOINs",
        why_this_matters="The target Stripe role explicitly requires demonstrated multi-table JOINs and parameterized query authoring to handle relational financial/candidate transactions.",
        suggested_files=["database/queries.sql", "tests/test_queries.py"],
        steps=[
            "Create 'database/queries.sql' with a multi-table JOIN query matching candidates to job applications",
            "Implement parameterized filtering (:status, :min_evidence_threshold) and GROUP BY aggregations",
            "Commit and push to main branch to trigger automatic verification"
        ],
        expected_evidence=[
            "SQL SELECT statement with INNER JOIN and LEFT JOIN clauses",
            "GROUP BY and HAVING aggregated clauses",
            "Safe parameterization syntax (:param or %s)"
        ],
        validation_checklist=[
            "Syntax parses cleanly via sqlglot engine",
            "Commit SHA is linked immutably in GitHub citations",
            "Verdicts automatically update without manual refresh"
        ],
        status="suggested"
    )
    db.add(gap_task)
    
    # Initial Assessment History
    hist = AssessmentHistoryEntryModel(
        id="hist_v1_01",
        assessment_id=assessment_id,
        version=1,
        evaluated_at=now_iso,
        trigger_event_id=None,
        head_shas={repo_id: initial_sha},
        verdict_changes=[]
    )
    db.add(hist)
    
    db.commit()
