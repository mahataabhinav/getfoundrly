# Tools

This directory contains Python scripts for deterministic execution in the WAT framework.

## Purpose

Tools are the execution layer of the WAT architecture. They handle:
- API calls
- Data transformations
- File operations
- Database queries
- Any other deterministic operations

## Principles

- **Deterministic**: Tools should produce consistent, predictable results
- **Testable**: Each tool should be independently testable
- **Fast**: Optimized for performance
- **Single Purpose**: Each tool does one thing well

## Structure

Each tool should:
1. Have a clear, descriptive name (e.g., `scrape_single_site.py`)
2. Include proper error handling
3. Use environment variables from `.env` for credentials
4. Return clear success/failure indicators
5. Log important operations

## Usage

Tools are called by the AI agent based on workflow instructions. They are not meant to be run in isolation, but rather orchestrated as part of a larger workflow.

## Environment Variables

All API keys and credentials should be stored in the `.env` file at the project root. Access them using Python's `os.getenv()` or the `python-dotenv` package.

## Adding New Tools

Before creating a new tool, check if an existing one can handle the task. If you need to create a new tool:
1. Follow the naming convention: `action_target.py` (e.g., `fetch_data.py`)
2. Include proper documentation in the script
3. Test thoroughly
4. Update the relevant workflow to reference it
