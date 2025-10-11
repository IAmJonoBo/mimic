# Mimic 2.0 Sprint Roadmap

Two-week sprints tailored for the Mimic 2.0 rewrite. Each sprint lists the focus, key outcomes,
deliverables, and entry/exit criteria. Use this roadmap with the detailed
[`docs/IMPLEMENTATION_PLAN_2.0.md`](./IMPLEMENTATION_PLAN_2.0.md) to track execution.

## Sprint 0 – Discovery & Alignment (Week 0)

**Focus**

- Finalise architecture decisions and prepare the workspace for execution.

**Prerequisites**

- Baseline Node 22.20.0 + pnpm 10.17.1 toolchain ready per
  [Foundational Dependencies](./IMPLEMENTATION_PLAN_2.0.md#foundational-dependencies).
- AI CLI approach (Ollama/OpenAI/Copilot) agreed so `mimic assist` planning aligns with licensing and
  offline expectations from the dependency matrix.

**Key Outcomes**

- Architecture blueprint endorsed (token orchestrator, UI kernel, repo layout).
- ADRs drafted for Rust CLI, Lit kernel, repository structure, Storybook 10 track, AI accessibility
  approach (Ollama/OpenAI/Copilot).
- Migration impact of Mimic 1.x consumers documented.
- Target SLOs and engineering metrics agreed (build time, drift MTTR, visual escape rate, documentation freshness).

**Entry Criteria**

- Vision statement approved.

**Exit Criteria**

- ADR PRs merged.
- `docs/MIGRATION_SUMMARY.md` captures current adopters and risks.
- Metrics charter published (SLO dashboard skeleton).

---

## Sprint 1 – Repository Foundations (Weeks 1–2)

**Focus**

- Create the workspace scaffolding and shared tooling for 2.0 development.

**Prerequisites**

- Node/pnpm baseline validated in Sprint 0 and cached in CI runners (see
  [Foundational Dependencies](./IMPLEMENTATION_PLAN_2.0.md#foundational-dependencies)).
- Nx plugin stack (`@nx/js`, `@nx/react`, `@nx/storybook`, `@nx/vite`) and `just` binary available for
  scaffolding tasks called out in the matrix.

**Key Outcomes**

- New directory layout (`apps/`, `packages/`, `infra/`, `toolchains/`) in place with CODEOWNERS + PR templates.
- Shared toolchain presets (tsconfig, ESLint flat config, Biome, Stylelint, Vitest) published.
- Devcontainer refreshed with Node 22.20, pnpm 10.17.1, Rust, Android/iOS SDKs, Playwright, Penpot
  stack, OpenAI & Copilot CLI tooling.
- SLO dashboards (stub) and telemetry hooks scaffolded.
- Contributor playbook (`CONTRIBUTING.md`, `DEVELOPMENT.md`) reflects new workflows and AI usage.

**Deliverables**

- `toolchains/` presets.
- `.devcontainer` thin wrapper pointing to `infra/containers/devcontainer`.
- `justfile` with core commands and AI helper aliases.
- CODEOWNERS + SLO/metrics documentation.

**Exit Criteria**

- CI running on upgraded Node/pnpm versions with baseline telemetry flowing.
- Covering documentation updated (setup, metrics, AI accessibility).

---

## Sprint 2 – Token Orchestrator Skeleton (Weeks 3–4)

**Focus**

- Build the first iteration of the Rust-based token orchestrator and schema contracts.

**Prerequisites**

- Rust stable toolchain with `wasm32-unknown-unknown` target installed (see
  [Foundational Dependencies](./IMPLEMENTATION_PLAN_2.0.md#foundational-dependencies)).
- Node/pnpm + Nx baseline from Sprint 1 remains green in CI for orchestrator bindings.

**Key Outcomes**

- `packages/token-orchestrator` CLI scaffolding (Rust + wasm bindings).
- Penpot DTCG ingest + JSON schema validation pipeline with error envelopes.
- `packages/tokens-core` canonical schema and history versioning structure.
- Structured logging + OpenTelemetry traces emitted for orchestrator operations.
- Initial ADR capturing orchestration rules and SLO impact.

**Exit Criteria**

- CLI can parse Penpot export and output normalised JSON to `packages/tokens-core/history`.
- Unit tests cover schema validation and rule enforcement.
- Observatory dashboard shows orchestrator latency/error metrics.

---

## Sprint 3 – Token Outputs & Automation (Weeks 5–6)

**Focus**

- Produce multi-platform token outputs and automate drift detection.

**Prerequisites**

- Storybook 9.1 + Loki runners provisioned as listed in the
  [Foundational Dependencies](./IMPLEMENTATION_PLAN_2.0.md#foundational-dependencies).
- Rust CLI toolchain from Sprint 2 available in CI to support orchestrator builds.

**Key Outcomes**

- Generated outputs (CSS, TS, JSON Schema, Compose, Swift, Kotlin, Flutter) written to
  `packages/tokens-outputs` (gitignored).
- `apps/workflows/token-sync` job exporting from Penpot, diffing, and creating PRs with AI summaries.
- GitHub Actions workflow for token validation + drift detection + security scanning.
- Token pipeline telemetry feeding Grafana/Loki dashboards.
- Documentation for consuming generated tokens and interpreting SLO dashboards.

**Exit Criteria**

- CI pipeline produces token outputs on demand.
- Drift detection opens annotated PR when Penpot snapshot changes, including AI-generated change notes.
- Security scans and telemetry reports are green.

---

## Sprint 4 – UI Kernel & Adapters MVP (Weeks 7–8)

**Focus**

- Establish the shared UI kernel and first wave of framework adapters.

**Prerequisites**

- Storybook + Nx plugin stack validated in Sprint 3 (see
  [Foundational Dependencies](./IMPLEMENTATION_PLAN_2.0.md#foundational-dependencies)).
- AI CLI baseline (`mimic assist` + `just` automations) configured so accessibility prompts work
  during Storybook reviews.

**Key Outcomes**

- `packages/ui-kernel` implemented with Lit + vanilla-extract theming and accessibility primitives.
- React adapter (`packages/ui-adapters/react`) wrapping kernel components.
- Storybook integration consuming kernel + tokens with automated docs tables and token intelligence addon.
- Contract tests (Storybook, Vitest DOM, Playwright) covering kernel behaviour, feeding flake analytics.
- AI remediation prompts available inside Storybook for accessibility and design checklist results.

**Exit Criteria**

- Storybook stories demonstrate new kernel components using generated tokens with token inspector addon active.
- Visual/a11y tests pass against the new kernel with results recorded in telemetry dashboards.

---

## Sprint 5 – Platform Integrations (Weeks 9–10)

**Focus**

- Wire the kernel into the reference applications and supply example integrations.

**Prerequisites**

- Node/pnpm and Nx plugin stack ready for multi-app builds (see
  [Foundational Dependencies](./IMPLEMENTATION_PLAN_2.0.md#foundational-dependencies)).
- Rust toolchain accessible for Compose/Tauri bridges referenced in the dependency matrix.

**Key Outcomes**

- Web app upgraded to Qwik City 2 using kernel + tokens with instrumentation hooks.
- React Native app using Expo Router + new tokens; Compose Multiplatform/Tauri shells bound to
  generated outputs and emitting OpenTelemetry data.
- Example integrations for Astro/Remix/Next in `examples/` with AI-assisted setup scripts.
- Compose/SwiftUI snapshot tests running in CI.

**Exit Criteria**

- All reference apps compile with the new kernel and tokens, with telemetry dashboards showing baseline UX metrics.
- Example projects documented, buildable, and include AI-assisted onboarding scripts.

---

## Sprint 6 – Docs, DX & AI Assistance (Weeks 11–12)

**Focus**

- Launch the new documentation experience and polish developer tooling.

**Prerequisites**

- Storybook + AI CLI stack healthy to power embedded docs previews and `mimic assist` flows (see
  [Foundational Dependencies](./IMPLEMENTATION_PLAN_2.0.md#foundational-dependencies)).
- `just` catalogue and Nx generators from earlier sprints stable for CLI doc captures.

**Key Outcomes**

- Starlight-based docs app with MDX, Storybook embeds, interactive API tables, and telemetry dashboards.
- Token governance, release process, migration guides authored with SLO references.
- `mimic assist` CLI documented with Ollama + OpenAI + Copilot flows and AI-powered command wrappers.
- CODEOWNERS, automation, and `just` task UX refined with AI hints.

**Exit Criteria**

- Docs site deployed (preview and local instructions) with AI-enhanced search and live Storybook embeds.
- CLI helper usable for scaffolding, Q&A, and AI-orchestrated workflows.

---

## Sprint 7 – Quality Gates & GA Readiness (Weeks 13–14)

**Focus**

- Harden CI/CD, run beta testing, and prepare GA release assets.

**Prerequisites**

- Full dependency matrix validated: Node/pnpm, Rust toolchain, Storybook runners, AI CLIs (see
  [Foundational Dependencies](./IMPLEMENTATION_PLAN_2.0.md#foundational-dependencies)).
- Follow-ups from the matrix (Rust in GitHub Actions, AI optionality on runners) tracked and nearing
  closure to unblock GA criteria.

**Key Outcomes**

- Enhanced CI matrix (a11y, Playwright journeys, Loki diffs, Compose/SwiftUI snapshots) with flake tracking and alerting.
- Beta programme feedback incorporated and success metrics reviewed against SLOs.
- Changesets-based release notes, migration toolkit, and communication plan ready (AI-generated summaries).
- Token analytics dashboard prototype and QA bot hooks (Slack/Matrix) operating on telemetry
  streams.

**Exit Criteria**

- CI green across the matrix for multiple consecutive runs within agreed SLO budget.
- GA announcement copy, migration guides, release artefacts staged, and analytics dashboard live.

---

## Cross-Sprint Backlog

- Storybook 10 addon parity tracking.
- Token analytics dashboard + QA notification bot.
- Penpot plugin enhancements (semantic naming, validation hints).
- CLI advanced commands (`design diff`, `story publish`, `repo doctor`) and AI assistant extensions.
- Security hardening backlog (Scorecard, Trivy, Cargo Audit follow-ups).
- 1.x migration codemods and API rename mapping.

Review and reprioritise these items at the end of each sprint.
