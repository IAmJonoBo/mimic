# Nx native binary crash while building project graph

## Summary

- `pnpm format:check` and `pnpm lint:workspace` crash with exit code 134 when Nx initialises the workspace graph.
- Failure reproduces after aligning to Node.js 22.20.0 and pnpm 10.17.1 using `nvm` within the current devcontainer.
- Captured terminal transcripts show `fatal runtime error: failed to initiate panic, error 5`
  emitted by the Nx native binary before aborting.

## Environment

- Node.js: 22.20.0 (via `nvm install 22.20.0`)
- pnpm: 10.17.1 (`corepack prepare pnpm@10.17.1 --activate`)
- OS image: `mcr.microsoft.com/devcontainers/base:bookworm`
- Nx CLI: workspace pinned version (see `package.json`)
- Cache: shared pnpm wheelhouse at `/opt/pnpm-store` hydrated via `pnpm fetch`

## Reproduction steps

```bash
# inside devcontainer shell
nvm install 22.20.0
nvm use 22.20.0
corepack enable
corepack prepare pnpm@10.17.1 --activate
pnpm install --frozen-lockfile
NX_DAEMON=false pnpm format:check
```

## Observed output

```
> mimic@0.1.1 format:check /workspace/mimic
> nx run workspace-format:format --configuration=check
fatal runtime error: failed to initiate panic, error 5
Aborted
 ELIFECYCLE  Command failed with exit code 134.
```

`pnpm lint:workspace` exhibits the same failure while Nx is constructing the project graph for `workspace-format:lint:base`.

## Next actions

- [ ] Investigate Nx native binary compatibility with the Debian Bookworm base image and Node.js 22.20.0.
- [ ] Try forcing the JavaScript implementation by setting `NX_SKIP_NX_CACHE=true` and
      `NX_NATIVE_LOGGING=false`, or pinning Nx to a patched release if available.
- [ ] Escalate to the DevOps Guild once repro steps and logs are attached to a tracking issue.
