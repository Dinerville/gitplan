"use client"

import { useState, useEffect } from "react"
import { Search, FolderKanban, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface Board {
  name: string
  id: string
  path: string
  viewPath: string
  issueCount: number
}

interface BoardsResponse {
  boards: Board[]
}

export default function BoardListPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const getRelativePath = (fullPath: string) => {
    const parts = fullPath.split("/")
    return parts.slice(1).join("/") || parts[0]
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FolderKanban className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">GitPlan</h1>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchBoards} className="mt-2 bg-transparent">
              Try Again
            </Button>
          </div>
        )}

        {!loading && boards.length === 0 && !error && (
          <div className="text-center py-12">
            <FolderKanban className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No boards found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? `No boards match "${searchQuery}"` : "No boards available"}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}

        {boards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <Link key={board.id} href={`/board?id=${encodeURIComponent(board.id)}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <h3 className="font-semibold text-lg">{board.name}</h3>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issues:</span>
                        <span className="font-medium">{board.issueCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Path:</span>
                        <span className="font-mono text-xs">{getRelativePath(board.path)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Board:</span>
                        <span className="font-mono text-xs">{getRelativePath(board.viewPath)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
