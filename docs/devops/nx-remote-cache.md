# Nx Remote Cache Guidance

The workflows now hydrate the Nx cache directory and opt into Nx Cloud whenever an access token is
available. Keep the following in mind when enabling remote caching:

1. **Provision repository variable** – add a repository variable named `NX_CLOUD_ACCESS_TOKEN` under
   *Settings → Actions → Variables*. The GitHub CLI step in each workflow copies the value into
   `NX_CLOUD_ACCESS_TOKEN` for downstream Nx commands. (Tokens stored as variables are visible to
   maintainers; rotate them periodically.)
2. **Token scope** – generate a CI token from [Nx Cloud](https://cloud.nx.app/) with read/write cache
   permissions scoped to this workspace. No additional capabilities are required.
3. **Local usage** – export the token locally before running Nx commands to take advantage of the same
   cache: `export NX_CLOUD_ACCESS_TOKEN=<token>`.
4. **Cache behaviour** – the `actions/cache@v4` step restores `tmp/nx-cache` to stabilize results
   between reruns. Nx Cloud is only engaged once the environment variable is present, so the workflows
   still succeed when the variable is omitted (for forks, etc.).
5. **Monitoring** – Nx Cloud’s run dashboard will list remote executions triggered via CI. Periodically
   review stale cache entries and revoke the token if automation credentials change.
