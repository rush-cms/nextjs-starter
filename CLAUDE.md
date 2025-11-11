# CODE GUIDELINES

## MANDATORY CODING STANDARDS - NEVER VIOLATE THESE:
1. **ALWAYS** use single quotes (') never double quotes
2. **ALWAYS** write everything in **ENGLISH**
3. **NEVER** add semicolons at the end of lines
4. **ALL** files must be kebab-case (`tech-detector.tsx`, not `TechDetector.tsx`)
5. **NO** inline comments, comments must be on their own line
6. In `ts` and `tsx` files **ALWAYS** use tab for indentation with size 4 (tab size = 4)
7. **NO** trailing commas in objects/arrays
8. Tailwind classes **ONLY**, no custom CSS unless absolutely necessary
9. **STRICT TYPE!** I want a strong typing code
10. **NEVER** create solo .md files in root, use only  `./.claude` or  `./docs folder`
11. **MODERN** approach, bring insights if you feel necessary
12. Check package.json ßto see current packages versions

### Examples
```typescript
// ✅ CORRECT
const message = 'Hello World'
const config = {
	name: 'TechRadar',
	version: '1.0.0'
}

// ❌ WRONG
const message = "Hello World";  // Never use double quotes or semicolons
const config = {
    name: "TechRadar",  // Wrong: spaces instead of tabs
    version: "1.0.0", // No trailing comma
};
```

# PROJECT MANAGEMENT

## Organization Structure
Use `.claude/` directory (gitignored):

```
.claude/
├── current-sprint.md    # Active sprint only
├── backlog.md           # Future tasks and ideas
├── completed/           # Archived sprints by date (YYYY-MM-DD.md)
├── notes.md             # Quick thoughts, blockers, ideas
├── context.md           # State between sessions
└── decisions.md         # Architectural decisions
```

## Sprint Management

### Rules
- Work in `current-sprint.md` for active tasks
- Move completed sprints to `completed/YYYY-MM-DD.md`
- Use checkboxes `[ ]` for task tracking
- Record estimated vs actual time
- Future ideas go in `backlog.md`

### Sprint Format
```markdown
## Sprint #3 - Feature Name

**Started**: 2025-01-15 09:00
**Estimated**: 4 hours
**Status**: IN_PROGRESS / COMPLETED
**Priority**: High / Medium / Low

### Tasks
- [x] Task description [P1]
- [ ] Another task [P2]

### Dependencies
- Task B depends on: Task A

**Ended**: 2025-01-15 14:30
**Actual**: 5.5 hours

### Sprint Metrics
- **Velocity**: 2/4 tasks (50%)
- **Time Accuracy**: 5.5h / 4h = 137%
- **Blockers**: 0

**Notes**: Any important learnings
```

### Priority Levels
- **[P1]** Critical - Must complete this sprint
- **[P2]** High - Should complete this sprint
- **[P3]** Medium - Nice to have
- **[P4]** Low - Can move to backlog

---

## Git Workflow

### Branch Strategy
- `main` - Production-ready (protected)
- `develop` - Integration branch (if using GitFlow)
- `feature/*` - New features (`feature/user-dashboard`)
- `bugfix/*` - Non-critical fixes (`bugfix/login-timeout`)
- `hotfix/*` - Emergency fixes (`hotfix/security-patch`)

### Commit Message Convention
Follow the type(scope): description [Sprint#X-TaskY]

**Types**
- feat     - New feature
- fix      - Bug fix
- refactor - Code refactoring
- test     - Tests
- docs     - Documentation
- style    - Formatting
- perf     - Performance
- chore    - Dependencies, build

**Examples**
- feat(auth): implement 2FA [Sprint#5-Task2]
- fix(dashboard): resolve chart rendering [Sprint#5-Task7]
- perf(queries): add eager loading [Sprint#5-Task8]

### Sprint + Git Integration
```markdown
## Sprint #5 - Feature Name

**Branch**: feature/user-authentication

### Tasks
- [x] Task 1 [P1]
- Commit: `abc123f` - feat(auth): add migrations
- [x] Task 2 [P1]
- Commits: `def456a`, `ghi789b`
```

### Best Practices
- Commit frequently (small, focused commits)
- Write descriptive messages
- Reference sprint/task numbers
- Push regularly
- Never commit secrets

---

## Definition of Done

Task complete when ALL checked:

### Code Quality
- [ ] Follows `code-guidelines.blade.php`
- [ ] TypeScript: No `any` types
- [ ] PHP: Type hints on all methods
- [ ] No commented-out code
- [ ] No debug statements (`console.log`, `dd()`, `var_dump()`)
- [ ] Code formatted: `vendor/bin/pint --dirty`

### Functionality
- [ ] Works as specified
- [ ] Edge cases handled
- [ ] User-friendly error messages
- [ ] Loading states implemented
- [ ] Responsive design

### Testing
- [ ] Tests written and passing: `php artisan test`
- [ ] Unit tests for business logic
- [ ] Feature tests for endpoints/pages
- [ ] Tests actually test the feature
- [ ] Browser tested manually (no console errors)

### Performance
- [ ] No N+1 queries (Telescope: `/admin/telescope/queries`)
- [ ] Queries optimized with eager loading
- [ ] Indexes on foreign keys and frequent queries
- [ ] Expensive operations cached
- [ ] Page load < 2s

### Security
- [ ] Input validated (frontend + backend)
- [ ] Authorization checks (policies/gates)
- [ ] No sensitive data in logs
- [ ] CSRF protection on forms
- [ ] SQL injection safe (use Eloquent)

### Documentation
- [ ] Complex logic has PHPDoc
- [ ] Sprint file updated
- [ ] Architectural decisions recorded (if applicable)

### Git
- [ ] Changes committed with descriptive message
- [ ] Commit hash recorded in sprint file
- [ ] Branch pushed to remote
- [ ] No merge conflicts

---

## Context Management

### Before Clearing Context
**ALWAYS update these files**:

1. **`.claude/current-sprint.md`**
- Mark completed tasks `[x]`
- Add new tasks discovered
- Update time spent

2. **`.claude/context.md`**
```markdown
## Last Updated: [timestamp]

## Current State
- Working on: [specific feature/file]
- Last completed: [what finished]
- Next task: [where to continue]
- Current file: [path/to/file.tsx]

## Important Context
- [Decisions made]
- [Blockers encountered]
- [Dependencies to remember]

## Code in Progress
- [Exact function/component being edited]
- [Uncommitted logic or approach]
```

3. **Save work state**
- Ensure all files saved
- Note uncommitted changes in context.md

### After Clearing Context
Start new session with: "Follow session start protocol and continue development"

---

## File Templates

### `notes.md`
```markdown
## Blockers
- [ ] [2025-01-15] Database issue - Status: Investigating

## Decisions Pending
- [ ] [2025-01-15] Choose Redis vs Memcached
- [ ] [2025-01-16] API versioning strategy

## Ideas for Future
- [2025-01-15] Real-time notifications
- [2025-01-16] Bulk operations for users

## Technical Debt
- Refactor auth middleware
- Optimize Reports module queries
```

### `decisions.md`
```markdown
## [2025-01-15] - Decision Title

**Context**: Brief context

**Decision**: What we decided

**Consequences**:
- Pro: Benefit
- Con: Trade-off

**Alternatives Considered**:
- Option A (rejected: reason)
- Option B (rejected: reason)

**Status**: Implemented / In Progress / Deferred
```

### `backlog.md`
```markdown
## High Priority
- [ ] Feature name [Est: 6h]
- [ ] Another feature [Est: 4h]

## Medium Priority
- [ ] Nice to have [Est: 3h]

## Low Priority / Ideas
- [ ] Future enhancement [Est: 8h]

## Future Ideas (Not Estimated)
- Description of potential feature
```

## Pre-Deployment Checklist

- [ ] All critical security issues fixed
- [ ] All high-priority performance issues fixed
- [ ] Code formatted: `vendor/bin/pint`
- [ ] All tests passing: `php artisan test`
- [ ] No N+1 queries (Telescope)
- [ ] Response time < 200ms (Telescope)
- [ ] Frontend builds: `npm run build`
- [ ] No console errors in browser
- [ ] Sprint documented
- [ ] Git commits pushed
