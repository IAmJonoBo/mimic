# Next Steps

## Tasks

- [x] Align runtime docs with Node 22.20.0 / pnpm 10.17.1 (Owner: Assistant, Due: EoD)
- [x] Audit repository for stale runtime references and update (Owner: Assistant, Due: EoD)
- [x] Verify setup automation (`pnpm setup:complete`, Husky) under Node 22.20 (Owner: Assistant, Due: EoD)
- [x] Harden Nx Cloud offline behavior across scripts (Owner: Assistant, Due: EoD)
- [x] Document dependency automation & autoremediation workflow (Owner: Assistant, Due: EoD)
- [x] Document foundational dependency matrix + CLI runtime requirements (Owner: Assistant, Due: This pass)
- [x] Add sprint prerequisites referencing dependency matrix (Owner: Assistant, Due: This pass)
- [x] Reduce Biome lint warnings in mobile/desktop/token utilities
  (Owner: Assistant, Completed: This pass)
- [ ] Restore Biome format:check baseline
  (Owner: Assistant, Due: Next pass)
- [x] Add rustup provisioning to GitHub Actions token workflows (`token-sync.yml`, `token-export.yml`)
  (Owner: Assistant, Completed: This pass)
- [ ] Evaluate AI CLI optionality for CI/self-hosted runners per dependency matrix
  (Owner: Assistant, Due: Follow-up)

## Steps

- [x] Decide on authoritative Node/pnpm versions (pending review of repo cues)
- [x] Run baseline quality suite (lint, format, typecheck, test, build, audit)
- [x] Update documentation and tooling to chosen versions
- [x] Re-run quality gates after modifications
  (lint base clean; format check still fails on legacy config diffs)
- [x] Attempted `pnpm nx run-many -t test --parallel=1` baseline; terminal crashed twice (see `ce3d21†L1-L3`)
  — follow-up needed once resources allow.
- [x] Re-attempted `nx run-many -t test --skip-nx-cache`; Jest ESM config and missing `@testing-library/jest-dom` types blocked
  completion (chunks `3415b2†L1-L33`, `8fb6a4†L1-L36`).
- [x] Ran `pnpm lint:md` after doc updates (see `5bff6d†L1-L2`).

## Deliverables

- [x] Updated README.md, DEVELOPMENT.md, and relevant docs reflecting unified versions
- [x] Adjusted setup tooling (.nvmrc/setup.sh) if needed
- [x] Proof of successful setup command and Husky hook execution
- [x] Dependency automation plan captured in docs/DEPENDENCY_AUTOMATION_PLAN.md
- [x] Updated CLI runner with dependency utilities and offline-safe commands

## Quality Gates

- Baseline lint (`nx run workspace-format:lint:base`): ✅
  `NX_CLOUD_DISABLED=1 pnpm exec nx run workspace-format:lint:base --output-style=stream --skip-nx-cache`
  (see `e03704†L1-L12`)
- Baseline lint (typed ESLint): ✅ `pnpm exec nx run workspace-format:lint --output-style=stream`
- Format check: ❌
  `NX_CLOUD_DISABLED=1 pnpm exec nx run workspace-format:format --configuration=check --output-style=stream --skip-nx-cache`
  (fails on pre-existing repository-wide formatting deltas; `4bc4b5†L1-L120`)
- Typecheck: ✅ `pnpm exec nx run-many -t typecheck --output-style=stream`
- Tests: ❌
  `NX_CLOUD_DISABLED=1 pnpm exec nx run-many -t test --output-style=stream --skip-nx-cache`
  (fails: React Native Jest ESM parsing and missing `@testing-library/jest-dom` types; see `3415b2†L1-L33` and `8fb6a4†L1-L36`)
- Build: ✅ `pnpm build`
- Security: ✅ `pnpm audit`
- Markdownlint: ✅ `pnpm lint:md` (`5bff6d†L1-L2`)
- Baseline tests (current attempt): ❌ `pnpm nx run-many -t test --parallel=1` — terminal crash (chunk `ce3d21†L1-L3`)

## Links

- Baseline lint: chunk `e03704†L1-L12`
- Baseline lint (typed): chunk `8edfc8†L1-L18`
- Format check: chunk `45396a†L1-L139`
- Typecheck: chunk `08b40d†L1-L9`
- Tests: chunk `de6ebc†L1-L17`
- Build: chunk `2806a8†L1-L48`
- Security scan: chunk `92a86c†L1-L2`
- Setup verification: chunk `2806a8†L1-L48`
- pnpm build (offline skip): chunk `2806a8†L24-L33`

## Risks / Notes

- Nx Cloud download attempts are suppressed via `neverConnectToCloud` and script-level `NX_NO_CLOUD`; Biome lint base now
  runs clean after addressing mobile/desktop/button demos, but repository-wide Biome format deltas still require a focused
  refactor effort.
- Rust toolchain provisioning now lands in `token-sync.yml` / `token-export.yml`; monitor first-run latency and layer caching
  if cold starts threaten the SLA.
- Desktop builds now skip when the Tauri CLI is missing; install the CLI to produce distributables locally or in CI.
- Large documentation surface may hide additional version mentions; continue auditing during follow-up passes.
- React Native Jest harness and design-token builds still fail (`3415b2†L1-L33`, `8fb6a4†L1-L36`); address ESM transformer
  config and install missing `@testing-library/jest-dom` types.
- AI CLI setup intentionally skipped on shared runners; evaluate self-hosted/offline strategy before Sprint 6.

