---
sidebar_position: 2
---

# CLI Commands

GitPlan provides a simple command-line interface for managing your Kanban board projects. This guide covers installation, available commands, and usage examples.

## Installation

### Prerequisites

- **Node.js**: Version 16.0 or higher
- **npm**: Comes with Node.js installation

### Global Installation

Install GitPlan globally to use it from anywhere:

```bash
npm install -g gitplan
```

### Local Installation

For project-specific installations:

```bash
npm install gitplan
npx gitplan --help
```

### Verify Installation

Check that GitPlan is installed correctly:

```bash
gitplan --version
```

## Available Commands

### `gitplan init`

Initialize a new GitPlan project with demo content.

```bash
gitplan init [options]
```

#### Options

- `--empty` - Create empty project structure without demo content
- `--template <name>` - Use a specific template (personal, development, marketing)

#### Examples

```bash
# Initialize with demo content
gitplan init

# Initialize empty project
gitplan init --empty

# Initialize with specific template
gitplan init --template development
```

#### What it creates

The `init` command creates the following structure:

```
project/
├── boards/
│   ├── personal-goals.view.json
│   ├── marketing-campaign.view.json
│   └── web-app-development.view.json
└── issues/
    ├── personal-goals/
    │   ├── learn-spanish.md
    │   ├── read-24-books.md
    │   └── home-gym-setup.md
    ├── marketing-campaign/
    │   ├── social-media-strategy.md
    │   ├── blog-content-calendar.md
    │   └── email-automation.md
    └── web-app-development/
        ├── user-authentication.md
        ├── responsive-dashboard.md
        ├── api-documentation.md
        ├── database-optimization.md
        └── security-audit.md
```

### `gitplan start`

Start the GitPlan development server.

```bash
gitplan start [options]
```

#### Options

- `-p, --port <number>` - Specify port number (default: 3057)
- `-h, --host <string>` - Specify host address (default: localhost)
- `--open` - Automatically open browser
- `--verbose` - Enable verbose logging

#### Examples

```bash
# Start on default port (3057)
gitplan start

# Start on custom port
gitplan start --port 8080

# Start and open browser automatically
gitplan start --open

# Start with verbose logging
gitplan start --verbose

# Start on all network interfaces
gitplan start --host 0.0.0.0
```

#### Server Features

When you run `gitplan start`, the server provides:

- **Web Interface**: Access your boards at `http://localhost:3057`
- **API Endpoints**: RESTful API for board and issue data
- **File Watching**: Automatic reload when markdown or JSON files change
- **Hot Reload**: Live updates in the browser

### `gitplan --help`

Display help information for all commands.

```bash
gitplan --help
gitplan <command> --help
```

### `gitplan --version`

Display the current version of GitPlan.

```bash
gitplan --version
```

## Usage Workflows

### Starting a New Project

```bash
# Create project directory
mkdir my-kanban-project
cd my-kanban-project

# Initialize with demo content
gitplan init

# Start the server
gitplan start --open
```

### Working with Existing Projects

```bash
# Navigate to existing project
cd existing-project

# Start the server
gitplan start
```

### Development Workflow

```bash
# Start server with verbose logging
gitplan start --verbose

# In another terminal, edit files
vim issues/my-project/new-feature.md

# Changes automatically reload in browser
```

## Configuration

### Environment Variables

GitPlan respects these environment variables:

- `GITPLAN_PORT` - Default port for the server
- `GITPLAN_HOST` - Default host address
- `NODE_ENV` - Environment mode (development/production)

### Project Configuration

Create a `.gitplanrc.json` file in your project root:

```json
{
  "port": 3057,
  "host": "localhost",
  "autoOpen": true,
  "verbose": false
}
```

## API Endpoints

When the server is running, these endpoints are available:

### Board Operations

```bash
GET /api/boards                    # List all boards
GET /api/boards/:boardId           # Get board details
GET /api/boards/:boardId/kanban    # Get Kanban board data
```

### Issue Operations

```bash
GET /api/boards/:boardId/issues              # List board issues
GET /api/boards/:boardId/issues/:issueId     # Get issue details
PATCH /api/boards/:boardId/issues/:issueId   # Update issue metadata
```

### Example API Usage

```bash
# List all boards
curl http://localhost:3057/api/boards

# Get specific board
curl http://localhost:3057/api/boards/personal-goals

# Get board issues
curl http://localhost:3057/api/boards/personal-goals/issues
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
Error: Port 3057 is already in use
```

**Solution**: Use a different port or kill the existing process

```bash
# Use different port
gitplan start --port 3058

# Or find and kill existing process
lsof -ti:3057 | xargs kill
```

#### Permission Errors

```bash
Error: EACCES: permission denied
```

**Solution**: Check file permissions or use sudo for global installation

```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Or use sudo (not recommended)
sudo npm install -g gitplan
```

#### Module Not Found

```bash
Error: Cannot find module 'gitplan'
```

**Solution**: Reinstall GitPlan

```bash
npm uninstall -g gitplan
npm install -g gitplan
```

### Debug Mode

Enable debug logging for troubleshooting:

```bash
DEBUG=gitplan:* gitplan start --verbose
```

### Log Files

GitPlan logs are written to:

- **macOS/Linux**: `~/.gitplan/logs/`
- **Windows**: `%APPDATA%\gitplan\logs\`

## Advanced Usage

### Custom Templates

Create custom project templates in `~/.gitplan/templates/`:

```bash
mkdir -p ~/.gitplan/templates/my-template
# Add boards/ and issues/ directories with your content
gitplan init --template my-template
```

### Scripting

Use GitPlan in scripts and automation:

```bash
#!/bin/bash
# Auto-setup script
mkdir project && cd project
gitplan init --empty
echo "Project initialized!"
gitplan start --port 3000 &
echo "Server started on port 3000"
```

### Docker Usage

Run GitPlan in a Docker container:

```dockerfile
FROM node:18-alpine
RUN npm install -g gitplan
WORKDIR /app
COPY . .
EXPOSE 3057
CMD ["gitplan", "start", "--host", "0.0.0.0"]
```

## Next Steps

Now that you understand the CLI commands, learn how to:

- **[Write Markdown Issues](./markdown-guide)** - Create and structure your issues
- **[Configure Boards](./view-json-guide)** - Set up custom Kanban boards
- **[Use the Web Interface](./ui-features)** - Navigate and manage your boards
- **[Explore Examples](./examples)** - See real-world project setups
