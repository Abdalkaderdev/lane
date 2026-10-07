# lane

Scope discipline for coding agents: fence the task, park the drive-bys, ship small diffs a reviewer can approve.

[![CI](https://github.com/Abdalkaderdev/lane/actions/workflows/ci.yml/badge.svg)](https://github.com/Abdalkaderdev/lane/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## The problem

Ask an agent to fix one bug and you get the fix, plus reformatted imports, a
renamed helper, a bumped dependency, and a refactor of the file next door. Each
extra is defensible. Together they turn a five-minute review into an hour, and
the bug fix ships late or ships with something nobody read.

Other workflow plugins cover how to think (planning, TDD, debugging) or how
much code to write. `lane` covers what belongs in this change and how it
leaves your machine.

## Rules

| Skill | Enforces |
|---|---|
| `lane:fence` | State `Task / In / Out` before the first edit. Every hunk traces to `In`. Anything else goes on a `Parked` list instead of into the diff. Security issues are reported immediately, not parked. |
| `lane:slice` | One purpose per commit: refactor, behavior change, dependency, and formatting never share one. About 200 changed lines per commit, 400 per PR. Every commit builds and passes tests. Conventional Commit messages. |
| `lane:ship` | Before "done": audit the diff against the fence, add a Keep a Changelog line for user-visible changes, list the exact verification commands and their output, write a PR body that includes the parked list. |

A `SessionStart` hook restates the rules on startup, `/clear`, and after
compaction, so they survive long sessions.

## Before and after

Prompt: *"Fix: expired refresh tokens are still accepted."*

Without lane:

```
Fixed the token expiry check. While I was in there I also:
- migrated auth.ts to async/await
- renamed validateTok to validateToken across 14 files
- upgraded jsonwebtoken to 9.0.2
- fixed some lint warnings in session.ts
All tests should pass.

 17 files changed, 412 insertions(+), 298 deletions(-)
```

With lane:

```
Task: reject expired refresh tokens
In:   src/auth/refresh.ts, its tests
Out:  naming in auth/, jsonwebtoken version, lint in session.ts

fix(auth): reject expired refresh tokens
 2 files changed, 18 insertions(+), 3 deletions(-)

Changelog (Fixed): Expired refresh tokens are now rejected instead of silently renewed.

Verification:
npm test -- auth   -> 41 passed, 0 failed
npm run typecheck  -> no errors
not run: e2e suite (needs staging credentials)

Parked:
- package.json         jsonwebtoken 8.5.1 is two majors behind
- src/auth/session.ts  6 lint warnings (no-unused-vars)
- src/auth/*           validateTok vs validateToken naming is inconsistent
```

Same fix. One is reviewable.

## Install

### Claude Code (plugin marketplace)

```
/plugin marketplace add Abdalkaderdev/lane
/plugin install lane@lane
```

Or from your shell:

```
claude plugin marketplace add Abdalkaderdev/lane
claude plugin install lane@lane
```

### Claude Code (manual)

Load for one session without installing:

```
git clone https://github.com/Abdalkaderdev/lane
claude --plugin-dir ./lane
```

Or copy the skills into your personal skills directory. They then load as
`/fence`, `/slice`, `/ship`, without the session hook:

```
cp -r lane/skills/* ~/.claude/skills/
```

### Codex, Gemini CLI, Cursor, other agents

The skills follow the [Agent Skills](https://agentskills.io) format and use only
portable frontmatter (`name`, `description`). Copy the folders into the skills
directory your tool reads:

| Tool | Directory |
|---|---|
| Codex | `~/.agents/skills/` or `<repo>/.agents/skills/` |
| Gemini CLI | `~/.gemini/skills/` or `<repo>/.gemini/skills/` |
| Cursor | `~/.cursor/skills/` or `<repo>/.cursor/skills/` |

```
cp -r lane/skills/* ~/.agents/skills/
```

The session hook is Claude Code only. In other tools, add one line to your
`AGENTS.md` or rules file: `Use the fence, slice, and ship skills for every code change.`

Paths change between releases of those tools; check their docs if a skill does
not show up.

## Usage

Nothing to run. The skills trigger on their own when you ask for a code change,
commit, or finish a task. To invoke one directly:

```
/lane:fence   add rate limiting to the login endpoint
/lane:slice
/lane:ship
```

Turn it off for a session with `/plugin disable lane@lane`.

## Uninstall

```
/plugin uninstall lane@lane
/plugin marketplace remove lane
```

If you copied the skills manually, delete the `fence`, `slice`, and `ship`
folders from your skills directory.

## FAQ

**Does it conflict with superpowers or ponytail?**
No. superpowers shapes the process (brainstorm, plan, TDD, verify). ponytail
shapes how much code you write. lane shapes the boundary of the change and how
it is handed off. They stack.

**My task really is 900 lines.**
`slice` does not refuse. It splits by purpose, then by layer, and if it still
does not fit, proposes the split to you before writing more.

**What if there is no CHANGELOG.md?**
`ship` does not create one. It says so once in the report.

**Will it commit or open PRs on its own?**
No. It shapes commits you ask for and writes the PR body; it does not push or
open the PR unless you ask.

**Why is the parked list not saved to a file?**
It is short-lived and belongs to the conversation. Paste it into your tracker
if you want to keep it.

## Contributing

Issues and pull requests welcome. Keep changes small and follow the rules this
plugin enforces.

```
npm test                          # manifest and skill frontmatter checks
claude plugin validate --strict . # Claude Code's own validator
```

Add a line under `## [Unreleased]` in `CHANGELOG.md` for user-visible changes.

## License

[MIT](LICENSE)

## Author

abdalkaderdev: [abdalkader.dev](https://abdalkader.dev) · [GitHub](https://github.com/Abdalkaderdev)
