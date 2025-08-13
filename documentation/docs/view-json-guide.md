---
sidebar_position: 4
---

# View.json Configuration Guide

View.json files define the structure and configuration of your GitPlan Kanban boards. They specify columns, filters, display options, and how issues are organized and presented.

## File Location and Naming

View.json files should be placed in the `boards/` directory with these naming conventions:

```
boards/
├── project-name.view.json          # Single file approach
├── project-name/                   # Directory approach
│   └── view.json
└── another-board.view.json
```

## Basic Structure

Here's the basic structure of a view.json file:

```json
{
  "name": "Board Name",
  "path": "board-path",
  "columns": [
    {
      "name": "Column Name",
      "color": "#3b82f6",
      "filters": {
        "status": "column-status"
      }
    }
  ],
  "boardFilters": {},
  "cardFields": ["title", "priority", "assignedTo"],
  "sortBy": "priority"
}
```

## Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Display name of the board |
| `path` | String | Yes | Path to the issues directory (relative to issues/) |
| `columns` | Array | Yes | Array of column configurations |
| `boardFilters` | Object | No | Global filters applied to all issues |
| `cardFields` | Array | No | Fields to display on issue cards |
| `sortBy` | String | No | Field to sort issues by within columns |

## Column Configuration

Each column in the `columns` array has the following structure:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Display name of the column |
| `color` | String | Yes | Hex color code for the column header |
| `filters` | Object | Yes | Filters that determine which issues appear in this column |

## Complete Example

Here's a complete example of a view.json file for a personal goals board:

```json
{
  "name": "Personal Goals",
  "path": "personal-goals",
  "columns": [
    {
      "name": "Someday/Maybe",
      "color": "#6b7280",
      "filters": {
        "status": "someday"
      }
    },
    {
      "name": "Next Actions",
      "color": "#3b82f6",
      "filters": {
        "status": "next"
      }
    },
    {
      "name": "Waiting For",
      "color": "#f59e0b",
      "filters": {
        "status": "waiting"
      }
    },
    {
      "name": "Completed",
      "color": "#10b981",
      "filters": {
        "status": "completed"
      }
    }
  ],
  "boardFilters": {
    "priority": ["high", "medium", "low"]
  },
  "cardFields": ["title", "deadline", "assignedTo"],
  "sortBy": "priority"
}
```

## Filter Configuration

### Column Filters

Column filters determine which issues appear in each column. You can filter by any frontmatter field:

```json
{
  "name": "In Progress",
  "color": "#f59e0b",
  "filters": {
    "status": "in-progress",
    "priority": ["high", "medium"],
    "assignedTo": "john"
  }
}
```

### Board Filters

Board filters apply globally to all issues before they're distributed to columns:

```json
{
  "boardFilters": {
    "category": ["bug", "feature"],
    "priority": ["high", "medium", "low"],
    "tags": ["frontend", "backend"]
  }
}
```

## Color Options

Common color choices for columns:

| Color | Hex Code | Usage |
|-------|----------|-------|
| Gray | `#6b7280` | Someday/Maybe, Backlog |
| Blue | `#3b82f6` | To Do, Next Actions |
| Orange | `#f59e0b` | In Progress, Waiting |
| Green | `#10b981` | Completed, Done |
| Purple | `#8b5cf6` | Review, Testing |
| Red | `#ef4444` | Blocked, Critical |

## Card Fields

The `cardFields` array determines which frontmatter fields are displayed on issue cards:

```json
{
  "cardFields": ["title", "priority", "assignedTo", "deadline", "estimate"]
}
```

Available card fields include any frontmatter field from your markdown files:

- `title` - Issue title (always shown)
- `priority` - Priority level
- `assignedTo` - Assigned person
- `deadline` - Due date
- `estimate` - Time estimate
- `category` - Issue category
- `tags` - Issue tags

## Sorting Options

The `sortBy` field determines how issues are ordered within columns:

| Sort Field | Description | Order |
|------------|-------------|-------|
| `priority` | Sort by priority level | high → medium → low |
| `deadline` | Sort by due date | earliest → latest |
| `title` | Sort alphabetically by title | A → Z |
| `assignedTo` | Sort by assigned person | A → Z |
| `estimate` | Sort by time estimate | lowest → highest |

## Advanced Examples

### Software Development Board

```json
{
  "name": "Web Development",
  "path": "web-development",
  "columns": [
    {
      "name": "Backlog",
      "color": "#6b7280",
      "filters": {
        "status": "backlog"
      }
    },
    {
      "name": "To Do",
      "color": "#3b82f6",
      "filters": {
        "status": "todo"
      }
    },
    {
      "name": "In Progress",
      "color": "#f59e0b",
      "filters": {
        "status": "in-progress"
      }
    },
    {
      "name": "Review",
      "color": "#8b5cf6",
      "filters": {
        "status": "review"
      }
    },
    {
      "name": "Testing",
      "color": "#06b6d4",
      "filters": {
        "status": "testing"
      }
    },
    {
      "name": "Done",
      "color": "#10b981",
      "filters": {
        "status": "completed"
      }
    }
  ],
  "boardFilters": {
    "category": ["feature", "bug", "enhancement"],
    "priority": ["urgent", "high", "medium", "low"]
  },
  "cardFields": ["title", "priority", "assignedTo", "estimate", "category"],
  "sortBy": "priority"
}
```

### Marketing Campaign Board

```json
{
  "name": "Marketing Campaign",
  "path": "marketing-campaign",
  "columns": [
    {
      "name": "Ideas",
      "color": "#6b7280",
      "filters": {
        "status": "idea"
      }
    },
    {
      "name": "Planning",
      "color": "#3b82f6",
      "filters": {
        "status": "planning"
      }
    },
    {
      "name": "In Progress",
      "color": "#f59e0b",
      "filters": {
        "status": "in-progress"
      }
    },
    {
      "name": "Review",
      "color": "#8b5cf6",
      "filters": {
        "status": "review"
      }
    },
    {
      "name": "Published",
      "color": "#10b981",
      "filters": {
        "status": "published"
      }
    }
  ],
  "boardFilters": {
    "campaign": ["q1-2024", "q2-2024"],
    "channel": ["social", "email", "blog", "ads"]
  },
  "cardFields": ["title", "deadline", "assignedTo", "channel"],
  "sortBy": "deadline"
}
```

## Best Practices

### Naming Conventions

- Use descriptive board names that clearly identify the project
- Keep column names concise but clear
- Use consistent status values across your organization
- Match the `path` field to your issues directory structure

### Color Guidelines

- Use a consistent color scheme across boards
- Reserve red colors for urgent or blocked items
- Use green for completed/successful states
- Consider accessibility when choosing colors

### Filter Strategy

- Keep column filters simple and mutually exclusive
- Use board filters to focus on specific subsets of issues
- Consider using arrays for multi-value filters
- Test your filters with sample data

## Filter Examples

### Single Value Filters

```json
{
  "filters": {
    "status": "in-progress",
    "assignedTo": "john",
    "priority": "high"
  }
}
```

### Multi-Value Filters

```json
{
  "filters": {
    "status": ["todo", "in-progress"],
    "category": ["bug", "feature"],
    "tags": ["frontend", "backend"]
  }
}
```

### Complex Filters

```json
{
  "filters": {
    "status": "in-progress",
    "priority": ["high", "urgent"],
    "assignedTo": ["john", "sarah"],
    "category": "feature"
  }
}
```

## Validation and Testing

### JSON Validation

Always validate your JSON syntax:

```bash
# Using jq (if installed)
cat boards/my-board.view.json | jq .

# Using Node.js
node -e "console.log(JSON.parse(require('fs').readFileSync('boards/my-board.view.json')))"
```

### Testing Filters

Create test markdown files to verify your filters work correctly:

```markdown
---
title: "Test Issue"
status: "in-progress"
priority: "high"
assignedTo: "john"
category: "feature"
---

# Test Issue

This is a test issue to verify board configuration.
```

## Troubleshooting

### Common Issues

**Board not appearing**
- Check that the view.json file is in the correct location
- Verify JSON syntax is valid
- Ensure all required fields are present

**No issues in columns**
- Verify that your filter values match the frontmatter in your markdown files
- Check for typos in status values
- Ensure consistent casing (lowercase recommended)

**Issues in wrong columns**
- Check that status values in markdown files match column filters exactly
- Verify filter logic is correct
- Test with simple single-value filters first

**Colors not showing**
- Ensure color codes are valid hex values starting with #
- Use 6-digit hex codes (e.g., #3b82f6, not #3bf)
- Test colors for accessibility and contrast

### Debug Tips

1. **Start Simple**: Begin with basic status-only filters
2. **Test Incrementally**: Add one filter at a time
3. **Use Consistent Values**: Standardize status and priority values
4. **Check File Paths**: Ensure the `path` field matches your issues directory
5. **Validate JSON**: Use online JSON validators for syntax checking

### Validation Tools

- [JSONLint](https://jsonlint.com/) - JSON syntax validator
- [JSON Schema Validator](https://www.jsonschemavalidator.net/) - Advanced validation
- Browser Developer Tools - Check for JavaScript errors

## Schema Reference

Here's a complete JSON schema for view.json files:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "path", "columns"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Display name of the board"
    },
    "path": {
      "type": "string",
      "description": "Path to issues directory"
    },
    "columns": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "color", "filters"],
        "properties": {
          "name": { "type": "string" },
          "color": { 
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
          },
          "filters": { "type": "object" }
        }
      }
    },
    "boardFilters": { "type": "object" },
    "cardFields": {
      "type": "array",
      "items": { "type": "string" }
    },
    "sortBy": { "type": "string" }
  }
}
```

## Next Steps

Now that you understand view.json configuration, explore:

- **[UI Features](./ui-features)** - Learn about the web interface
- **[Examples](./examples)** - See complete project setups
- **[Markdown Guide](./markdown-guide)** - Create issues that work with your boards
