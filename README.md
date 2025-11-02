
# GitHub Repository Stars Crawler

**Artifact is stored in the top Action Instance, in a folder named stars-artifact-sql**

    - Go to your repo named Final 100k Repo
    - Find "Artifacts" section  at the bottom and download folder nammed stars-artifact-sql 
    - you will find Sql file named stars.sql with all 100k rows 

## 📋 Assignment Questions

### Q: What would you do differently for 500 million repositories?

**Architecture Changes:**
- **Distributed Crawling, Concurrency**: Deploy multiple crawler nodes
- **Message Queue**: Implement Kafka for job distribution and backpressure management
- **Database Scaling**:Scale Db to handle more concurrent crawlers.
-  **Multiple Tokens**: Use Multiple tokens with parrallel execution

### Q: How will the schema evolve for additional metadata?
Schema will hace more fields or tables depending on data. Example Schema for additional Data is below

**Core Schema Evolution:**
```sql
-- Main repository table
ALTER TABLE repositories ADD COLUMN

-- Issues table (1:M relationship)
CREATE TABLE issues (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT REFERENCES repositories(id),
    issue_number INTEGER NOT NULL,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    UNIQUE(repository_id, issue_number)
);

-- Pull Requests table
CREATE TABLE pull_requests (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT REFERENCES repositories(id),
    pr_number INTEGER NOT NULL,
    comment_count INTEGER DEFAULT 0,
    commit_count INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ,
    UNIQUE(repository_id, pr_number)
);

-- Comments (handles both issues and PRs)
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    parent_type VARCHAR(20), -- 'issue' or 'pull_request'
    parent_id BIGINT, -- references issues.id or pull_requests.id
    github_comment_id BIGINT UNIQUE,
    body TEXT,
    created_at TIMESTAMPTZ
);

-- CI Checks
CREATE TABLE ci_checks (
    id BIGSERIAL PRIMARY KEY,
    repository_id BIGINT REFERENCES repositories(id),
    check_suite_id BIGINT,
    status VARCHAR(50),
    completed_at TIMESTAMPTZ
);
```


