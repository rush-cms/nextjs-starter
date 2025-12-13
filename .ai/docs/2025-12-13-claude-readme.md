# .claude/ Directory - Session Management Guide

## 🎯 Purpose

This directory contains project management files following the structure defined in `/CLAUDE.md`. It helps track sprints, decisions, and context across multiple AI assistant sessions.

---

## 📁 Directory Structure

```
.claude/
├── README.md              # This file - explains the structure
├── current-sprint.md      # Active sprint tasks (IN_PROGRESS)
├── backlog.md             # Future sprints and ideas
├── notes.md               # Quick thoughts, blockers, pending decisions
├── context.md             # Session state - READ THIS FIRST in new sessions
├── decisions.md           # Architectural decisions with rationale
├── settings.local.json    # Claude Code settings (auto-generated)
├── completed/             # Archived completed sprints (YYYY-MM-DD.md)
└── docs/                  # Reference documentation
    ├── api-documentation.md       # Rush CMS API v1 docs
    └── nextjs-integration.md      # Complete integration guide
```

---

## 🚀 Quick Start for New Sessions

### Step 1: Read Context
```bash
# First thing to do in a new session
cat .claude/context.md
```

This file contains:
- Current project state
- Last completed work
- Next task to continue
- Important decisions made
- Blockers and dependencies

### Step 2: Check Current Sprint
```bash
cat .claude/current-sprint.md
```

Look for tasks with status:
- `[ ]` - Not started (pick one to work on)
- Tasks are prioritized: [P1] critical, [P2] high, [P3] medium, [P4] low

### Step 3: Check for Blockers
```bash
cat .claude/notes.md
```

Review:
- **Blockers** section - anything preventing progress?
- **Decisions Pending** - needs user input before proceeding?

---

## 📝 File Usage Guide

### current-sprint.md

**When to use:**
- Starting a new sprint
- Marking tasks complete (immediately after finishing)
- Recording actual time spent
- Moving to next task

**Format:**
```markdown
## Sprint #X - Sprint Name

**Started**: YYYY-MM-DD HH:MM
**Estimated**: X hours
**Status**: IN_PROGRESS / COMPLETED
**Priority**: High / Medium / Low

### Tasks
- [ ] Task description [P1]
- [x] Completed task [P2]
  - Commit: `abc123` - feat: description

**Ended**: YYYY-MM-DD HH:MM
**Actual**: X hours

### Sprint Metrics
- **Velocity**: X/Y tasks (Z%)
- **Time Accuracy**: Actual / Estimated = Z%
- **Blockers**: N
```

**Rules:**
- Mark tasks complete immediately (don't batch)
- Record commit hashes when relevant
- Update sprint metrics at the end
- Move to `completed/YYYY-MM-DD.md` when done

---

### backlog.md

**When to use:**
- Planning future work
- Adding new ideas
- Estimating effort
- Prioritizing features

**Structure:**
- **High Priority** - Must have features
- **Medium Priority** - Should have features
- **Low Priority / Ideas** - Nice to have
- **Future Ideas** - Not yet estimated

**Format:**
```markdown
### Sprint #X - Name (Est: Xh)
- [ ] Task description [Est: Xh]
```

---

### notes.md

**When to use:**
- Quick thoughts during development
- Encountered a blocker
- Need to remember something
- Pending decision needs user input
- Technical debt identified

**Sections:**
- **Blockers** - Active blockers preventing progress
- **Decisions Pending** - Needs user input or clarification
- **Ideas for Future** - Quick thoughts to explore later
- **Technical Debt** - Code that needs refactoring
- **Learnings & Insights** - Things discovered during development

---

### context.md

**CRITICAL - Update before context clearing!**

**When to use:**
- Before clearing context (mandatory)
- At end of work session
- After major milestone
- When switching focus areas

**Must include:**
- Current working file
- Last completed task
- Next task to do
- Important decisions made
- Code in progress (uncommitted)
- Blockers

**Example:**
```markdown
## Last Updated: YYYY-MM-DD HH:MM

## Current State
- Working on: Specific file or feature
- Last completed: What was just finished
- Next task: Where to continue
- Current file: /absolute/path/to/file.ts

## Code in Progress
- Function X is 50% complete in file Y
- Need to finish Z before committing
```

---

### decisions.md

**When to use:**
- Made an architectural decision
- Chose between multiple approaches
- Need to document why something was done

**Format:**
```markdown
## [YYYY-MM-DD] - Decision Title

**Context**: Why this decision was needed

**Decision**: What was decided

**Consequences**:
- Pro: Benefit 1
- Pro: Benefit 2
- Con: Trade-off 1

**Alternatives Considered**:
- Option A (rejected: reason)
- Option B (rejected: reason)

**Status**: Implemented / In Progress / Deferred
```

---

## 🔄 Workflow

### Starting a New Sprint

1. Review `backlog.md` and choose next sprint
2. Copy sprint details to `current-sprint.md`
3. Update `context.md` with new sprint info
4. Start working on [P1] tasks first

### During Development

1. Mark task as in progress (optional, helps tracking)
2. Work on the task
3. Commit changes
4. **Immediately** mark task as complete in `current-sprint.md`
5. Record commit hash in sprint file
6. Move to next task

### Completing a Sprint

1. Calculate sprint metrics (velocity, time accuracy, blockers)
2. Add learnings to `notes.md`
3. Move `current-sprint.md` content to `completed/YYYY-MM-DD.md`
4. Update `context.md` with completion
5. Start next sprint

### Before Context Clearing

1. **Update `context.md`** with current state (mandatory!)
2. Commit all changes
3. Update sprint file with progress
4. Note any uncommitted work

---

## 🎨 Project-Specific Context

### This Project: Next.js Rush CMS Starter

**Purpose**: Create a production-ready Next.js 16 starter for Rush CMS (headless CMS)

**Key Files**:
- `/CLAUDE.md` - Coding standards (MUST follow)
- `/package.json` - Dependencies
- `.claude/docs/nextjs-integration.md` - Integration guide (1258 lines)
- `.claude/docs/api-documentation.md` - Rush CMS API docs (957 lines)

**Coding Standards** (from CLAUDE.md):
- Single quotes ('), no double quotes
- No semicolons
- Tab indentation (size 4) for .ts/.tsx
- No trailing commas
- kebab-case filenames only
- Tailwind CSS only (no custom CSS)
- Strict TypeScript (no any types)
- Comments on own line (never inline)

**Current Sprint**: #1 - Foundation & Core Setup
**Estimated Total**: 10 sprints (~40 hours)
**Started**: 2025-11-11

---

## 🤖 Instructions for AI Assistants

### First Message in New Session

1. Read `.claude/context.md` first
2. Read `.claude/current-sprint.md` second
3. Check `.claude/notes.md` for blockers
4. Review `/CLAUDE.md` for coding standards
5. Continue from "Next task" in context.md

### During Session

- Use TodoWrite tool for task tracking
- Mark tasks complete immediately (don't batch)
- Follow CLAUDE.md rules strictly
- Update sprint file as you go
- Add learnings to notes.md

### Before Ending Session

- Update context.md with current state
- Commit all changes
- Update sprint metrics
- Note any blockers

### Git Commit Format

```
type(scope): description [Sprint#X-TaskY]

Examples:
- feat(api): add Rush CMS client [Sprint#1-Task2]
- fix(types): correct Entry interface [Sprint#1-Task3]
- docs(readme): add setup instructions [Sprint#8-Task1]
```

Types: feat, fix, refactor, test, docs, style, perf, chore

---

## 📊 Sprint Planning Guidelines

### Sprint Sizing
- Small: 2-3 hours
- Medium: 4-6 hours
- Large: 7-10 hours
- Never exceed 10 hours per sprint

### Priority Levels
- **[P1]** - Critical, must complete this sprint
- **[P2]** - High, should complete this sprint
- **[P3]** - Medium, nice to have
- **[P4]** - Low, can move to backlog

### Task Estimation
- Small task: 15-30 minutes
- Medium task: 1-2 hours
- Large task: 3-4 hours
- Break down tasks larger than 4 hours

---

## ✅ Definition of Done

Before marking sprint complete:

### Code Quality
- [ ] Follows CLAUDE.md standards
- [ ] TypeScript strict mode (no any)
- [ ] No console.log or debug statements
- [ ] Code formatted correctly

### Functionality
- [ ] Works as specified
- [ ] Edge cases handled
- [ ] Error messages clear
- [ ] Responsive design

### Testing
- [ ] Manually tested
- [ ] No browser console errors
- [ ] TypeScript compiles: `pnpm type-check`

### Documentation
- [ ] Sprint file updated
- [ ] Complex logic commented
- [ ] Decisions recorded (if applicable)

### Git
- [ ] Changes committed
- [ ] Commit hash in sprint file
- [ ] Branch pushed (if applicable)

---

## 🆘 Troubleshooting

### "I don't know what to do next"
→ Read `.claude/context.md` → "Next task" section

### "Sprint file is outdated"
→ Check `.claude/completed/` for archived sprints
→ Copy next sprint from `backlog.md` to `current-sprint.md`

### "Conflicting information"
→ Order of precedence:
1. `CLAUDE.md` (project rules)
2. `context.md` (current state)
3. `decisions.md` (architectural choices)
4. `current-sprint.md` (active tasks)

### "User asked to do something not in sprint"
→ Add to `notes.md` → "Ideas for Future"
→ Ask user: "Should I pause current sprint or add to backlog?"

---

## 📚 Additional Resources

### Rush CMS Documentation
- API docs: `.claude/docs/api-documentation.md`
- Integration guide: `.claude/docs/nextjs-integration.md`

### Project Documentation
- Coding standards: `/CLAUDE.md`
- Dependencies: `/package.json`
- TypeScript config: `/tsconfig.json`

### External Links
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: 2025-11-11
**Maintained By**: AI Assistants + User (rafhael)
