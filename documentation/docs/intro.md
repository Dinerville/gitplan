---
sidebar_position: 1
---

# GitPlan Documentation

Welcome to **GitPlan** - a powerful CLI tool for managing Kanban boards with markdown files and JSON configuration.

## What is GitPlan?

GitPlan transforms your markdown files into interactive Kanban boards, perfect for project management, personal productivity, and team collaboration. It combines the simplicity of markdown with the power of customizable board views.

## Key Features

- 📝 **Markdown-based Issues**: Write issues in markdown with frontmatter metadata
- 🎯 **Customizable Boards**: Configure Kanban boards with JSON view files
- 🌐 **Web Interface**: Modern, responsive web UI built with Next.js
- 🚀 **CLI Tools**: Simple commands to initialize and run projects
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔄 **Real-time Updates**: Changes sync automatically between files and UI

## Quick Start

Get started with GitPlan in just a few commands:

```bash
# Install GitPlan globally
npm install -g gitplan

# Create a new project
mkdir my-project && cd my-project

# Initialize with demo content
gitplan init

# Start the development server
gitplan start
```

Open your browser to `http://localhost:3057` to see your Kanban boards in action!

## What You'll Learn

This documentation covers everything you need to know about GitPlan:

- **[CLI Commands](./cli-commands)** - Installation and command reference
- **[Markdown Guide](./markdown-guide)** - Writing issues with frontmatter
- **[View.json Configuration](./view-json-guide)** - Setting up Kanban boards
- **[UI Features](./ui-features)** - Using the web interface
- **[Examples](./examples)** - Real-world project templates

## Project Structure

A typical GitPlan project looks like this:

```
my-project/
├── boards/
│   ├── project-board.view.json
│   └── goals/
│       └── view.json
└── issues/
    ├── project-tasks/
    │   ├── feature-request.md
    │   └── bug-fix.md
    └── personal-goals/
        ├── learn-spanish.md
        └── exercise-routine.md
```

## Why GitPlan?

- **Version Control Friendly**: All data stored in markdown and JSON files
- **No Vendor Lock-in**: Your data remains accessible and portable
- **Flexible Workflows**: Adapt to any project management methodology
- **Developer Friendly**: Built with modern web technologies
- **Open Source**: Transparent, customizable, and community-driven

Ready to get started? Check out the [CLI Commands](./cli-commands) guide to install and set up your first project!
