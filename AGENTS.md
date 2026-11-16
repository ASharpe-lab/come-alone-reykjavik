<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Come Alone Reykjavík

A mobile-first Reykjavík event platform. Small local organisations use a
custom CMS to create and update events, while residents and visitors browse,
filter and add events to their calendars without creating an account.

School project, Vefskólinn Module 4.

## Commands
- `npm run dev`: start the local server on http://localhost:3000
- `npm run lint`: check the code
- `npm run build`: verify that the production build succeeds

## Rules
- Write all code in TypeScript.
- Never commit to `main`. Work on a branch and open a pull request.
- Everything must work with the keyboard only.
- Never invent events, users or interview answers.

## Current MVP direction

- Public visitors can browse and filter events without an account.
- Public visitors can view event details and add an event to their calendar.
- Organisation members can register, sign in and manage their own events.
- The custom CMS supports creating, editing, publishing and deleting events.
- Visitor accounts, Interested/Going, notifications, payments and manual
  moderation are outside the MVP unless research shows they are necessary.
- Do not add features to the MVP without an approved GitHub Issue.

## Team working agreement

All four team members are developers. Additional roles are temporary
coordination responsibilities and do not make anyone responsible for completing
other members' work.

### Temporary coordination roles

- Sprint facilitator — [Name]
  Keeps sprint meetings focused and follows the agreed schedule.

- Decider — [Name]
  Makes the final product decision when the team cannot reach an agreement
  within the available time.

- GitHub workflow coordinator — [Name]
  Maintains the GitHub Board, Issues and branch conventions. This person is not
  responsible for fixing or completing other developers' work.

- Research and Figma coordinator — [Name]
  Organises research notes, interview evidence and shared Figma files.

### Task ownership

- Every task must have a GitHub Issue.
- Every Issue must have one owner, a deadline and acceptance criteria.
- Each developer is responsible for implementing and testing their assigned work.
- Blockers must be communicated as early as possible.
- Important decisions must be documented in GitHub or FigJam.

### Git workflow

- Use branches such as `feature/event-list`, `fix/calendar-button` or
  `docs/interview-findings`.
- Keep pull requests focused on one feature or task.
- Another team member should review the pull request when possible.
- Run `npm run lint` and `npm run build` before merging.
- Do not commit secrets, passwords, API keys or personal interview information.

### Remote communication

Each member posts a short daily update:

- Done: what was completed.
- Next: what will be done next.
- Blocked: what is preventing progress.

## AI and research integrity

AI may:

- help draft and improve interview questions;
- translate and organise real interview notes;
- identify possible themes for the team to verify;
- assist with code, documentation and testing.

AI must not:

- invent participants, interviews, answers, quotes, events or users;
- present assumptions as research findings;
- create a persona or empathy map without real supporting evidence;
- make final product decisions without team review.

All AI-generated code and research summaries must be reviewed by a team member.
Significant AI use must be recorded in the AI report, including what the AI did,
what the team verified and what was changed.

## Mistakes the AI has made
- (empty for now)