"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FolderKanban, Calendar, User, Tag, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Issue {
  id: string
  title: string
  content: string
  frontmatter: Record<string, any>
  filename: string
  createdAt?: string
  updatedAt?: string
}

interface KanbanColumn {
  id: string
  title: string
  color?: string
  issues: Issue[]
}

interface Board {
  name: string
  path: string
  issueCount: number
  lastModified?: string
}

interface KanbanBoard {
  board: Board
  columns: KanbanColumn[]
}

export default function BoardPage() {
  const searchParams = useSearchParams()
  const boardName = searchParams.get("name") || ""
  const [kanbanData, setKanbanData] = useState<KanbanBoard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (boardName) {
      fetchKanbanBoard()
    }
  }, [boardName])

  const fetchKanbanBoard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/boards/${encodeURIComponent(boardName)}/kanban`)
      if (!response.ok) {
        throw new Error(`Failed to fetch board: ${response.statusText}`)
      }

      const data: KanbanBoard = await response.json()
      setKanbanData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load board")
    } finally {
      setLoading(false)
    }
  }

  if (!boardName) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Boards
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <FolderKanban className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No board specified</h3>
            <p className="text-muted-foreground">Please select a board from the board list.</p>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityIcon = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
      case "high":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading board...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Boards
              </Button>
            </Link>
          </div>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Board</h2>
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={fetchKanbanBoard}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!kanbanData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Boards
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <FolderKanban className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Board not found</h3>
            <p className="text-muted-foreground">The requested board could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Boards
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <FolderKanban className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">{kanbanData.board.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {kanbanData.board.issueCount} issues across {kanbanData.columns.length} columns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-6">
          {kanbanData.columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="bg-muted/30 rounded-lg p-4">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color || "#6b7280" }} />
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {column.issues.length}
                    </Badge>
                  </div>
                </div>

                {/* Issues */}
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-3">
                    {column.issues.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">No issues in this column</div>
                    ) : (
                      column.issues.map((issue) => (
                        <Card key={issue.id} className="hover:shadow-sm transition-shadow cursor-pointer">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-sm font-medium leading-tight">{issue.title}</CardTitle>
                              {issue.frontmatter.priority && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPriorityColor(issue.frontmatter.priority)}`}
                                >
                                  {getPriorityIcon(issue.frontmatter.priority)}
                                  <span className="ml-1">{issue.frontmatter.priority}</span>
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {/* Issue Content Preview */}
                            {issue.content && (
                              <CardDescription className="text-xs mb-3 line-clamp-2">
                                {issue.content.slice(0, 100)}
                                {issue.content.length > 100 && "..."}
                              </CardDescription>
                            )}

                            {/* Issue Metadata */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {issue.frontmatter.assignee && (
                                <Badge variant="outline" className="text-xs">
                                  <User className="h-3 w-3 mr-1" />
                                  {issue.frontmatter.assignee}
                                </Badge>
                              )}
                              {issue.frontmatter.labels &&
                                Array.isArray(issue.frontmatter.labels) &&
                                issue.frontmatter.labels.slice(0, 2).map((label: string) => (
                                  <Badge key={label} variant="outline" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {label}
                                  </Badge>
                                ))}
                              {issue.frontmatter.labels &&
                                Array.isArray(issue.frontmatter.labels) &&
                                issue.frontmatter.labels.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{issue.frontmatter.labels.length - 2} more
                                  </Badge>
                                )}
                            </div>

                            {/* Issue Footer */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(issue.createdAt)}
                              </div>
                              <div className="text-xs font-mono">#{issue.id}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {kanbanData.columns.length === 0 && (
          <div className="text-center py-12">
            <FolderKanban className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No columns configured</h3>
            <p className="text-muted-foreground mb-4">
              Create a <code className="bg-muted px-1 py-0.5 rounded text-sm">view.json</code> file in the board
              directory to configure columns.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
