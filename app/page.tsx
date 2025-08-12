"use client"

import { useState, useEffect } from "react"
import { Search, FolderKanban, FileText, Folder, ChevronRight, ChevronDown, Calendar, Hash, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Board {
  name: string // Display name from view file
  id: string // Unique identifier
  path: string // Path to issues folder
  viewPath: string // Path to view file
  issueCount: number
  lastModified?: string
  parentPath?: string // For nested boards
  settings?: {
    columns: Array<{ id: string; title: string; color?: string }>
  }
}

interface BoardsResponse {
  boards: Board[]
  view: string
}

interface GroupedBoards {
  [key: string]: Board[]
}

export default function BoardListPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Fetch boards
  useEffect(() => {
    fetchBoards()
  }, [searchQuery])

  const fetchBoards = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/boards?${params}`)
      if (!response.ok) throw new Error("Failed to fetch boards")

      const data: BoardsResponse = await response.json()
      setBoards(data.boards)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load boards")
    } finally {
      setLoading(false)
    }
  }

  const groupBoardsByParent = (boards: Board[]): GroupedBoards => {
    const grouped: GroupedBoards = {}

    boards.forEach((board) => {
      const key = board.parentPath || "root"
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(board)
    })

    return grouped
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getColumnCount = (board: Board) => {
    return board.settings?.columns?.length || 3
  }

  const renderBoardCard = (board: Board) => (
    <Link key={board.id} href={`/board?id=${encodeURIComponent(board.id)}`}>
      <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer group border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                    {board.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{board.path}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1 flex-shrink-0" />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30">
                  <Hash className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium">{board.issueCount}</span>
                <span className="text-xs text-muted-foreground">issues</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-green-100 dark:bg-green-900/30">
                  <Layers className="h-3 w-3 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium">{getColumnCount(board)}</span>
                <span className="text-xs text-muted-foreground">columns</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-orange-100 dark:bg-orange-900/30">
                  <Calendar className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(board.lastModified)}</span>
              </div>
            </div>

            {/* Column badges */}
            {board.settings?.columns && board.settings.columns.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {board.settings.columns.slice(0, 3).map((column) => (
                  <Badge
                    key={column.id}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {column.title}
                  </Badge>
                ))}
                {board.settings.columns.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{board.settings.columns.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey)
    } else {
      newExpanded.add(sectionKey)
    }
    setExpandedSections(newExpanded)
  }

  const renderCardLayout = (groupedBoards: GroupedBoards) => {
    const rootBoards = groupedBoards["root"] || []
    const nestedGroups = Object.entries(groupedBoards).filter(([key]) => key !== "root")

    return (
      <div className="space-y-6">
        {/* Root level boards as cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{rootBoards.map(renderBoardCard)}</div>

        {/* Nested groups as collapsible sections */}
        {nestedGroups.map(([parentPath, groupBoards]) => {
          const isExpanded = expandedSections.has(parentPath)
          return (
            <div key={parentPath} className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection(parentPath)}
                className="w-full justify-start p-4 h-auto hover:bg-muted/50 rounded-lg border border-border/50 hover:border-border transition-all"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-lg bg-muted/50">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Folder className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-base capitalize">{parentPath.replace(/[_-]/g, " ")}</span>
                    <p className="text-sm text-muted-foreground">
                      {groupBoards.length} board{groupBoards.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {groupBoards.length}
                  </Badge>
                </div>
              </Button>

              {isExpanded && (
                <div className="ml-4 pl-4 border-l-2 border-border/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {groupBoards.map(renderBoardCard)}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading boards...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const groupedBoards = groupBoardsByParent(boards)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FolderKanban className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">GitPlan</h1>
          </div>
          <p className="text-muted-foreground">Manage your projects with Git-based Kanban boards</p>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boards and issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchBoards} className="mt-2 bg-transparent">
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && boards.length === 0 && !error && (
          <div className="text-center py-12">
            <FolderKanban className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No boards found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No boards match "${searchQuery}"`
                : "Create view files in the boards directory to get started"}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {/* Boards Card Layout */}
        {boards.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FolderKanban className="h-6 w-6" />
                Boards
                <Badge variant="secondary" className="ml-2">
                  {boards.length}
                </Badge>
              </h2>
            </div>
            {renderCardLayout(groupedBoards)}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>GitPlan - Git-based project management</p>
        </div>
      </div>
    </div>
  )
}
