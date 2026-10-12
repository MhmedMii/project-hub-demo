# AGENTS.md

## Project context

This user's project notes live in an Obsidian vault, under the `Projects/` folder. Each project note has:
- Frontmatter: `status`, `tags`, `started` date
- Body sections: goal, current status, tasks, links

Before assuming details about a project (its goal, current status, open tasks, or related notes), check the Obsidian vault for the matching project note using the `obsidian-cli` skill rather than inferring from code alone.

## Standing engineering rules

Read and follow [docs/engineering-rules.md](docs/engineering-rules.md) for all planning, implementation, refactoring, review, and verification in this workspace.

The governing rules are **clear responsibilities**, **intentional dependencies**, and **understandable boundaries**. Use readable English names and Clean Code/Clean Architecture. Keep frontend and backend implementations separate, communicating through documented API URLs and data contracts.
