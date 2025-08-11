import * as fs from "fs"
import * as path from "path"
import matter from "gray-matter"

export interface Issue {
  id: string
  title: string
  content: string
  frontmatter: Record<string, any>
  filename: string
  relativePath: string // Added relative path from board root
  createdAt?: Date
  updatedAt?: Date
}

export interface Board {
  name: string // Display name from view file
  id: string // Unique identifier (filename without extension)
  path: string // Path to issues folder
  viewPath: string // Path to view file
  issueCount: number
  settings?: BoardSettings
  lastModified?: Date
  parentPath?: string // For nested boards (e.g., "personal" for "personal/goals.view.json")
}

export interface BoardSettings {
  columns: Column[]
  boardFilters?: Record<string, any> // renamed from globalFilters
  sortBy?: string
  sortOrder?: "asc" | "desc"
  cardFields?: string[] // Simplified to array of field names
}

export interface CardField {
  field: string
  type: "badge" | "badges" | "date" | "text"
  icon?: string
  maxDisplay?: number
}

export interface Column {
  id: string
  title: string
  filters: Record<string, any>
  color?: string
}

export interface KanbanBoard {
  board: Board
  columns: KanbanColumn[]
  cardFields?: string[] // Simplified to array of field names
  boardFilters?: Record<string, any> // renamed from globalFilters
}

export interface KanbanColumn {
  id: string
  title: string
  color?: string
  issues: Issue[]
}

export class GitPlanAPI {
  constructor(private workingDir: string) {}

  getBoards(searchQuery?: string): Board[] {
    try {
      const boardsPath = path.join(this.workingDir, "boards")
      const issuesPath = path.join(this.workingDir, "issues")

      if (!fs.existsSync(boardsPath)) {
        console.error("Boards directory not found")
        return []
      }

      const boards = this.readBoardsRecursively(boardsPath, boardsPath, issuesPath).sort(
        (a, b) => (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0),
      )

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return boards.filter(
          (board) =>
            board.name.toLowerCase().includes(query) ||
            this.getIssuesFromPath(board.path).some(
              (issue) => issue.title.toLowerCase().includes(query) || issue.content.toLowerCase().includes(query),
            ),
        )
      }

      return boards
    } catch (error) {
      console.error("Error reading boards:", error)
      return []
    }
  }

  private readBoardsRecursively(currentPath: string, boardsRoot: string, issuesRoot: string): Board[] {
    const boards: Board[] = []
    const files = fs.readdirSync(currentPath)

    for (const file of files) {
      const filePath = path.join(currentPath, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        // Recursively read subdirectories
        boards.push(...this.readBoardsRecursively(filePath, boardsRoot, issuesRoot))
      } else if (file.endsWith(".view.json")) {
        try {
          const content = fs.readFileSync(filePath, "utf-8")
          const settings = JSON.parse(content)

          // Generate board ID from relative path
          const relativePath = path.relative(boardsRoot, filePath)
          const boardId = relativePath.replace(/\.view\.json$/, "").replace(/[/\\]/g, "-")

          // Determine parent path for nested boards
          const parentDir = path.dirname(relativePath)
          const parentPath = parentDir !== "." ? parentDir : undefined

          // Determine issues path
          const issuesPath = settings.path ? path.join(issuesRoot, settings.path) : issuesRoot

          const issues = fs.existsSync(issuesPath) ? this.getIssuesFromPath(issuesPath) : []

          boards.push({
            name: settings.name || path.parse(file).name,
            id: boardId,
            path: issuesPath,
            viewPath: filePath,
            issueCount: issues.length,
            settings: this.parseBoardSettings(settings),
            lastModified: stats.mtime,
            parentPath,
          })
        } catch (error) {
          console.error(`Error reading board file ${filePath}:`, error)
        }
      }
    }

    return boards
  }

  getBoard(boardId: string): Board | null {
    const boards = this.getBoards()
    return boards.find((board) => board.id === boardId) || null
  }

  getKanbanBoard(boardId: string): KanbanBoard | null {
    const board = this.getBoard(boardId)
    if (!board) return null

    const issues = this.getIssuesFromPath(board.path)
    const settings = board.settings

    // If no settings, create default columns
    if (!settings || !settings.columns) {
      const defaultColumns: KanbanColumn[] = [
        { id: "todo", title: "To Do", issues: [] },
        { id: "in-progress", title: "In Progress", issues: [] },
        { id: "done", title: "Done", issues: [] },
      ]

      // Distribute issues based on common frontmatter fields
      issues.forEach((issue) => {
        const status = issue.frontmatter.status?.toLowerCase() || issue.frontmatter.column?.toLowerCase() || "todo"

        const column =
          defaultColumns.find((col) => col.id === status || col.title.toLowerCase().includes(status)) ||
          defaultColumns[0]

        column.issues.push(issue)
      })

      return { board, columns: defaultColumns }
    }

    // Create columns based on settings
    const columns: KanbanColumn[] = settings.columns.map((columnConfig) => ({
      id: columnConfig.id,
      title: columnConfig.title,
      color: columnConfig.color,
      issues: this.filterIssuesForColumn(issues, columnConfig.filters, settings.boardFilters),
    }))

    return {
      board,
      columns,
      cardFields: settings.cardFields,
      boardFilters: settings.boardFilters,
    }
  }

  getIssues(boardId: string): Issue[] {
    const board = this.getBoard(boardId)
    if (!board) return []
    return this.getIssuesFromPath(board.path)
  }

  getIssue(boardId: string, issueId: string): Issue | null {
    const issues = this.getIssues(boardId)
    return issues.find((issue) => issue.id === issueId) || null
  }

  updateIssue(boardId: string, issueId: string, updates: { frontmatter?: Record<string, any> }): boolean {
    try {
      const issue = this.getIssue(boardId, issueId)
      if (!issue) {
        throw new Error(`Issue ${issueId} not found`)
      }

      const board = this.getBoard(boardId)
      if (!board) {
        throw new Error(`Board ${boardId} not found`)
      }

      const filePath = path.join(board.path, issue.relativePath)

      if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} not found`)
      }

      // Read current file content
      const content = fs.readFileSync(filePath, "utf-8")
      const parsed = matter(content)

      // Update frontmatter
      if (updates.frontmatter) {
        Object.assign(parsed.data, updates.frontmatter)
        // Update the updatedAt timestamp
        parsed.data.updatedAt = new Date().toISOString()
      }

      // Write back to file
      const updatedContent = matter.stringify(parsed.content, parsed.data)
      fs.writeFileSync(filePath, updatedContent, "utf-8")

      return true
    } catch (error) {
      console.error(`Error updating issue ${issueId}:`, error)
      return false
    }
  }

  private getIssuesFromPath(boardPath: string): Issue[] {
    try {
      const issues: Issue[] = []
      this.readIssuesRecursively(boardPath, boardPath, issues) // Use recursive function
      return this.sortIssues(issues)
    } catch (error) {
      console.error(`Error reading issues from ${boardPath}:`, error)
      return []
    }
  }

  private readIssuesRecursively(currentPath: string, boardPath: string, issues: Issue[]): void {
    const files = fs.readdirSync(currentPath)

    for (const file of files) {
      const filePath = path.join(currentPath, file)
      const stats = fs.statSync(filePath)

      if (stats.isDirectory()) {
        // Recursively read subdirectories
        this.readIssuesRecursively(filePath, boardPath, issues)
      } else if (file.endsWith(".md") && file !== "view.json") {
        const content = fs.readFileSync(filePath, "utf-8")
        const parsed = matter(content)
        const relativePath = path.relative(boardPath, filePath)

        // Ensure required frontmatter fields
        const frontmatter = {
          ...parsed.data,
          createdAt: parsed.data.createdAt || stats.birthtime,
          updatedAt: parsed.data.updatedAt || stats.mtime,
        }

        issues.push({
          id: relativePath.replace(/\.md$/, "").replace(/[/\\]/g, "-"), // Use relative path as ID
          title: parsed.data.title || this.generateTitleFromContent(parsed.content) || path.parse(file).name,
          content: parsed.content,
          frontmatter,
          filename: file,
          relativePath, // Store relative path
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
        })
      }
    }
  }

  private parseBoardSettings(settings: any): BoardSettings {
    return {
      columns: (settings.columns || []).map((col: any) => ({
        id: col.id || col.name?.toLowerCase().replace(/\s+/g, "-") || "untitled",
        title: col.title || col.name || "Untitled Column",
        filters: col.filters || {},
        color: col.color,
      })),
      boardFilters: settings.boardFilters || settings.globalFilters || {},
      sortBy: settings.sortBy || "createdAt",
      sortOrder: settings.sortOrder || "desc",
      cardFields: settings.cardFields || undefined,
    }
  }

  private filterIssuesForColumn(
    issues: Issue[],
    columnFilters: Record<string, any>,
    boardFilters?: Record<string, any>, // renamed from globalFilters
  ): Issue[] {
    return issues.filter((issue) => {
      // Apply board filters first // renamed from global filters
      if (boardFilters && !this.matchesFilters(issue, boardFilters)) {
        return false
      }

      // Apply column-specific filters
      return this.matchesFilters(issue, columnFilters)
    })
  }

  private matchesFilters(issue: Issue, filters: Record<string, any>): boolean {
    for (const [key, filterValue] of Object.entries(filters)) {
      const issueValue = issue.frontmatter[key]

      if (!this.matchesFilter(issueValue, filterValue)) {
        return false
      }
    }

    return true
  }

  private matchesFilter(issueValue: any, filterValue: any): boolean {
    // Handle different filter types
    if (typeof filterValue === "string") {
      if (filterValue.startsWith("!")) {
        // Negation filter
        return issueValue !== filterValue.slice(1)
      }
      if (filterValue.includes("*")) {
        // Wildcard filter
        const regex = new RegExp(filterValue.replace(/\*/g, ".*"), "i")
        return regex.test(String(issueValue || ""))
      }
      // Exact match (case insensitive)
      return String(issueValue || "").toLowerCase() === filterValue.toLowerCase()
    }

    if (Array.isArray(filterValue)) {
      // Array filter - issue value should be in the array
      return filterValue.some((val) => this.matchesFilter(issueValue, val))
    }

    if (typeof filterValue === "object" && filterValue !== null) {
      // Object filter with operators
      if (filterValue.$in && Array.isArray(filterValue.$in)) {
        return filterValue.$in.includes(issueValue)
      }
      if (filterValue.$nin && Array.isArray(filterValue.$nin)) {
        return !filterValue.$nin.includes(issueValue)
      }
      if (filterValue.$regex) {
        const regex = new RegExp(filterValue.$regex, filterValue.$options || "i")
        return regex.test(String(issueValue || ""))
      }
      if (filterValue.$exists !== undefined) {
        return filterValue.$exists ? issueValue !== undefined : issueValue === undefined
      }
    }

    // Default exact match
    return issueValue === filterValue
  }

  private sortIssues(issues: Issue[]): Issue[] {
    return issues.sort((a, b) => {
      // Sort by priority if available, then by creation date
      const aPriority = this.getPriorityValue(a.frontmatter.priority)
      const bPriority = this.getPriorityValue(b.frontmatter.priority)

      if (aPriority !== bPriority) {
        return bPriority - aPriority // Higher priority first
      }

      // Then by creation date (newest first)
      return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    })
  }

  private getPriorityValue(priority: string | undefined): number {
    const priorityMap: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    }

    return priorityMap[priority?.toLowerCase() || ""] || 0
  }

  private generateTitleFromContent(content: string): string {
    // Extract first line or first sentence as title
    const lines = content.trim().split("\n")
    const firstLine = lines[0]?.trim()

    if (firstLine && firstLine.length > 0 && firstLine.length <= 100) {
      return firstLine.replace(/^#+\s*/, "") // Remove markdown headers
    }

    // Fallback to first sentence
    const sentences = content.split(/[.!?]+/)
    const firstSentence = sentences[0]?.trim()

    if (firstSentence && firstSentence.length <= 100) {
      return firstSentence
    }

    return "Untitled Issue"
  }
}
