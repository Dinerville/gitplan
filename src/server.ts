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

  app.get("/api/boards/:boardId", (req, res) => {
    try {
      const { boardId } = req.params
      const board = gitPlanAPI.getBoard(decodeURIComponent(boardId))
      if (!board) {
        return res.status(404).json({ error: "Board not found" })
      }
      res.json(board)
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Failed to fetch board" })
    }
  })

  app.get("/api/boards/:boardId/kanban", (req, res) => {
    try {
      const { boardId } = req.params
      const kanbanBoard = gitPlanAPI.getKanbanBoard(decodeURIComponent(boardId))
      if (!kanbanBoard) {
        return res.status(404).json({ error: "Board not found" })
      }
      res.json(kanbanBoard)
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Failed to fetch kanban board" })
    }
  })

  app.get("/api/boards/:boardId/issues", (req, res) => {
    try {
      const { boardId } = req.params
      const issues = gitPlanAPI.getIssues(decodeURIComponent(boardId))
      res.json({ issues })
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Failed to fetch issues" })
    }
  })

  app.get("/api/boards/:boardId/issues/:issueId", (req, res) => {
    try {
      const { boardId, issueId } = req.params
      const issue = gitPlanAPI.getIssue(decodeURIComponent(boardId), decodeURIComponent(issueId))
      if (!issue) {
        return res.status(404).json({ error: "Issue not found" })
      }
      res.json(issue)
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Failed to fetch issue" })
    }
  })

  app.patch("/api/boards/:boardId/issues/:issueId", (req, res) => {
    try {
      const { boardId, issueId } = req.params
      const { frontmatter } = req.body

      if (!frontmatter || typeof frontmatter !== "object") {
        return res.status(400).json({ error: "Invalid frontmatter data" })
      }

      const success = gitPlanAPI.updateIssue(decodeURIComponent(boardId), decodeURIComponent(issueId), {
        frontmatter,
      })

      if (!success) {
        return res.status(404).json({ error: "Issue not found or update failed" })
      }

      // Return the updated issue
      const updatedIssue = gitPlanAPI.getIssue(decodeURIComponent(boardId), decodeURIComponent(issueId))
      res.json(updatedIssue)
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: "Failed to update issue" })
    }
  })

  // Serve built frontend files
  const frontendDistPath = path.join(__dirname, "../out")
  if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath))
  }

  // Serve public files
  const publicPath = path.join(__dirname, "../public")
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath))
  }

  // Serve the built Next.js app
  app.get("/*", (req, res) => {
    // Skip API routes
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API endpoint not found" })
    }

    const indexPath = path.join(__dirname, "../out/index.html")
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
            <style>
              body { font-family: system-ui, sans-serif; padding: 2rem; text-align: center; }
              .error { color: #dc2626; }
              .info { color: #2563eb; }
            </style>
          </head>
          <body>
            <div id="root">
              <h1>GitPlan</h1>
              <p class="error">Frontend not built yet</p>
              <p class="info">Please run: <code>yarn build</code> to build the frontend</p>
              <p>Working directory: <code>${workingDir}</code></p>
              <hr style="margin: 2rem 0;">
              <h3>Available Boards:</h3>
              <div id="boards-list">Loading...</div>
              <script>
                fetch('/api/boards')
                  .then(res => res.json())
                  .then(data => {
                    const boardsList = document.getElementById('boards-list');
                    if (data.boards && data.boards.length > 0) {
                      boardsList.innerHTML = data.boards.map(board => 
                        '<div style="margin: 0.5rem 0; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">' +
                        '<strong>' + board.name + '</strong> (' + board.issueCount + ' issues)' +
                        '</div>'
                      ).join('');
                    } else {
                      boardsList.innerHTML = '<p>No boards found. Make sure you have view files in the boards directory.</p>';
                    }
                  })
                  .catch(err => {
                    document.getElementById('boards-list').innerHTML = '<p style="color: #dc2626;">Error loading boards: ' + err.message + '</p>';
                  });
              </script>
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
