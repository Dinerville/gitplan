"use client"
import { ExternalLink, Calendar, User, Tag, AlertCircle, Clock, Hash, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Issue {
  id: string
  title: string
  content: string
  frontmatter: Record<string, any>
  filename: string
  relativePath: string // Added relative path
  createdAt?: string
  updatedAt?: string
}

interface IssueDetailProps {
  issue: Issue
  boardName: string
  showOpenInNewTab?: boolean
}

export function IssueDetail({ issue, boardName, showOpenInNewTab = true }: IssueDetailProps) {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "—"

    // Handle dates
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      try {
        return new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      } catch {
        return value
      }
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.join(", ")
    }

    // Handle objects
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2)
    }

    // Handle booleans
    if (typeof value === "boolean") {
      return value ? "Yes" : "No"
    }

    return String(value)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const openInNewTab = () => {
    const url = `/issue?board=${encodeURIComponent(boardName)}&id=${encodeURIComponent(issue.id)}`
    window.open(url, "_blank")
  }

  const renderMetadata = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Issue ID</span>
          <div className="flex items-center gap-1 text-sm font-mono">
            <Hash className="h-3 w-3" />
            {issue.id}
          </div>
        </div>

        <div className="flex items-start justify-between">
          <span className="text-sm font-medium text-muted-foreground">Path</span>
          <div className="flex items-center gap-1 text-sm font-mono text-right">
            <Folder className="h-3 w-3 flex-shrink-0" />
            <span className="break-all">{issue.relativePath}</span>
          </div>
        </div>

        {issue.frontmatter.priority && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Priority</span>
            <Badge variant="outline" className={`text-xs ${getPriorityColor(issue.frontmatter.priority)}`}>
              {getPriorityIcon(issue.frontmatter.priority)}
              <span className="ml-1">{issue.frontmatter.priority}</span>
            </Badge>
          </div>
        )}

        {issue.frontmatter.status && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Badge variant="secondary" className="text-xs">
              {issue.frontmatter.status}
            </Badge>
          </div>
        )}

        {issue.frontmatter.assignee && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Assignee</span>
            <div className="flex items-center gap-1 text-sm">
              <User className="h-3 w-3" />
              {issue.frontmatter.assignee}
            </div>
          </div>
        )}

        {issue.frontmatter.createdBy && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Created By</span>
            <div className="flex items-center gap-1 text-sm">
              <User className="h-3 w-3" />
              {issue.frontmatter.createdBy}
            </div>
          </div>
        )}

        {issue.createdAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Created</span>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3" />
              {formatDate(issue.createdAt)}
            </div>
          </div>
        )}

        {issue.updatedAt && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Updated</span>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3" />
              {formatDate(issue.updatedAt)}
            </div>
          </div>
        )}

        {issue.frontmatter.labels && Array.isArray(issue.frontmatter.labels) && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">Labels</span>
            <div className="flex flex-wrap gap-1">
              {issue.frontmatter.labels.map((label: string) => (
                <Badge key={label} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {Object.entries(issue.frontmatter)
          .filter(
            ([key]) =>
              !["priority", "status", "assignee", "createdBy", "labels", "column", "createdAt", "updatedAt"].includes(
                key,
              ),
          )
          .map(([key, value]) => (
            <div key={key} className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground flex-shrink-0">{key}</span>
              <div className="text-sm text-right break-words">
                {typeof value === "object" && value !== null ? (
                  <pre className="text-xs bg-muted p-2 rounded whitespace-pre-wrap">{formatValue(value)}</pre>
                ) : (
                  <span>{formatValue(value)}</span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )

  const renderContent = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">{issue.title}</h2>
        {showOpenInNewTab && (
          <Button variant="outline" size="sm" onClick={openInNewTab} className="mb-4 bg-transparent">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in new tab
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-200px)]">
        <div className="prose prose-sm max-w-none">
          {issue.content ? (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{issue.content}</pre>
          ) : (
            <p className="text-muted-foreground italic">No content available</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="h-full">
      {/* Desktop Layout - 2 columns */}
      <div className="hidden md:flex h-full gap-6">
        <div className="flex-1" style={{ width: "70%" }}>
          {renderContent()}
        </div>
        <div className="w-80 border-l pl-6">
          <h3 className="text-lg font-semibold mb-4">Details</h3>
          <ScrollArea className="h-[calc(100vh-200px)]">{renderMetadata()}</ScrollArea>
        </div>
      </div>

      {/* Mobile Layout - Tabs */}
      <div className="md:hidden h-full">
        <Tabs defaultValue="content" className="h-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="h-[calc(100%-60px)]">
            {renderContent()}
          </TabsContent>

          <TabsContent value="metadata" className="h-[calc(100%-60px)]">
            <ScrollArea className="h-full">{renderMetadata()}</ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
