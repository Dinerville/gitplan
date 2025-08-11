#!/usr/bin/env node

import { Command } from "commander"
import { startServer } from "./server"

const program = new Command()

program.name("gitplan").description("Git-based Kanban board system").version("1.0.0")

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

program.parse()
