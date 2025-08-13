#!/usr/bin/env node

import { Command } from "commander"
import { startServer } from "./server"
import * as fs from "fs"
import * as path from "path"

const program = new Command()

// Read version from package.json
const packageJsonPath = path.join(__dirname, "..", "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

program.name("gitplan").description("Git-based Kanban board system").version(packageJson.version)

program
  .command("init")
  .description("Initialize a new GitPlan project with demo boards and issues")
  .action(async () => {
    const currentDir = process.cwd()
    const packageDir = path.dirname(__dirname) // Go up from dist to package root
    const demoProjectPath = path.join(packageDir, "demo-project")

    console.log(`📋 Initializing GitPlan project in: ${currentDir}`)

    try {
      // Check if demo-project exists in the package
      if (!fs.existsSync(demoProjectPath)) {
        console.error("❌ Demo project not found in package")
        process.exit(1)
      }

      // Copy demo-project contents to current directory
      copyRecursive(demoProjectPath, currentDir)

      console.log("✅ GitPlan project initialized successfully!")
      console.log("📁 Created:")
      console.log("  - boards/ (board configurations)")
      console.log("  - issues/ (markdown issues)")
      console.log("")
      console.log("🚀 Run 'gitplan' to start the server")
    } catch (error) {
      console.error("❌ Failed to initialize GitPlan project:", error)
      process.exit(1)
    }
  })

program
  .command("start", { isDefault: true })
  .description("Start GitPlan server in current directory")
  .option("-p, --port <port>", "specify port number")
  .action(async (options) => {
    const workingDir = process.cwd()
    console.log(`🚀 Starting GitPlan in: ${workingDir}`)

    try {
      await startServer(workingDir, options.port)
    } catch (error) {
      console.error("❌ Failed to start GitPlan:", error)
      process.exit(1)
    }
  })

function copyRecursive(src: string, dest: string) {
  const stat = fs.statSync(src)

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }

    const files = fs.readdirSync(src)
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

program.parse()
