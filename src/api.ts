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
  name: string
  path: string
  issueCount: number
  settings?: BoardSettings
  lastModified?: Date
}

export interface BoardSettings {
  columns: Column[]
  globalFilters?: Record<string, any>
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
  globalFilters?: Record<string, any>
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
      const items = fs.readdirSync(this.workingDir, { withFileTypes: true })
      const boards = items
        .filter((item) => item.isDirectory() && !item.name.startsWith("."))
        .map((dir) => {
          const boardPath = path.join(this.workingDir, dir.name)
          const issues = this.getIssuesFromPath(boardPath)
          const stats = fs.statSync(boardPath)

          return {
            name: dir.name,
            path: boardPath,
            issueCount: issues.length,
            settings: this.getBoardSettings(boardPath),
            lastModified: stats.mtime,
          }
        })
        .sort((a, b) => (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0))

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

  getBoard(boardName: string): Board | null {
    const boardPath = path.join(this.workingDir, boardName)

    if (!fs.existsSync(boardPath) || !fs.statSync(boardPath).isDirectory()) {
      return null
    }

    const issues = this.getIssuesFromPath(boardPath)
    const stats = fs.statSync(boardPath)

    return {
      name: boardName,
      path: boardPath,
      issueCount: issues.length,
      settings: this.getBoardSettings(boardPath),
      lastModified: stats.mtime,
    }
  }

  getKanbanBoard(boardName: string): KanbanBoard | null {
    const board = this.getBoard(boardName)
    if (!board) return null

    const issues = this.getIssues(boardName)
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
      issues: this.filterIssuesForColumn(issues, columnConfig.filters, settings.globalFilters),
    }))

    return {
      board,
      columns,
      cardFields: settings.cardFields,
      globalFilters: settings.globalFilters,
    }
  }

  getIssues(boardName: string): Issue[] {
    const boardPath = path.join(this.workingDir, boardName)
    return this.getIssuesFromPath(boardPath)
  }

  getIssue(boardName: string, issueId: string): Issue | null {
    const issues = this.getIssues(boardName)
    return issues.find((issue) => issue.id === issueId) || null
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

  private getBoardSettings(boardPath: string): BoardSettings | undefined {
    try {
      const viewPath = path.join(boardPath, "view.json")
      if (fs.existsSync(viewPath)) {
        const content = fs.readFileSync(viewPath, "utf-8")
        const settings = JSON.parse(content)

        // Validate and set defaults
        return {
          columns: settings.columns || [],
          globalFilters: settings.globalFilters || {},
          sortBy: settings.sortBy || "createdAt",
          sortOrder: settings.sortOrder || "desc",
          cardFields: settings.cardFields || undefined, // Now expects array of strings
        }
      }
    } catch (error) {
      console.error(`Error reading board settings from ${boardPath}:`, error)
    }

    return undefined
  }

  private filterIssuesForColumn(
    issues: Issue[],
    columnFilters: Record<string, any>,
    globalFilters?: Record<string, any>,
  ): Issue[] {
    return issues.filter((issue) => {
      // Apply global filters first
      if (globalFilters && !this.matchesFilters(issue, globalFilters)) {
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
