# Nx Remote Cache Guidance

The workflows now hydrate the Nx cache directory and opt into Nx Cloud whenever an access token is
available. Keep the following in mind when enabling remote caching:

1. **Provision repository secret** – add a secret named `NX_CLOUD_ACCESS_TOKEN` under
   *Settings → Secrets and variables → Actions → Secrets*. GitHub Actions now exposes the secret to
   every workflow job, so Nx commands automatically discover the token. (Secrets remain encrypted and
   masked in logs—rotate them periodically.) The workflows run
   [`scripts/configure-nx-cloud.sh`](../../scripts/configure-nx-cloud.sh) right after dependency
   installation; when the secret is missing the helper automatically exports `NX_NO_CLOUD=true` so
   tasks skip remote calls instead of failing while downloading the Nx Cloud agent.
2. **Token scope** – generate a CI token from [Nx Cloud](https://cloud.nx.app/) with read/write cache
   permissions scoped to this workspace. No additional capabilities are required.
3. **Local usage** – export the token locally before running Nx commands to take advantage of the same
   cache: `export NX_CLOUD_ACCESS_TOKEN=<token>`. If you prefer, you can also store the token in a
   local `.env` file—GitHub workflows will continue to read from the repository secret.
4. **Cache behaviour** – the `actions/cache@v4` step restores `tmp/nx-cache` to stabilize results
   between reruns. Nx Cloud is only engaged once the environment variable is present, so the workflows
   still succeed when the variable is omitted (for forks, etc.). The workspace now vendors the
   `nx-cloud` package and declares the `nx-cloud` tasks runner in `nx.json`, which lets Nx reuse the
   cached agent binaries instead of attempting to download them on every run.
5. **Monitoring** – Nx Cloud’s run dashboard will list remote executions triggered via CI. Periodically
   review stale cache entries and revoke the token if automation credentials change.

## Nx Self-Healing CI

Self-healing is now wired into the GitHub pipelines. Nx Cloud handles issue detection and proposes
fixes when tasks fail.

1. **Prerequisites** – Self-healing requires Nx Cloud with the GitHub VCS integration enabled. Ensure the
   repository secret `NX_CLOUD_ACCESS_TOKEN` is populated (see steps above) and that the workspace has
   Self-Healing CI toggled on in Nx Cloud settings.
2. **Workflow hooks** – Each GitHub workflow calls `pnpm exec nx start-ci-run --no-distribution` after
   installing dependencies. The command is skipped automatically if the Nx Cloud token is not available
   (forked PRs continue to run normally).
3. **Fix scope** – We scope automated fixes to lint and format style tasks via
   `--fix-tasks="*lint*,*format*"`. Update the flag if you want Nx Cloud to tackle additional tasks or to
   exclude certain ones.
4. **Review loop** – When a failure occurs, Nx Cloud adds PR comments containing proposed patches. After
   the workflow finishes, `pnpm exec nx fix-ci` runs and uploads the fixes for later review. Apply or
   reject them via the Nx Cloud UI, PR comments, or locally using `pnpm exec nx fix-ci --apply`.
