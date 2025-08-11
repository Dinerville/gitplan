"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FolderKanban, Calendar, User, Tag, AlertCircle, Clock, ChevronRight, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
  name: string // Display name from view file
  id: string // Unique identifier
  path: string // Path to issues folder
  viewPath: string // Path to view file
  issueCount: number
  lastModified?: string
  parentPath?: string // For nested boards
  settings?: {
    columns: {
      id: string
      filters: Record<string, any>
    }[]
  }
}

interface KanbanBoard {
  board: Board
  columns: KanbanColumn[]
  cardFields?: string[] // Simplified to array of field names
  boardFilters?: Record<string, any> // renamed from globalFilters
}

interface DraggedIssue {
  issue: Issue
  sourceColumnId: string
}

interface UpdatePreview {
  key: string
  currentValue: any
  newValue: any
}

export default function BoardPage() {
  const searchParams = useSearchParams()
  const boardId = searchParams.get("id")
  const [kanbanData, setKanbanData] = useState<KanbanBoard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [boardFilters, setBoardFilters] = useState<Record<string, any>>({}) // renamed from globalFilters
  const [draggedIssue, setDraggedIssue] = useState<DraggedIssue | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [updatePreview, setUpdatePreview] = useState<UpdatePreview[]>([])
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState<{
    issueId: string
    targetColumnId: string
    updates: Record<string, any>
  } | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (boardId) {
      fetchKanbanBoard()
    }
  }, [boardId])

  const fetchKanbanBoard = async () => {
    if (!boardId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/boards/${encodeURIComponent(boardId)}/kanban`)
      if (!response.ok) throw new Error("Failed to fetch board")

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

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "None"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (Array.isArray(value)) return value.join(", ")
    return String(value)
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
      const formattedValue = formatValue(value)

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
    if (!boardFilters || Object.keys(boardFilters).length === 0) {
      return null
    }

    return (
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Board Filters</h3>{" "}
        <div className="flex flex-wrap gap-2">
          {Object.entries(boardFilters).map(([key, value]) => {
            const type = detectValueType(value)
            const formattedValue = formatValue(value)

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

  const handleDragStart = (e: React.DragEvent, issue: Issue, columnId: string) => {
    setDraggedIssue({ issue, sourceColumnId: columnId })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverColumn(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (!draggedIssue || draggedIssue.sourceColumnId === targetColumnId) {
      setDraggedIssue(null)
      return
    }

    const targetColumn = kanbanData?.columns.find((col) => col.id === targetColumnId)
    if (!targetColumn || !kanbanData) {
      setDraggedIssue(null)
      return
    }

    const updates = calculateRequiredUpdates(draggedIssue.issue, targetColumn, kanbanData)

    if (Object.keys(updates).length === 0) {
      moveIssueInUI(draggedIssue.issue.id, draggedIssue.sourceColumnId, targetColumnId)
      setDraggedIssue(null)
      return
    }

    const preview = Object.entries(updates).map(([key, newValue]) => ({
      key,
      currentValue: draggedIssue.issue.frontmatter[key],
      newValue,
    }))

    setUpdatePreview(preview)
    setPendingUpdate({
      issueId: draggedIssue.issue.id,
      targetColumnId,
      updates,
    })
    setShowUpdateDialog(true)
    setDraggedIssue(null)
  }

  const calculateRequiredUpdates = (
    issue: Issue,
    targetColumn: KanbanColumn,
    kanbanData: KanbanBoard,
  ): Record<string, any> => {
    const updates: Record<string, any> = {}

    const board = kanbanData.board
    if (!board.settings?.columns) return updates

    const targetColumnConfig = board.settings.columns.find((col) => col.id === targetColumn.id)
    if (!targetColumnConfig) return updates

    Object.entries(targetColumnConfig.filters).forEach(([key, filterValue]) => {
      const currentValue = issue.frontmatter[key]

      if (!matchesFilterValue(currentValue, filterValue)) {
        const newValue = getNewValueFromFilter(filterValue)
        if (newValue !== undefined) {
          updates[key] = newValue
        }
      }
    })

    return updates
  }

  const matchesFilterValue = (currentValue: any, filterValue: any): boolean => {
    if (typeof filterValue === "string") {
      return String(currentValue || "").toLowerCase() === filterValue.toLowerCase()
    }
    if (Array.isArray(filterValue)) {
      return filterValue.includes(currentValue)
    }
    if (typeof filterValue === "object" && filterValue !== null) {
      if (filterValue.$in) {
        return filterValue.$in.includes(currentValue)
      }
    }
    return currentValue === filterValue
  }

  const getNewValueFromFilter = (filterValue: any): any => {
    if (typeof filterValue === "string") {
      return filterValue
    }
    if (Array.isArray(filterValue) && filterValue.length > 0) {
      return filterValue[0]
    }
    if (typeof filterValue === "object" && filterValue !== null) {
      if (filterValue.$in && Array.isArray(filterValue.$in) && filterValue.$in.length > 0) {
        return filterValue.$in[0]
      }
    }
    return filterValue
  }

  const moveIssueInUI = (issueId: string, sourceColumnId: string, targetColumnId: string) => {
    if (!kanbanData) return

    setKanbanData((prev) => {
      if (!prev) return prev

      const newColumns = prev.columns.map((column) => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            issues: column.issues.filter((issue) => issue.id !== issueId),
          }
        }
        if (column.id === targetColumnId) {
          const issue = prev.columns
            .find((col) => col.id === sourceColumnId)
            ?.issues.find((issue) => issue.id === issueId)

          if (issue) {
            return {
              ...column,
              issues: [...column.issues, issue],
            }
          }
        }
        return column
      })

      return { ...prev, columns: newColumns }
    })
  }

  const handleConfirmUpdate = async () => {
    if (!pendingUpdate) return

    setIsUpdating(true)
    try {
      const response = await fetch(
        `/api/boards/${encodeURIComponent(boardId)}/issues/${encodeURIComponent(pendingUpdate.issueId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            frontmatter: pendingUpdate.updates,
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update issue")
      }

      await fetchKanbanBoard()

      setShowUpdateDialog(false)
      setPendingUpdate(null)
      setUpdatePreview([])
    } catch (error) {
      console.error("Error updating issue:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelUpdate = () => {
    setShowUpdateDialog(false)
    setPendingUpdate(null)
    setUpdatePreview([])
  }

  if (!boardId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-2 py-4">
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
        <div className="container mx-auto px-2 py-4">
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
        <div className="container mx-auto px-2 py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto mt-8">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-destructive">Error Loading Board</h3>
            </div>
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={fetchKanbanBoard} className="bg-transparent">
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
        <div className="container mx-auto px-2 py-4">
          <div className="text-center py-12">
            <FolderKanban className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Board Not Found</h3>
            <p className="text-muted-foreground mb-4">The board "{boardId}" could not be found.</p>
            <Link href="/">
              <Button variant="outline">Back to Boards</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { board, columns } = kanbanData

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Boards
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{board.name}</span>
        </nav>

        {Object.keys(boardFilters).length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Board Filters</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(boardFilters).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="ml-1">{formatValue(value)}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div
                className={`bg-muted/30 rounded-lg p-4 transition-colors ${
                  dragOverColumn === column.id ? "bg-primary/10 border-2 border-primary/20" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color || "#6b7280" }} />
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {column.issues.length}
                    </Badge>
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-3">
                    {column.issues.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        {dragOverColumn === column.id ? "Drop issue here" : "No issues in this column"}
                      </div>
                    ) : (
                      column.issues.map((issue) => (
                        <Card
                          key={issue.id}
                          className="hover:shadow-sm transition-shadow cursor-pointer select-none"
                          draggable
                          onDragStart={(e) => handleDragStart(e, issue, column.id)}
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

        {columns.length === 0 && (
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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[90vw] sm:w-[75vw] sm:max-w-none">
          <SheetHeader>
            <SheetTitle className="sr-only">Issue Details</SheetTitle>
          </SheetHeader>
          {selectedIssue && <IssueDetail issue={selectedIssue} boardName={boardId} showOpenInNewTab={true} />}
        </SheetContent>
      </Sheet>

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Issue Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Moving this issue will update the following fields:</p>
            <div className="space-y-3">
              {updatePreview.map((update, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">{update.key}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{formatValue(update.currentValue)}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{formatValue(update.newValue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancelUpdate} disabled={isUpdating}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleConfirmUpdate} disabled={isUpdating}>
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
