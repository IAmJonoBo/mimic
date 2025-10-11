# Next Steps

## Tasks

- [x] Align runtime docs with Node 22.20.0 / pnpm 10.17.1 (Owner: Assistant, Due: EoD)
- [x] Audit repository for stale runtime references and update (Owner: Assistant, Due: EoD)
- [ ] Verify setup automation (`pnpm setup:complete`, Husky) under Node 22.20 (Owner: Assistant, Due: EoD)

## Steps

- [x] Decide on authoritative Node/pnpm versions (pending review of repo cues)
- [x] Run baseline quality suite (lint, format, typecheck, test, build, audit)
- [x] Update documentation and tooling to chosen versions
- [ ] Re-run quality gates after modifications

## Deliverables

- [x] Updated README.md, DEVELOPMENT.md, and relevant docs reflecting unified versions
- [x] Adjusted setup tooling (.nvmrc/setup.sh) if needed
- [ ] Proof of successful setup command and Husky hook execution

## Quality Gates

- Baseline lint (`nx run workspace-format:lint:base`): ✅ `pnpm exec nx run workspace-format:lint:base --output-style=stream`
- Baseline lint (typed ESLint): ✅ `pnpm exec nx run workspace-format:lint --output-style=stream`
- Format check: ✅ `pnpm exec nx run workspace-format:format --configuration=check --output-style=stream`
- Typecheck: ✅ `pnpm exec nx run-many -t typecheck --output-style=stream`
- Tests: ✅ `pnpm exec nx run-many -t test --output-style=stream`
- Build: ✅ `pnpm exec nx run-many -t build --output-style=stream`
- Security: ✅ `pnpm audit`

## Links

- Baseline lint: chunk `73e180†L1-L4`
- Baseline lint (typed): chunk `231bc4†L1-L12`
- Format check: chunk `71338e†L1-L12`
- Typecheck: chunk `601865†L1-L18`
- Tests: chunk `c552a0†L1-L11`
- Build: chunk `2e3834†L1-L11`
- Security scan: chunk `dea1ab†L1-L2`

## Risks / Notes

- Nx Cloud client download fails offline during `pnpm setup:complete`; capturing as current blocker.
- Workspace now on Node 22.20.0 with pnpm 10.17.1 activated; ensure scripts run in this context.
- Large documentation surface may hide additional version mentions; need thorough search.

