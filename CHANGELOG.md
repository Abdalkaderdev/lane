# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed
- `ship` now loads when asked to write a PR body for finished work.

## [0.1.0] - 2026-10-08

### Added
- `fence` skill: state Task/In/Out before the first edit, park out-of-scope findings.
- `slice` skill: one purpose per commit, ~200-line commit and ~400-line PR budget, conventional commit messages.
- `ship` skill: diff audit, changelog entry, verification block, PR body with the parked list.
- SessionStart hook that restates the rules on startup, `/clear`, and compaction.
- Claude Code plugin and marketplace manifests.

[Unreleased]: https://github.com/Abdalkaderdev/lane/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Abdalkaderdev/lane/releases/tag/v0.1.0
