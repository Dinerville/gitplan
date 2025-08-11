# GitPlan

GitPlan is a Git-based Kanban board system that uses your file system as a database. Create boards by making folders, add issues as markdown files, and configure columns with JSON files.

## Features

- 📁 **Git-based**: Uses folders as boards and markdown files as issues
- 🎯 **Flexible Filtering**: Configure columns with powerful filtering options
- 📱 **Responsive Design**: Works great on desktop and mobile
- 🔍 **Search**: Find boards and issues quickly
- 🏷️ **Rich Metadata**: Support for priorities, assignees, labels, and custom fields
- ⚡ **Fast**: Lightweight and runs locally

## Installation

Install GitPlan globally via npm:

\`\`\`bash
npm install -g gitplan
\`\`\`

## Usage

1. Navigate to any directory with your project folders
2. Run GitPlan:

\`\`\`bash
gitplan
\`\`\`

3. GitPlan will start a local server and open your browser automatically

## Project Structure

\`\`\`
your-project/
├── board-name-1/
│   ├── view.json          # Board configuration
│   ├── issue-1.md         # Issue as markdown file
│   ├── issue-2.md
│   └── ...
├── board-name-2/
│   ├── view.json
│   ├── feature-request.md
│   └── ...
└── ...
\`\`\`

## Board Configuration (view.json)

Configure your board columns and filtering with a `view.json` file:

\`\`\`json
{
  "columns": [
    {
      "id": "todo",
      "title": "To Do",
      "color": "#3b82f6",
      "filters": {
        "status": "todo"
      }
    },
    {
      "id": "in-progress", 
      "title": "In Progress",
      "color": "#f59e0b",
      "filters": {
        "status": "in-progress"
      }
    },
    {
      "id": "done",
      "title": "Done", 
      "color": "#10b981",
      "filters": {
        "status": "done"
      }
    }
  ],
  "globalFilters": {},
  "sortBy": "priority",
  "sortOrder": "desc"
}
\`\`\`

## Issue Format

Issues are markdown files with frontmatter:

\`\`\`markdown
---
title: Implement User Authentication
status: in-progress
priority: high
assignee: john-doe
labels: ["backend", "security"]
createdAt: 2024-01-15
estimatedHours: 16
---

# Issue Description

Your issue content goes here in markdown format.

## Requirements

- [ ] Requirement 1
- [ ] Requirement 2
- [x] Completed requirement

## Notes

Any additional notes or details.
\`\`\`

## Filtering Options

GitPlan supports powerful filtering in your `view.json`:

### Basic Filters
\`\`\`json
{
  "status": "todo",
  "priority": "high",
  "assignee": "john-doe"
}
\`\`\`

### Advanced Filters
\`\`\`json
{
  "priority": ["high", "critical"],
  "status": "!done",
  "labels": { "$in": ["frontend", "ui"] },
  "title": { "$regex": "auth.*", "$options": "i" }
}
\`\`\`

### Filter Operators
- `"field": "value"` - Exact match
- `"field": "!value"` - Not equal
- `"field": ["val1", "val2"]` - Any of the values
- `"field": { "$in": [...] }` - Value in array
- `"field": { "$nin": [...] }` - Value not in array  
- `"field": { "$regex": "pattern" }` - Regex match
- `"field": { "$exists": true/false }` - Field exists or not

## Demo Project

This repository includes a demo project in the `demo-project/` folder with three example boards:

1. **web-app-development** - Software development workflow
2. **marketing-campaign** - Marketing campaign management  
3. **personal-goals** - Personal goal tracking

To try the demo:

\`\`\`bash
cd demo-project
gitplan
\`\`\`

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd gitplan

# Install dependencies
npm install
\`\`\`

### CLI Development

\`\`\`bash
# Build the CLI
npm run build:cli

# Run CLI in development mode (with hot reload)
npm run dev:cli

# Test CLI locally (installs globally for testing)
npm run link:cli

# Remove local CLI installation
npm run unlink:cli

# Test the CLI
npm run test:cli
\`\`\`

### Frontend Development

\`\`\`bash
# Start Next.js development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

### Publishing

\`\`\`bash
# Build everything and publish to npm
npm publish
\`\`\`

The CLI will be available as `gitplan` command globally after installation.

## License

MIT License - see LICENSE file for details.
