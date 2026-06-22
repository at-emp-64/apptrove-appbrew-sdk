# Releasing `@app-brew/apptrove-sdk`

This repo publishes `@app-brew/apptrove-sdk` to AppBrew's private npm registry (verdaccio, `https://npm.appbrew.tech/`) using two GitHub Actions workflows. The publish step authenticates with a single write token held only as the `VERDACCIO_NPM_TOKEN` GitHub Actions secret — it never appears in the repo or in anyone's laptop.

## The flow

```
┌───────────────────────────┐      ┌─────────────────────┐      ┌────────────────────┐
│ Run "Release (prepare PR)"│ ───▶ │ Review + squash-    │ ───▶ │ "Publish" workflow │
│ workflow (manual)         │      │ merge the release PR│      │ runs automatically │
└───────────────────────────┘      └─────────────────────┘      └────────────────────┘
         │                                  │                              │
         │                                  │                              ├─ publishes to verdaccio (write token)
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
   - Verifies the version isn't already published to the registry.
   - Publishes to verdaccio using the `VERDACCIO_NPM_TOKEN` write token.
   - Tags the merge commit as `@app-brew/apptrove-sdk@<version>` and pushes the tag.
   - Creates a GitHub Release (marked prerelease if the version has a `-suffix`).

## If you need to abandon a release PR

Close the PR without merging. The release branch (`release/apptrove-sdk-v<version>`) can be deleted. Re-run the **Release (prepare PR)** workflow to start over; the version on `main` is unchanged until merge.

## If the publish workflow fails

Open **Actions → Publish** and read the failure step.

- **Version mismatch** — someone edited `package.json` between bump and merge. Open a fix PR or re-run the release workflow with the correct version.
- **Version already published** — published versions are immutable. Re-run **Release (prepare PR)** with a higher bump.
- **`VERDACCIO_NPM_TOKEN` is not set / 401 / 403** — the write token secret is missing, expired, or not scoped to publish `@app-brew/apptrove-sdk`. An `app-brew/npm-admins` member must mint a write token (scoped to `@app-brew/apptrove-sdk`) and set it in the repo's `npm-publish` environment.
- **Tag step failed after publish succeeded** — the package is published but the tag isn't on the repo. Manually create the tag locally and push it: `git tag @app-brew/apptrove-sdk@<version> <merge-sha> && git push origin @app-brew/apptrove-sdk@<version>`.

## Why two workflows

We deliberately split *prepare* from *publish* so that:

- Version bumps are reviewed in a PR, not auto-applied.
- Publishing is gated on the human merge action — no one can publish without merging a PR.
- The `npm-publish` environment can require approval on publish runs as an extra safety net.
- Branch protection on `main` is honored without any bypass: release.yml only pushes to a release branch; publish.yml only pushes tags.

## Tokens

- **Read** (`.npmrc`, committed): a read-only verdaccio token that fetches `@gauntlet/*` and `@app-brew/*` tarballs for `pnpm install`. Read-only tokens cannot publish or mutate, so committing it is safe.
- **Write** (`VERDACCIO_NPM_TOKEN` secret, never committed): scoped to publish `@app-brew/apptrove-sdk`. Minted by an `app-brew/npm-admins` member and stored in the repo's `npm-publish` GitHub Actions environment. Only `publish.yml` reads it.

## What's intentionally not here

- **No write token in the repo.** Publishing uses the `VERDACCIO_NPM_TOKEN` secret, injected only into the publish job. The committed `.npmrc` token is read-only.
- **No manual `npm publish` from anyone's laptop.** After the bootstrap publish that creates the package, every subsequent version goes through the workflow so each release is tied to a reviewed, merged PR.
