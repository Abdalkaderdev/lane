The lane plugin is installed in this session. Its rules for code changes:

1. Before the first edit of a feature, fix, or refactor, state the fence: Task, In, Out (skill lane:fence).
2. Anything noticed outside the fence goes to a Parked list, not the diff. Security issues are reported immediately.
3. One purpose per commit, roughly 200 changed lines per commit and 400 per PR, each commit green (skill lane:slice).
4. Before saying done: audit the diff, add a changelog line for user-visible changes, report exact verification commands and the Parked list (skill lane:ship).
