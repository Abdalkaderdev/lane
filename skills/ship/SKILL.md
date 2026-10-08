---
name: ship
description: Finish a change the way a careful engineer would. Use when the work is done and before saying so, when asked to write a PR body or PR description, before opening a pull request, or when handing back to the user. Audits the diff against the fence, adds a changelog entry for user-visible changes, and writes a PR body with exact verification commands and the parked list.
---

# Ship

"Done" means a reviewer can merge it without asking you a question.

## 1. Audit the diff

```
git status
git diff <base>...HEAD --stat
```

For each file, name the fence line it traces to. A file that traces to nothing
gets reverted or moved to its own branch. Look for leftovers: debug prints,
commented-out code, TODOs you added, stray files.

## 2. Changelog

If the repo has a `CHANGELOG.md`, add one line per user-visible change under
`## [Unreleased]`, in the Keep a Changelog section that fits: `Added`,
`Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.

```
### Fixed
- Expired refresh tokens are now rejected instead of silently renewed.
```

Write for the user of the software, not for the reviewer. Internal refactors,
test-only changes, and CI tweaks get no entry.

No `CHANGELOG.md`? Do not create one. Mention it once in the report.

## 3. Verification

List the commands you ran and what they printed, trimmed to the line that
matters. Anything you did not run is listed as not run.

```
npm test          -> 214 passed, 0 failed
npm run typecheck -> no errors
manual: POST /token with expired token -> 401
not run: e2e suite (needs staging credentials)
```

Never write "tests pass" without the command that showed it.

## 4. PR body

```
## What
<one or two sentences>

## Why
<the problem, link the issue if there is one>

## Changes
- <one line per commit or logical change>

## Verification
<the block from step 3>

## Out of scope
<the parked list from the fence, or "none">

## Risk
<what could break, how to roll back>
```

Do not open the PR unless the user asked. Give them the body.

## 5. Report back

Same shape, shorter: what changed, how it was verified, what was parked.
No summary of your process, no praise for the result.
