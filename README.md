# Mimic: Design-Token-Driven Pipeline

A fully open, design-token-driven pipeline using 100% libre tooling.

## Executive Summary

We will self-host Penpot v2 for design, export its W3C-compliant JSON tokens into Git, transform them with Style Dictionary, and compile one set of components for web, mobile/desktop, and desktop shell. Automated visual, unit, and interaction tests gate every pull request. Optional local LLMs (Llama 3 8B via Ollama) extend scaffolding without license cost. All moving parts are MIT, Apache-2.0, or AGPL—permitting on-premises deployment and zero SaaS spend.

## Project Objectives

1. **Single source of visual truth:** Design tokens mastered in Penpot and version-controlled.
2. **Write once, run everywhere:** The same primitives render on web, iOS, Android, desktop, and WebAssembly.
3. **No vendor lock-in:** Only FOSS licenses; everything can be air-gapped.
4. **Shift-left quality:** Visual/interaction tests break builds, not production.
5. **AI-assisted velocity:** Deterministic scaffolding that never violates the design system.

## Technical Stack

### Design & Token Authoring

| Element         | Tool             | Rationale                                                   |
| --------------- | ---------------- | ----------------------------------------------------------- |
| Design canvas   | Penpot v2        | Self-hosted, collaborative, AGPL, native design-token panel |
| Format spec     | W3C DTCG JSON    | Inter-tool standard for tokens                              |
| Token transform | Style Dictionary | Generates CSS, TS, Dart, Kotlin, etc.                       |

### Web Component Library

| Concern    | Tool            | Notes                         |
| ---------- | --------------- | ----------------------------- |
| Framework  | Qwik City 2     | <1 kB hydration, resumability |
| Styling    | vanilla-extract | Zero-runtime CSS, type-safe   |
| Docs/tests | Storybook 8.5   | Built-in axe checks           |

### Multi-Platform Runtimes

| Target                   | Framework                  | Token Injection                     |
| ------------------------ | -------------------------- | ----------------------------------- |
| Android/iOS/Desktop/Wasm | Compose Multiplatform 1.7  | Theme.kt auto-generated from tokens |
| Mobile JS reuse          | React Native 0.80 + Hermes | tokens.ts; IPO reduces APK size     |
| Desktop shell            | Tauri 2                    | Loads pre-built Qwik bundle         |

### Design → Code Bridge

- **Figmagic CLI:** Extracts tokens, SVG/PNG assets, and first-pass React components from Penpot files.
- **Ollama + Llama 3 8B:** Refines or extends generated JSX/Kotlin offline.

### Quality Gates

| Layer       | Tool                           | Function                        |
| ----------- | ------------------------------ | ------------------------------- |
| Interaction | Storybook test-runner          | Executes each story headless    |
| Visual diff | Loki (alt. BackstopJS)         | Pixel-perfect screenshots in CI |
| Unit        | Vitest (web) / JUnit (Compose) | Fast TS & JVM testing           |

### Monorepo & DevOps

- Nx 18 task graph, cached builds, generators
- Turborepo for Rust-backed build acceleration
- pnpm with dedupe to flatten duplicates
- VS Code Dev Containers with Docker Compose for Penpot, Postgres, and Ollama

## End-to-End Flow

1. Designers create/adjust frames in Penpot, tagging tokens.
2. CI job invokes `penpot-export` → `design-tokens.json`.
3. Style Dictionary emits `tokens.css`, `tokens.ts`, `Theme.kt`.
4. Nx affected graph rebuilds only impacted packages.
5. Storybook test-runner + Loki validate every PR; failures block merge.
6. Qwik artefacts deploy to CDN; Compose, RN, Tauri apps pull the same NPM package for tokens at build time.
7. Optional: `ollama run llm3 scaffold-screen <frameId>` auto-generates new components; outputs must pass Storybook tests.

## Roles & Responsibilities

| Team      | Key Tasks                                      |
| --------- | ---------------------------------------------- |
| Design    | Token governance, Penpot library maintenance   |
| Front-end | Qwik components, Storybook stories, web perf   |
| Mobile    | Compose & RN wrappers, native CI pipelines     |
| Platform  | Nx/Turborepo config, Docker dev-containers     |
| Dev Rel   | Docs site, public Storybook, community contrib |

## Quality Metrics

- Core Web Vitals: LCP < 2s on 3G, CLS < 0.1
- Binary size: Tauri ≤ 5 MB zipped; RN APK ≤ 30 MB
- Visual diff budget: 0 px delta acceptance; approved golden updates via PR
- Test coverage: ≥ 90% lines in shared libraries

## Risk & Mitigation

| Risk               | Mitigation                                  |
| ------------------ | ------------------------------------------- |
| Framework churn    | Lock semver ranges; monthly review          |
| Penpot API changes | Pin to stable Docker tag; integration tests |
| LLM hallucination  | Token constants enforce compile-time checks |
| Build time creep   | Nx remote cache + turborepo incremental     |

## Acceptance Criteria

- Single command `pnpm nx affected -t=build` recompiles only touched packages.
- Any token change propagates automatically to Qwik, RN, Compose builds.
- CI must fail if Storybook test-runner or Loki reports errors.
- Desktop app build (`cargo tauri build --release`) ≤ 5 MB zip.
- Developer onboarding < 30 minutes with Dev Container.

## Key Advantages

1. Licence-free: Penpot AGPL; all runtime code MIT/Apache.
2. Token-first: one JSON drives every renderer.
3. Performance: Qwik’s <1 kB hydration and Hermes IPO keep bundles lean.
4. Quality gates: Playwright, Loki, Vitest stop regressions pre-merge.
5. Local AI: Llama 3 improves velocity without sending IP to the cloud.

---

This brief gives each discipline a concrete, OSS-only tool-chain while leaving space for incremental enhancements—ensuring the organisation controls every byte from design ideation to shipped binary.
