# Workflows

This directory contains Markdown SOPs (Standard Operating Procedures) that define how tasks should be executed in the WAT framework.

## Purpose

Workflows are the instruction layer of the WAT architecture. They provide:
- Clear objectives for each task
- Required inputs
- Which tools to use and in what sequence
- Expected outputs
- Edge case handling

## Structure

Each workflow should include:

1. **Objective**: What this workflow accomplishes
2. **Inputs**: What information/data is required before starting
3. **Tools Required**: Which scripts from `tools/` are needed
4. **Steps**: The sequential process to follow
5. **Outputs**: What gets delivered and where
6. **Edge Cases**: How to handle common errors or unexpected situations
7. **Notes**: Lessons learned, rate limits, timing quirks, etc.

## Writing Workflows

Write workflows in plain language, as if briefing a team member. They should be:
- **Clear**: No ambiguity about what to do
- **Complete**: All necessary steps included
- **Current**: Updated as you learn and improve
- **Concise**: Detailed but not verbose

## Example Workflow Template

```markdown
# Workflow Name

## Objective
What this workflow accomplishes in one sentence.

## Inputs
- Input 1: Description
- Input 2: Description

## Tools Required
- `tools/script_name.py`

## Steps
1. First step with clear instruction
2. Second step, reference tool if needed
3. Continue until completion

## Outputs
- Where the final deliverable is stored
- Format of the output

## Edge Cases
- **Rate Limits**: How to handle
- **Missing Data**: What to do
- **API Errors**: Retry strategy

## Notes
Any lessons learned or important quirks to remember.
```

## Evolution

Workflows should evolve as the system learns. When you discover:
- Better methods
- New constraints
- Recurring issues
- More efficient approaches

Update the workflow so future executions benefit from the learning.

## Important

Don't create or overwrite workflows without explicit permission. These are living instructions that should be preserved and refined, not replaced after single use.
