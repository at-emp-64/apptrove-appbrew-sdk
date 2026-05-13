# Releasing `@app-brew/apptrove-sdk`

This repo publishes `@app-brew/apptrove-sdk` to npm using two GitHub Actions workflows. There are no long-lived npm tokens anywhere — authentication uses npm Trusted Publishers via GitHub Actions OIDC.

## The flow

```
┌───────────────────────────┐      ┌─────────────────────┐      ┌────────────────────┐
│ Run "Release (prepare PR)"│ ───▶ │ Review + squash-    │ ───▶ │ "Publish" workflow │
│ workflow (manual)         │      │ merge the release PR│      │ runs automatically │
└───────────────────────────┘      └─────────────────────┘      └────────────────────┘
         │                                  │                              │
         │                                  │                              ├─ publishes to npm via OIDC
         │                                  │                              ├─ tags merge commit
         ▼                                  ▼                              └─ creates GitHub Release
   bumps version on a              merging produces a commit on
   release/* branch and            main titled
   opens a PR titled               `release(apptrove-sdk): v<version>`
   `release(apptrove-sdk):
   v<version>`
```

## Cutting a release

1. Go to **Actions → Release (prepare PR) → Run workflow**.
2. Choose the bump type:
   - `patch` / `minor` / `major` — standard semver bump.
   - `prerelease` — bumps the prerelease counter (e.g. `1.0.0-beta.0` → `1.0.0-beta.1`). Optionally set the `prerelease_id` input to switch identifiers (`beta`, `rc`, …).
3. The workflow opens a PR titled `release(apptrove-sdk): v<version>`.
4. Review the diff (it should be only the version bump in `packages/apptrove-sdk/package.json`).
5. **Squash-merge** the PR. The merge commit title must remain `release(apptrove-sdk): v<version>` — that's the contract the publish workflow keys off.
6. The **Publish** workflow auto-runs on the merge commit:
   - Verifies `package.json` version matches the commit title.
   - Verifies the version isn't already on npm.
   - Publishes via OIDC.
   - Tags the merge commit as `@app-brew/apptrove-sdk@<version>` and pushes the tag.
   - Creates a GitHub Release (marked prerelease if the version has a `-suffix`).

## If you need to abandon a release PR

Close the PR without merging. The release branch (`release/apptrove-sdk-v<version>`) can be deleted. Re-run the **Release (prepare PR)** workflow to start over; the version on `main` is unchanged until merge.

## If the publish workflow fails

Open **Actions → Publish** and read the failure step.

- **Version mismatch** — someone edited `package.json` between bump and merge. Open a fix PR or re-run the release workflow with the correct version.
- **Version already published** — the version on npm is immutable. Re-run **Release (prepare PR)** with a higher bump.
- **OIDC / Trusted Publisher errors** — the npm Trusted Publisher config on npmjs.com has drifted from this repo/workflow/environment. Coordinate with the AppBrew team (npm scope owner).
- **Tag step failed after publish succeeded** — the package is on npm but the tag isn't on the repo. Manually create the tag locally and push it: `git tag @app-brew/apptrove-sdk@<version> <merge-sha> && git push origin @app-brew/apptrove-sdk@<version>`.

## Why two workflows

We deliberately split *prepare* from *publish* so that:

- Version bumps are reviewed in a PR, not auto-applied.
- Publishing is gated on the human merge action — no one can publish without merging a PR.
- The `npm-publish` environment can require approval on publish runs as an extra safety net.
- Branch protection on `main` is honored without any bypass: release.yml only pushes to a release branch; publish.yml only pushes tags.

## What's intentionally not here

- **No `NPM_TOKEN` secret.** Authentication is done by npm's Trusted Publisher feature exchanging the workflow's OIDC token for a short-lived publish credential. The AppBrew team owns the npm scope and configures the Trusted Publisher binding on npmjs.com.
- **No manual `npm publish` from anyone's laptop.** After the bootstrap publish that creates the package, every subsequent version must go through the workflow so the npm provenance attestation links it back to this exact repo + commit.
