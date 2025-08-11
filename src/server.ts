import express from "express"
import cors from "cors"
import * as path from "path"
import * as fs from "fs"
import getPort from "get-port"
import open from "open"
import { GitPlanAPI } from "./api"

export async function startServer(workingDir: string, preferredPort?: string) {
  const app = express()
  const port = await getPort({ port: preferredPort ? Number.parseInt(preferredPort) : 3000 })

  // Enable CORS and JSON parsing
  app.use(cors())
  app.use(express.json())

  // Initialize GitPlan API
  const gitPlanAPI = new GitPlanAPI(workingDir)

  // API routes
  app.get("/api/boards", (req, res) => {
    try {
      const { search, view } = req.query
      const boards = gitPlanAPI.getBoards(search as string)
      res.json({ boards, view: view || "grid" })
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Failed to fetch boards" })
    }
  })

  app.get("/api/boards/:boardName", (req, res) => {
    try {
      const { boardName } = req.params
      const board = gitPlanAPI.getBoard(decodeURIComponent(boardName))
      if (!board) {
        return res.status(404).json({ error: "Board not found" })
      }
      res.json(board)
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Failed to fetch board" })
    }
  })

  app.get("/api/boards/:boardName/kanban", (req, res) => {
    try {
      const { boardName } = req.params
      const kanbanBoard = gitPlanAPI.getKanbanBoard(decodeURIComponent(boardName))
      if (!kanbanBoard) {
        return res.status(404).json({ error: "Board not found" })
      }
      res.json(kanbanBoard)
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Failed to fetch kanban board" })
    }
  })

  app.get("/api/boards/:boardName/issues", (req, res) => {
    try {
      const { boardName } = req.params
      const issues = gitPlanAPI.getIssues(decodeURIComponent(boardName))
      res.json({ issues })
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Failed to fetch issues" })
    }
  })

  // Serve Next.js static files
  const nextDistPath = path.join(__dirname, "../.next")
  if (fs.existsSync(nextDistPath)) {
    app.use("/_next", express.static(path.join(nextDistPath, "static")))
  }

  // Serve public files
  const publicPath = path.join(__dirname, "../public")
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath))
  }

  // Serve the built Next.js app
  app.get("*", (req, res) => {
    const indexPath = path.join(__dirname, "../app/index.html")
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath)
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>GitPlan</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <div id="root">
              <h1>GitPlan is starting...</h1>
              <p>Please build the project first with: npm run build</p>
            </div>
          </body>
        </html>
      `)
    }
  })

  // Start server
  app.listen(port, () => {
    const url = `http://localhost:${port}`
    console.log(`✅ GitPlan server running at ${url}`)
    console.log(`📁 Working directory: ${workingDir}`)

    // Open browser
    open(url).catch(() => {
      console.log(`🌐 Please open ${url} in your browser`)
    })
  })
}
