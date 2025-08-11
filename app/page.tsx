"use client"

import { useState, useEffect } from "react"
import { Search, Grid3X3, List, FolderKanban, Calendar, FileText, Folder, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMobile()

  // Set default view based on device
  useEffect(() => {
    setViewMode(isMobile ? "grid" : "list")
  }, [isMobile])

  // Fetch boards
  useEffect(() => {
    fetchBoards()
  }, [searchQuery])

  const fetchBoards = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      params.append("view", viewMode)

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
    <Link key={board.id} href={`/board?name=${encodeURIComponent(board.id)}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className={viewMode === "list" ? "pb-3" : ""}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{board.name}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {board.issueCount} issues
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(board.lastModified)}
                </span>
              </CardDescription>
            </div>
            {viewMode === "grid" && (
              <Badge variant="secondary" className="ml-2">
                {getColumnCount(board)} columns
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  )

  const renderTreeView = (groupedBoards: GroupedBoards) => {
    const rootBoards = groupedBoards["root"] || []
    const nestedGroups = Object.entries(groupedBoards).filter(([key]) => key !== "root")

    return (
      <div className="space-y-6">
        {/* Root level boards */}
        {rootBoards.length > 0 && (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {rootBoards.map(renderBoardCard)}
          </div>
        )}

        {/* Nested groups */}
        {nestedGroups.map(([parentPath, groupBoards]) => (
          <div key={parentPath} className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-foreground border-b pb-2">
              <Folder className="h-5 w-5 text-muted-foreground" />
              <span className="capitalize">{parentPath.replace(/[_-]/g, " ")}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="text-xs">
                {groupBoards.length} board{groupBoards.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div
              className={
                viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-6" : "space-y-4 ml-6"
              }
            >
              {groupBoards.map(renderBoardCard)}
            </div>
          </div>
        ))}
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
          <div className="flex gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Grid</span>
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">List</span>
            </Button>
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

        {/* Boards Tree View */}
        {boards.length > 0 && renderTreeView(groupedBoards)}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>GitPlan - Git-based project management</p>
        </div>
      </div>
    </div>
  )
}
