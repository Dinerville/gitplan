# GitPlan CLI Development Guide

## Development Workflow

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Development Mode
Run the CLI directly from source with hot reloading:
\`\`\`bash
npm run dev:cli
\`\`\`

### 3. Build CLI
Compile TypeScript to JavaScript:
\`\`\`bash
npm run build:cli
\`\`\`

### 4. Test Built CLI
Test the compiled CLI locally:
\`\`\`bash
npm run test:cli
\`\`\`

### 5. Link for Global Testing
Install the CLI globally from your local development:
\`\`\`bash
npm run link:cli
\`\`\`

Now you can use `gitplan` command globally. To unlink:
\`\`\`bash
npm run unlink:cli
\`\`\`

## Publishing to NPM

### 1. Build and Test
\`\`\`bash
npm run build:cli
npm run test:cli
\`\`\`

### 2. Update Version
\`\`\`bash
npm version patch  # or minor/major
\`\`\`

### 3. Publish
\`\`\`bash
npm publish
\`\`\`

## Installation for Users

### Global Installation
\`\`\`bash
npm install -g gitplan
\`\`\`

### Usage
Navigate to any directory with GitPlan boards and run:
\`\`\`bash
gitplan
\`\`\`

Or specify a port:
\`\`\`bash
gitplan --port 3001
\`\`\`

## Project Structure

- `src/cli.ts` - CLI entry point
- `src/server.ts` - Express server
- `src/api.ts` - API routes
- `src/types.ts` - TypeScript definitions
- `dist/` - Compiled CLI output (generated)
- `app/` - Next.js frontend
- `components/` - React components

## Development Tips

1. Use `npm run dev:cli` for rapid development
2. Test with `npm run link:cli` before publishing
3. Always run `npm run build:cli` before publishing
4. The CLI automatically finds available ports
5. Frontend is served from the compiled Next.js build
</markdown>
