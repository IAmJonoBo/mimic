# Branch Protection Enforcement

This repository applies branch protection automatically using a dedicated
GitHub Actions workflow. The workflow keeps the default branch locked down with
consistent guardrails so every pull request goes through the same quality gates.

## Rules enforced

The configuration in `infra/branch-protection/main.json` is applied to the
`main` branch and enables the following policies:

- Require pull requests before merging, with two approving reviews and code
  owner sign-off.
- Block merges unless the branch is up to date with `main` and the required
  status checks have passed.
- Enforce successful runs for the following checks:
  - `PR Verification / Lint • Typecheck • Test • Build (affected)`
  - `Comprehensive Collision Prevention & Quality Gates / Module Boundary Enforcement`
- Prevent force pushes, branch deletion, and bypassing unresolved
  conversations.
- Require the last pusher to approve when they are not already an approver.
- Keep merge history linear while allowing forks to sync safely.

Update the JSON file when you need to change the policy. All modifications are
version-controlled so policy drift is easy to audit through pull requests.

## Required secrets

Applying branch protection requires repository administration privileges. Add a
personal access token (classic) with the `repo` scope (write access is
sufficient) as the `REPO_ADMIN_TOKEN` secret in the repository or organization.
Only owners and administrators should manage this credential.

Steps:

1. Create a short-lived token from <https://github.com/settings/tokens> with the
   `repo` scope.
2. Navigate to **Settings → Secrets and variables → Actions** in this repository
   and add a new secret named `REPO_ADMIN_TOKEN` with the token value.
3. Optionally store the token in a password manager and rotate it regularly.

The workflow fails fast with a clear error message if the secret is missing.

## Running the workflow

There are two ways to apply the rules:

- **Automatic** – any push to `main` that updates the workflow or configuration
  re-applies the policy.
- **Manual** – trigger the "Enforce Branch Protection" workflow with
  **Run workflow** in the GitHub Actions UI. This is useful directly after
  creating the secret or when auditing the current settings.

The workflow output prints the GitHub API response so you can verify the
current branch protection state. All calls are idempotent, making it safe to run
multiple times.
