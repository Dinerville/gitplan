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

Init demo
\`\`\`
npx gitplan init
\`\`\`

Start gitplan
\`\`\`
npx gitplan
\`\`\`

## Project Structure

\`\`\`
your-folder/
├── boards/               
│   ├── personal-goals.view.json          # Board configuration
│   ├── markiting.view.json               # Board configuration
│   └── ...
├── issues/
│   ├── feature-request.md                # Issue as markdown file
│   ├── another-feature-request.md        # Issue as markdown file
│   └── ...
└── ...
\`\`\`

## Board Configuration (view.json)

Configure your board columns and filtering with a `view.json` file:

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

## Demo Project

This repository includes a demo project in the `demo-project/` folder with three example boards:

1. **web-app-development** - Software development workflow
2. **marketing-campaign** - Marketing campaign management  
3. **personal-goals** - Personal goal tracking

To try the demo:

\`\`\`bash
cd demo-project
npx gitplan
\`\`\`

## Development

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Setup

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd gitplan

# Install dependencies
npm install
# or
yarn install
\`\`\`

### CLI Development

\`\`\`bash

# Test the CLI
npm run test:cli
# or
yarn test:cli
\`\`\`

### Frontend Development

\`\`\`bash
# Start Next.js development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
\`\`\`

### Publishing

\`\`\`bash
# Build everything and publish to npm
cd publish && npm publish
\`\`\`

The CLI will be available as `gitplan` command globally after installation.

## License

MIT License - see LICENSE file for details.
