export interface GitPlanConfig {
  workingDir: string
  port?: number
}

export interface BoardListView {
  type: "grid" | "list"
  searchQuery?: string
}

export interface KanbanColumn {
  id: string
  title: string
  issues: Issue[]
}

export interface Issue {
  id: string
  title: string
  content: string
  frontmatter: Record<string, any>
  filename: string
}
