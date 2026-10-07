---
name: slice
description: Keep commits small and single-purpose. Use before every commit, when a diff passes about 200 changed lines, or when a plan mixes refactoring, behavior changes, dependency bumps, or formatting. Splits work into commits a reviewer can read in one sitting, each one green.
---

# Slice

Big diffs get skimmed. Skimmed diffs ship bugs.

## One purpose per commit

These never share a commit:

- Refactor (no behavior change)
- Behavior change (feature or fix)
- Dependency change
- Formatting or generated output
- Test-only change for existing behavior

When a change needs a refactor first, commit the refactor alone, tests green,
then the behavior change on top.

## Budget

Check before committing:

```
git diff --cached --stat
```

| Scope | Budget (changed lines, excluding lockfiles, snapshots, generated code) |
|---|---|
| Commit | ~200 |
| Pull request | ~400 |

Over budget: split by purpose first, then by layer (schema, then API, then UI).
If it still does not fit, stop and propose the split to the user before
writing more code. Do not commit an over-budget slice silently.

## Each commit is green

Run the project's build and tests before each commit. A commit that breaks
the build is not a slice, it is half of one.

If you could not run them, say which and why in your reply. Do not commit
"probably passing" code without saying so.

## Commit messages

Conventional Commits:

```
fix(auth): reject expired refresh tokens

Tokens past exp were accepted because the check compared seconds to
milliseconds. Normalize both to seconds.
```

- Subject: `type(scope): imperative summary`, 72 characters or fewer
- Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`
- Body: why, not what. Skip it when the subject says everything
- No trailers, tags, or footers the user did not ask for

## Never

- Amend or force-push commits that are already pushed, unless asked
- Squash unrelated work into one commit to "keep history clean"
- Stage with `git add -A` without reading `git status` first
