# Next Steps

## Tasks

- [x] Align runtime docs with Node 22.20.0 / pnpm 10.17.1 (Owner: Assistant, Due: EoD)
- [x] Audit repository for stale runtime references and update (Owner: Assistant, Due: EoD)
- [x] Verify setup automation (`pnpm setup:complete`, Husky) under Node 22.20 (Owner: Assistant, Due: EoD)
- [x] Harden Nx Cloud offline behavior across scripts (Owner: Assistant, Due: EoD)
- [x] Document dependency automation & autoremediation workflow (Owner: Assistant, Due: EoD)
- [x] Document foundational dependency matrix + CLI runtime requirements (Owner: Assistant, Due: This pass)
- [x] Add sprint prerequisites referencing dependency matrix (Owner: Assistant, Due: This pass)
- [ ] Reduce Biome lint warnings in mobile/desktop/token utilities
  (Owner: Assistant, Due: Next pass)
- [ ] Restore Biome format:check baseline
  (Owner: Assistant, Due: Next pass)
- [ ] Add rustup provisioning to GitHub Actions token workflows (`token-sync.yml`, `token-export.yml`)
  (Owner: Assistant, Due: Follow-up)
- [ ] Evaluate AI CLI optionality for CI/self-hosted runners per dependency matrix
  (Owner: Assistant, Due: Follow-up)

## Steps

- [x] Decide on authoritative Node/pnpm versions (pending review of repo cues)
- [x] Run baseline quality suite (lint, format, typecheck, test, build, audit)
- [x] Update documentation and tooling to chosen versions
- [ ] Re-run quality gates after modifications
  (lint:base warnings + format check failure tracked)
- [x] Attempted `pnpm nx run-many -t test --parallel=1` baseline; terminal crashed twice (see `ce3d21†L1-L3`)
  — follow-up needed once resources allow.
- [x] Ran `pnpm lint:md` after doc updates (see `5bff6d†L1-L2`).

## Deliverables

- [x] Updated README.md, DEVELOPMENT.md, and relevant docs reflecting unified versions
- [x] Adjusted setup tooling (.nvmrc/setup.sh) if needed
- [x] Proof of successful setup command and Husky hook execution
- [x] Dependency automation plan captured in docs/DEPENDENCY_AUTOMATION_PLAN.md
- [x] Updated CLI runner with dependency utilities and offline-safe commands

## Quality Gates

- Baseline lint (`nx run workspace-format:lint:base`): ⚠️ `pnpm exec nx run workspace-format:lint:base --output-style=stream`
  (pre-existing warnings)
- Baseline lint (typed ESLint): ✅ `pnpm exec nx run workspace-format:lint --output-style=stream`
- Format check: ❌ `pnpm exec nx run workspace-format:format --configuration=check --output-style=stream`
- Typecheck: ✅ `pnpm exec nx run-many -t typecheck --output-style=stream`
- Tests: ✅ `pnpm exec nx run-many -t test --output-style=stream`
- Build: ✅ `pnpm build`
- Security: ✅ `pnpm audit`
- Markdownlint: ✅ `pnpm lint:md` (`5bff6d†L1-L2`)
- Baseline tests (current attempt): ❌ `pnpm nx run-many -t test --parallel=1` — terminal crash (chunk `ce3d21†L1-L3`)

## Links

- Baseline lint: chunk `4fd500†L1-L115`
- Baseline lint (typed): chunk `8edfc8†L1-L18`
- Format check: chunk `45396a†L1-L139`
- Typecheck: chunk `08b40d†L1-L9`
- Tests: chunk `de6ebc†L1-L17`
- Build: chunk `2806a8†L1-L48`
- Security scan: chunk `92a86c†L1-L2`
- Setup verification: chunk `2806a8†L1-L48`
- pnpm build (offline skip): chunk `2806a8†L24-L33`

## Risks / Notes

- Nx Cloud download attempts are suppressed via `neverConnectToCloud` and script-level `NX_NO_CLOUD`, but Biome lint
  warnings and format check failures persist and require follow-up refactors.
- Desktop builds now skip when the Tauri CLI is missing; install the CLI to produce distributables locally or in CI.
- Large documentation surface may hide additional version mentions; continue auditing during follow-up passes.
- Rust toolchain provisioning missing from GitHub Actions; follow-up ticket required per dependency matrix.
- AI CLI setup intentionally skipped on shared runners; evaluate self-hosted/offline strategy before Sprint 6.

