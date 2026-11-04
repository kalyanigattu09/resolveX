# Resume Bullets and Interview Prep

All numbers below were measured and verified (see docs/PERFORMANCE_REPORT.md).

## Resume Bullets
- Built ResolveX, a multi-tenant complaint and service management platform (React, TypeScript, Node/Express, MongoDB) with customer, employee and admin roles enforced on the backend.
- Designed tenant isolation: tenant id derived only from the verified user, enforced in every query, with integration tests proving cross-tenant reads and writes return 404.
- Implemented JWT auth with rotating hashed refresh tokens in httpOnly cookies and reuse detection that revokes the session family.
- Modeled the complaint lifecycle as a state machine with atomic conditional updates (`findOneAndUpdate`) to prevent double assignment and invalid transitions under concurrency.
- Added SLA tracking with a scheduled job that escalates overdue complaints exactly once, plus real-time notifications over Socket.IO.
- Built admin analytics (MongoDB aggregation pipelines) and an immutable audit log.
- Added compound indexes and verified them with `explain()`; 250x fewer documents examined (99.60% reduction) and 94.1% latency reduction on paginated queues (5,000 seeded complaints).
- Load tested API: maintained sub-11ms p95 latency under normal load and sustained 312+ req/s peak throughput under concurrency with a 0.00% error rate.
- Wrote 147 backend integration tests (94.5% line coverage) and 10 frontend unit tests (157 total tests, 100% pass rate).

## Interview Questions & Answers
1. **How do you guarantee one tenant cannot see another's data?**
   Tenant ID is derived strictly from the verified JWT payload (`req.user.organizationId`) and injected into every database filter (`tenantFilter`). Route lookups return 404 (not 403) so cross-tenant callers cannot probe for resource existence. Verified by automated isolation test suites.
2. **Why short access tokens and rotating refresh tokens? What happens if a refresh token is stolen?**
   Short access tokens (15m) limit the window of an intercepted token. Refresh tokens are single-use and hashed in the database. If a revoked refresh token is presented again (indicating token theft), the entire token family is immediately revoked, forcing re-authentication.
3. **How do you stop two employees claiming the same complaint?**
   Atomic conditional updates (`findOneAndUpdate({ _id, organizationId, status: "OPEN", assignedTo: null }, { $set: { assignedTo, status: "ASSIGNED" } })`). If another worker claimed it first, the filter fails to match and returns null, triggering a clean 409 Conflict without race conditions.
4. **Why is escalation a flag and not a status?**
   A complaint can be `IN_PROGRESS` or `ASSIGNED` while concurrently breaching its SLA. Storing escalation as a flag (`isEscalated`) and an array of escalation history preserves the primary workflow state machine.
5. **What breaks if you run two API instances?**
   The in-process SLA cron job runs twice; however, because SLA escalation updates are atomic and check `isEscalated: false`, duplicate escalations are safely prevented. In high-scale deployments, this can be moved to an external worker queue (BullMQ / Redis).
6. **Why regex search and what would you change for production scale?**
   Regex search requires collection or index scans; in high-scale production, migrating to MongoDB Atlas Search (Lucene-backed index) or an Elasticsearch cluster provides inverted index lookups, fuzzy matching, and sub-millisecond full-text queries.
