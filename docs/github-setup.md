# GitHub repo setup

Configuration that can't live in the repo (branch protection, repo
settings, Dependabot toggles) is captured here as manual checklists. Run
these once after the repo is created and again whenever the toggles drift.

## Branch protection for `main` (recommended pre-launch)

Settings → Branches → Add branch protection rule for `main`:

- [ ] Require pull request before merging: **ON**
- [ ] Require approvals: **1** (or **0** for solo dev)
- [ ] Dismiss stale approvals: **OFF** (annoying for solo dev)
- [ ] Require review from Code Owners: **OFF** until teams exist
- [ ] Require status checks: **ON**
      Required: `build`, `audit`, `secret-scan`
- [ ] Require branches up to date: **ON**
- [ ] Require conversation resolution: **ON**
- [ ] Allow force pushes: **OFF**
- [ ] Allow deletions: **OFF**
- [ ] Restrict who can push to matching branches: **OFF** (solo dev)

When the `kiris-lab` org and teams exist, flip "Require review from Code
Owners" back to ON and run the search-and-replace in `CODEOWNERS`
described at the top of that file.

## Repository settings (Settings → General)

- [ ] Allow squash merging: **ON** (preferred default)
- [ ] Allow merge commits: **OFF**
- [ ] Allow rebase merging: **OFF**
- [ ] Automatically delete head branches: **ON**
- [ ] Always suggest updating pull request branches: **ON**

## Dependabot settings (Settings → Code security)

- [ ] Dependabot alerts: **ON**
- [ ] Dependabot security updates: **ON**
- [ ] Dependabot version updates: **ON** (uses `.github/dependabot.yml`)
- [ ] Grouped security updates: **ON**

## Required repo secrets

None required for the current workflows. If the repo ever moves to a
GitHub organization, `gitleaks-action@v2` will require a paid license —
either set `GITLEAKS_LICENSE` in repo secrets or swap to a free
alternative (e.g. TruffleHog) at that time.

## Auto-merge prerequisites

`.github/workflows/dependabot-auto-merge.yml` calls `gh pr merge --auto`.
That requires:

- Settings → General → "Allow auto-merge": **ON**
- A required status check (e.g. `build`) configured under branch
  protection. Without one, auto-merge has nothing to wait on and will
  merge immediately.
