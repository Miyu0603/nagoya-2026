# CLAUDE.md

@AGENTS.md

## Claude Code notes

- The shared engineering rules live in `@AGENTS.md` above (imported in full at session start).
- Stack-specific rules in `.claude/rules/` load automatically: unconditional ones at launch, path-scoped ones when you touch matching files.
- Keep this file thin. Edit shared rules in `AGENTS.md`, and per-stack rules in `.claude/rules/`.
