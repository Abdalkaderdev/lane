---
name: fence
description: Fence a coding task before the first edit and keep every change inside it. Use at the start of any feature, fix, or refactor request, and any time you notice a bug, smell, or cleanup outside the task. Out-of-scope findings go to a parked list instead of the diff.
---

# Fence

A reviewer can approve a diff that does one thing. They cannot approve a diff
that does the asked thing plus six things you noticed on the way.

## Before the first edit

Write the fence in your reply. Three lines, no more:

```
Task: <the request in one sentence>
In:   <files, modules, or behaviors this change may touch>
Out:  <nearby things you will be tempted to touch and will not>
```

If the request has two readings, take the narrower one and say so in one
line. Ask only when the narrow reading would produce the wrong result.

## While working

Every hunk must trace to a line under `In`. Before each edit, check.

When you notice something outside the fence, park it. Do not fix it.

```
Parked:
- src/billing/tax.ts:88  rounding uses float math; can drift on large invoices
- package.json           lodash 4.17.15 has a known prototype-pollution CVE
```

One line each: location, what, why it matters. No investigation beyond what
you already saw.

## Not allowed inside the fence unless asked

- Reformatting, re-indenting, or reordering imports on lines you did not change
- Renaming variables, functions, or files the task does not require
- Upgrading or adding dependencies
- "While I'm here" refactors
- Fixing unrelated lint warnings or type errors
- Adding tests for code the task did not change
- Rewriting comments or docs unrelated to the change

## Widening the fence

Widen only when the task cannot work without it. Say so before the edit:

```
Fence widened: In += src/http/retry.ts (the new endpoint needs the timeout option it lacks)
```

Stop and tell the user immediately, without fixing, if you find a security
hole, data loss risk, or leaked secret. Those do not wait for the end.

## At the end

Print the parked list, even if empty (`Parked: none`). The user decides what
becomes the next task.

## Rationalizations

| Thought | Reality |
|---|---|
| "It's a one-line fix, might as well." | One line in a file the reviewer did not expect to see. Park it. |
| "The formatter changed it, not me." | Revert the hunks on lines you did not edit. |
| "Leaving it is worse for the user." | The user sees it in the parked list and decides. |
| "I'll mention it in the PR." | Then it is reviewable as its own PR. Park it. |
| "The tests for this file are bad anyway." | Out of fence. Park it. |
