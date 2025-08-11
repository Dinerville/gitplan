"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function IssuePage() {
  const searchParams = useSearchParams()
  const boardName = searchParams.get("board") || ""
  const issueId = searchParams.get("id") || ""
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (boardName && issueId) {
      fetchIssue()
    }
  }, [boardName, issueId])

  const fetchIssue = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/boards/${encodeURIComponent(boardName)}/issues/${encodeURIComponent(issueId)}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch issue: ${response.statusText}`)
      }

      const data: Issue = await response.json()
      setIssue(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load issue")
    } finally {
      setLoading(false)
    }
  }

  if (!boardName || !issueId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Invalid issue URL</h3>
            <p className="text-muted-foreground">Board name and issue ID are required.</p>
          </div>
        </div>
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
              <p className="text-muted-foreground">Loading issue...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">
              Boards
            </Link>
            <span>/</span>
            <Link href={`/board?name=${encodeURIComponent(boardName)}`} className="hover:text-foreground">
              {boardName}
            </Link>
            <span>/</span>
            <span>Issue</span>
          </nav>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Issue</h2>
            <p className="text-destructive mb-4">{error || "Issue not found"}</p>
            <Button variant="outline" onClick={fetchIssue}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Boards
          </Link>
          <span>/</span>
          <Link
            href={`/board?name=${encodeURIComponent(boardName)}`}
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <FolderKanban className="h-3 w-3" />
            {boardName}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{issue.title}</span>
        </nav>

        {/* Issue Detail */}
        <div className="h-[calc(100vh-160px)]">
          <IssueDetail issue={issue} boardName={boardName} showOpenInNewTab={false} />
        </div>
      </div>
    </div>
  )
}
