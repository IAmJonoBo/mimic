# Next Steps

## Tasks

- [ ] Sprint 0 – Discovery & Alignment (Architecture Guild) — Due: Week 0
  - Align on architecture blueprint, token orchestrator vision, and AI accessibility approach per implementation plan.
- [ ] Sprint 1 – Repository Foundations (Platform Enablement Squad) — Due: Weeks 1–2
  - Stand up workspace layout, toolchain presets, devcontainer, CODEOWNERS, and telemetry scaffolding.
- [ ] Sprint 2 – Token Orchestrator Skeleton (Token Pipeline Squad) — Due: Weeks 3–4
  - Deliver Rust CLI scaffolding, Penpot ingest, schema validation, and OpenTelemetry instrumentation.
- [ ] Sprint 3 – Token Outputs & Automation (Automation Squad) — Due: Weeks 5–6
  - Generate multi-platform token outputs, implement token-sync workflows, and wire telemetry dashboards.
- [ ] Sprint 4 – UI Kernel & Adapters MVP (Design System Squad) — Due: Weeks 7–8
  - Build Lit-based kernel, framework adapters, Storybook integration, and automated contract tests.
- [ ] Sprint 5 – Platform Integrations (Experience Squads) — Due: Weeks 9–10
  - Integrate kernel/tokens into web, native, and desktop apps plus reference examples and telemetry hooks.
- [ ] Sprint 6 – Docs, DX & AI Assistance (Developer Experience Squad) — Due: Weeks 11–12
  - Launch docs site, publish governance guides, and document AI-assisted tooling flows.
- [ ] Sprint 7 – Quality Gates & GA Readiness (Release Engineering Squad) — Due: Weeks 13–14
  - Harden CI matrix, finalize release notes, and stage GA communications.
- [ ] Cross-Sprint Backlog Grooming (Squad Leads Council) — Due: Ongoing each sprint review
  - Reprioritise Storybook 10 parity, analytics dashboards, Penpot plugin enhancements,
    CLI expansions, security hardening, and migration codemods.

## Steps

- [ ] Validate baseline automation commands (DevOps Guild — Week 0) to confirm `pnpm lint:workspace`,
  `pnpm nx run-many -t typecheck`, `pnpm nx run-many -t test`, `pnpm nx run design-system:visual-test`,
  `pnpm nx run design-system:test-storybook`, `pnpm build`, and `pnpm audit` all run cleanly in the
  container and CI. Document exit codes, coverage deltas, and remediation owners.
  - 2025-10-11: Initial audit attempt on Node 22.19.0 saw `pnpm format:check` and `pnpm lint:workspace`
    crash the terminal while Nx constructed the project graph after emitting engine mismatch warnings;
    rerun once the container runtime upgrades to Node 22.20.0 and capture full logs for the ledger.
  - 2025-10-12: Provisioned a pnpm wheelhouse via the devcontainer build (`/opt/pnpm-store`) and added
    Copilot onboarding instructions so automation can hydrate dependencies offline before rerunning the
    gates once the Node 22.20.0 image lands.
  - 2025-10-11: Re-tested `pnpm format:check`, `pnpm lint:workspace`, and `pnpm nx run-many -t typecheck`
    under `nvm use 22.20.0` (`NX_DAEMON=false`)—all abort as the Nx native binary initialises the project
    graph (exit code 134 / SIGABRT). Captured logs in `infra/troubleshooting/2025-10-11-nx-runtime-crash.md`
    for DevOps triage and flagged the need to validate Nx without the native binary.
- [ ] Review sprint entry/exit criteria with squad leads to confirm sequencing and readiness to begin
  each phase.
- [ ] Map deliverables to repository issues and link back in this ledger.
- [ ] Update status, owners, and due dates during each planning PR so this file remains authoritative.
- [ ] Coordinate container runtime upgrade to Node 22.20.0 (DevOps Guild — Week 0) to align with the
  repository engine requirement and unblock baseline automation verification.
- [ ] Ensure Copilot workspace instructions stay in sync with toolchain changes (DevOps Guild — Ongoing)
  so AI agents continue to run installs from the shared wheelhouse before executing gates.

## Deliverables

- [ ] Architecture blueprint, ADRs, and migration summary captured for Sprint 0.
- [ ] Workspace scaffolding (toolchains, devcontainer, CODEOWNERS, telemetry stubs) for Sprint 1.
- [ ] Token orchestrator CLI, schema history, and observability baselines for Sprint 2.
- [ ] Automated token outputs, drift detection workflows, and security scans for Sprint 3.
- [ ] UI kernel/adapters, Storybook demos, and visual/a11y test coverage for Sprint 4.
- [ ] Runtime integrations with telemetry instrumentation and example projects for Sprint 5.
- [ ] Docs platform, AI tooling guides, and governance materials for Sprint 6.
- [ ] Hardened CI matrix, release collateral, and analytics dashboards for Sprint 7.

## Quality Gates

- Formatting: `pnpm format:check` keeps Biome/Prettier alignment intact before linting.
- Linting: `pnpm lint:workspace` (Biome format+lint, typed ESLint overlay) must pass.
- Type Safety: `pnpm nx run-many -t typecheck` remains green across affected projects.
- Testing: `pnpm nx run-many -t test` and targeted suites (e.g., Storybook/Vitest) succeed.
- Visual Regression: `pnpm nx run design-system:visual-test` (Loki/Storybook) completes without diffs.
- Storybook Interaction: `pnpm nx run design-system:test-storybook` verifies stories and accessibility
  automation.
- Security: `pnpm audit` and scheduled security workflows report no blocking vulnerabilities.
- Build: `pnpm build` (and any sprint-specific Nx targets) completes successfully.

## Links

- [Implementation Plan 2.0](docs/IMPLEMENTATION_PLAN_2.0.md)
- [Sprint Roadmap](docs/SPRINT_PLAN.md)
- [CI Overview](docs/devops/ci-overview.md)
- [Development Guide](DEVELOPMENT.md)
- [Devcontainer Runtime & Wheelhouse](infra/containers/devcontainer/README.md)
- [Copilot Wheelhouse Instructions](.github/copilot-instructions.yml)
- [Nx Runtime Crash Log](infra/troubleshooting/2025-10-11-nx-runtime-crash.md)

## Risks / Notes

- Squad assignments assume current ownership; adjust as teams evolve and update here.
- Visual and Storybook test suites are known to require additional setup (React Native/Tauri)
  before gating can be fully enforced—track remediation as part of relevant sprints.
- Local container image currently pins Node 22.19.0, triggering engine mismatch warnings versus the
  required Node 22.20.0 baseline; coordinate with DevOps to bump the runtime and re-verify Nx targets.
- `pnpm nx run-many -t test` and workspace-level lint/format commands triggered shell crashes during
  baseline verification while Nx built the project graph on Node 22.19.0; capture logs under
  `infra/` troubleshooting and stabilise the command path once the runtime upgrade lands so gates can
  be relied on for enforcement. `NX_DAEMON=false` with Node 22.20.0 still aborts via the Nx native
  binary (exit code 134); investigate forcing the JS fallback or updating the binary in coordination
  with DevOps.
- Maintain the pnpm wheelhouse (`/opt/pnpm-store`) whenever the lockfile changes so offline installs
  and Copilot workflows remain valid; rebuild the devcontainer after dependency updates.
- Maintain this ledger in every planning PR to preserve alignment across squads and keep downstream templates accurate.
