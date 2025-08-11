"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FolderKanban, Calendar, User, Tag, AlertCircle, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { IssueDetail } from "@/components/issue-detail"

interface Issue {
  id: string
  title: string
  content: string
  frontmatter: Record<string, any>
  filename: string
  createdAt?: string
  updatedAt?: string
}

interface CardField {
  field: string
  type: "badge" | "badges" | "date" | "text"
  icon?: string
  maxDisplay?: number
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
  cardFields?: string[] // Simplified to array of field names
  boardFilters?: Record<string, any> // renamed from globalFilters
}

export default function BoardPage() {
  const searchParams = useSearchParams()
  const boardName = searchParams.get("name") || ""
  const [kanbanData, setKanbanData] = useState<KanbanBoard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [boardFilters, setBoardFilters] = useState<Record<string, any>>({}) // renamed from globalFilters

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
      setBoardFilters(data.boardFilters || {}) // renamed from globalFilters
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load board")
    } finally {
      setLoading(false)
    }
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

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case "user":
        return <User className="h-3 w-3 mr-1" />
      case "tag":
        return <Tag className="h-3 w-3 mr-1" />
      case "calendar":
        return <Calendar className="h-3 w-3 mr-1" />
      case "clock":
        return <Clock className="h-3 w-3 mr-1" />
      case "priority":
        return getPriorityIcon()
      default:
        return null
    }
  }

  const formatFieldValue = (value: any, type: string) => {
    if (type === "date" && value) {
      return formatDate(value)
    }
    return value
  }

  const detectValueType = (value: any): string => {
    if (!value) return "string"

    // Check if it's a date
    if (typeof value === "string") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      if (dateRegex.test(value) || dateTimeRegex.test(value)) {
        return "date"
      }
    }

    if (Array.isArray(value)) return "array"
    if (typeof value === "boolean") return "boolean"
    return "string"
  }

  const formatValue = (value: any, type: string): string => {
    if (!value) return ""

    switch (type) {
      case "date":
        return formatDate(value)
      case "boolean":
        return value ? "Yes" : "No"
      case "array":
        return Array.isArray(value) ? value.join(", ") : String(value)
      default:
        return String(value)
    }
  }

  const renderCardFields = (issue: Issue, cardFields?: string[]) => {
    if (!cardFields || cardFields.length === 0) {
      // Default fallback - show nothing if no cardFields specified
      return null
    }

    return cardFields.map((fieldName) => {
      let value: any
      let displayValue: string

      // Handle special fields
      switch (fieldName) {
        case "title":
          value = issue.title
          break
        case "content":
          value = issue.content
          // For content, show preview
          if (value) {
            displayValue = value.slice(0, 100) + (value.length > 100 ? "..." : "")
          }
          break
        case "createdAt":
          value = issue.createdAt
          break
        case "id":
          value = issue.id
          break
        default:
          value = issue.frontmatter[fieldName]
          break
      }

      if (!value) return null

      // Special case for title - no key shown, larger text
      if (fieldName === "title") {
        return (
          <div key={fieldName} className="mb-2">
            <div className="text-sm font-medium leading-tight">{value}</div>
          </div>
        )
      }

      // Special case for content - show as description
      if (fieldName === "content") {
        return (
          <div key={fieldName} className="mb-3">
            <div className="text-xs text-muted-foreground line-clamp-2">{displayValue}</div>
          </div>
        )
      }

      // Special case for id - show with # prefix
      if (fieldName === "id") {
        return (
          <div key={fieldName} className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">id:</span>
            <span className="font-mono">#{value}</span>
          </div>
        )
      }

      // Regular frontmatter fields
      const type = detectValueType(value)
      const formattedValue = formatValue(value, type)

      return (
        <div key={fieldName} className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">{fieldName}:</span>
          <span className="text-right">{formattedValue}</span>
        </div>
      )
    })
  }

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsSheetOpen(true)
  }

  const renderBoardFilters = () => {
    // renamed from renderGlobalFilters
    if (!boardFilters || Object.keys(boardFilters).length === 0) {
      return null
    }

    return (
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Board Filters</h3>{" "}
        {/* renamed from Global Filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(boardFilters).map(([key, value]) => {
            const type = detectValueType(value)
            const formattedValue = formatValue(value, type)

            return (
              <Badge key={key} variant="outline" className="text-xs">
                <span className="text-muted-foreground">{key}:</span>
                <span className="ml-1">{formattedValue}</span>
              </Badge>
            )
          })}
        </div>
      </div>
    )
  }

  if (!boardName) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 py-4">
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Boards
            </Link>
          </nav>
          <div className="text-center py-12">
            <FolderKanban className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No board specified</h3>
            <p className="text-muted-foreground">Please select a board from the board list.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 py-4">
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
        <div className="px-4 py-4">
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Boards
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{boardName}</span>
          </nav>
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
        <div className="px-4 py-4">
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Boards
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{boardName}</span>
          </nav>
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
      <div className="px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-4">
            <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Boards
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{kanbanData.board.name}</span>
            </nav>
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
        {/* Board Filters */} {/* renamed from Global Filters */}
        {renderBoardFilters()}
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
                        <Card
                          key={issue.id}
                          className="hover:shadow-sm transition-shadow cursor-pointer"
                          onClick={() => handleIssueClick(issue)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">{renderCardFields(issue, kanbanData.cardFields)}</div>
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

      {/* Issue Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[90vw] sm:w-[75vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle className="sr-only">Issue Details</SheetTitle>
          </SheetHeader>
          {selectedIssue && <IssueDetail issue={selectedIssue} boardName={boardName} showOpenInNewTab={true} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}
