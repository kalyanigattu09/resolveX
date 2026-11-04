# Performance Report

All values recorded below were empirically measured and verified on the local testbed.

## Environment
- Host Machine: Windows 11 x64
- Node version: `v24.16.0`
- MongoDB: Local community server (port 27017)
- Dataset: `npm run seed` with `SEED_COMPLAINTS=5000` complaints (deterministic seed)

## 1. Query plans (`npm run explain`)
| Query | Indexed docs examined | Collection-scan docs examined | Indexed ms | Scan ms | Reduction Ratio |
|---|---|---|---|---|---|
| Admin list: status=IN_PROGRESS, newest first, page 1 | 20 | 5,000 | 1 ms | 17 ms | 250.0x (99.60%) |
| Customer list: customerId=<customer>, newest first | 20 | 5,000 | 1 ms | 13 ms | 250.0x (99.60%) |
| Employee list: assignedTo=<employee>, status=ASSIGNED | 20 | 474 | < 1 ms | 1 ms | 23.7x (95.78%) |

## 2. API load & concurrency test
| Scenario | VUs | Duration | p50 | p95 | p99 | Error rate | Req/s |
|---|---|---|---|---|---|---|---|
| List complaints (1 VU) | 1 | 0.98s | 4.51 ms | 6.59 ms | 14.76 ms | 0.00% | 203.5 req/s |
| List complaints (5 VUs) | 5 | 0.69s | 14.97 ms | 27.43 ms | 28.17 ms | 0.00% | 289.8 req/s |
| List complaints (10 VUs) | 10 | 0.74s | 31.14 ms | 67.01 ms | 72.30 ms | 0.00% | 268.9 req/s |
| List complaints (25 VUs) | 25 | 0.64s | 69.61 ms | 90.05 ms | 97.34 ms | 0.00% | 312.7 req/s |
| List complaints (50 VUs) | 50 | 0.81s | 175.01 ms | 280.06 ms | 283.81 ms | 0.00% | 246.1 req/s |

## 3. Atomic Concurrency & State Machine Integrity
- **Scenario**: 20 simultaneous concurrent claim requests against the same `OPEN` complaint.
- **Results**: 1 succeeded (`200 OK`), 19 rejected (`409 Conflict`).
- **Integrity**: 0 double assignments, 100% race condition prevention via atomic `findOneAndUpdate`.

## 4. Test coverage (`npm run test:coverage`)
- **Backend Line Coverage**: 94.52% (2,052 / 2,171 lines)
- **Backend Statement Coverage**: 92.90% (2,226 / 2,396 statements)
- **Backend Function Coverage**: 91.50% (345 / 377 functions)
- **Backend Branch Coverage**: 74.22% (524 / 706 branches)
- **Backend Integration Tests**: 147 passed / 147 total (12 test suites, 100% pass)
- **Frontend Unit Tests**: 10 passed / 10 total (2 test suites, 100% pass)
