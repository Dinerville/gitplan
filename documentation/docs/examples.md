---
sidebar_position: 6
---

# Examples

This page provides complete examples of GitPlan projects for different use cases. Each example includes the directory structure, view.json configuration, and sample markdown files.

## Personal Goals Management

### 📋 Personal Goals Board

A GTD-style (Getting Things Done) board for managing personal goals and tasks.

**Use Case**: Individual productivity, personal development tracking, habit formation, and goal achievement.

#### Directory Structure

```
my-goals/
├── boards/
│   └── goals/
│       └── view.json
└── issues/
    └── personal-goals/
        ├── learn-spanish.md
        ├── read-24-books.md
        ├── home-gym-setup.md
        └── meditation-practice.md
```

#### Board Configuration

```json title="boards/goals/view.json"
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
  "cardFields": ["title", "deadline", "priority"],
  "sortBy": "priority"
}
```

#### Sample Issue

```markdown title="issues/personal-goals/learn-spanish.md"
---
title: Learn Spanish
status: next
priority: high
deadline: 2024-12-31
category: education
estimate: 40
---

# Learn Spanish

I want to become conversational in Spanish by the end of the year.

## Goals
- Complete Duolingo Spanish course
- Practice speaking with native speakers
- Watch Spanish movies with subtitles

## Progress
- Started Duolingo course
- Completed first 5 lessons

## Next Steps
- Schedule weekly conversation practice
- Set daily 30-minute study routine
```

## Software Development Project

### 💻 Web Development Board

A comprehensive board for managing software development tasks with multiple workflow stages.

**Use Case**: Software development teams, feature tracking, bug management, and release planning.

#### Directory Structure

```
web-project/
├── boards/
│   └── web-development.view.json
└── issues/
    └── web-development/
        ├── user-authentication.md
        ├── responsive-dashboard.md
        ├── api-documentation.md
        ├── database-optimization.md
        └── security-audit.md
```

#### Board Configuration

```json title="boards/web-development.view.json"
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

#### Sample Feature Issue

```markdown title="issues/web-development/user-authentication.md"
---
title: User Authentication System
status: in-progress
priority: high
assignedTo: john.doe
category: feature
estimate: 16
sprint: sprint-23
epic: user-management
---

# User Authentication System

Implement secure user authentication with JWT tokens and role-based access control.

## Requirements

- [ ] User registration endpoint
- [ ] Login/logout functionality  
- [ ] Password reset flow
- [ ] JWT token management
- [ ] Role-based access control
- [ ] Session management

## Acceptance Criteria

- Users can register with email and password
- Passwords are securely hashed using bcrypt
- JWT tokens expire after 24 hours
- Refresh token mechanism is implemented
- Admin users have elevated permissions

## Technical Notes

### Authentication Flow
1. User submits credentials
2. Server validates against database
3. JWT token generated and returned
4. Client stores token for subsequent requests

### Security Considerations
- Implement rate limiting on auth endpoints
- Use HTTPS for all authentication requests
- Store refresh tokens securely
- Implement proper session invalidation

## API Endpoints

```javascript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/reset-password
```

## Dependencies

- bcrypt for password hashing
- jsonwebtoken for JWT handling
- express-rate-limit for rate limiting

## Testing

- [ ] Unit tests for auth service
- [ ] Integration tests for endpoints
- [ ] Security testing for vulnerabilities
- [ ] Load testing for performance
```

## Marketing Campaign Management

### 📢 Marketing Campaign Board

Track marketing campaigns, content creation, and promotional activities across multiple channels.

**Use Case**: Marketing teams, content planning, campaign tracking, and cross-channel coordination.

#### Directory Structure

```
marketing/
├── boards/
│   └── marketing-campaign.view.json
└── issues/
    └── marketing-campaign/
        ├── social-media-strategy.md
        ├── blog-content-calendar.md
        ├── email-automation.md
        ├── influencer-outreach.md
        └── product-launch-event.md
```

#### Board Configuration

```json title="boards/marketing-campaign.view.json"
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
  "cardFields": ["title", "deadline", "assignedTo", "channel", "campaign"],
  "sortBy": "deadline"
}
```

#### Sample Marketing Issue

```markdown title="issues/marketing-campaign/social-media-strategy.md"
---
title: Social Media Strategy for Q2
status: planning
priority: high
assignedTo: sarah
deadline: 2024-04-01
channel: social
campaign: q2-2024
---

# Social Media Strategy for Q2

Develop comprehensive social media strategy for Q2 product launch.

## Objectives
- Increase brand awareness by 30%
- Generate 500 qualified leads
- Boost engagement rate to 5%

## Platforms
- LinkedIn (B2B focus)
- Twitter (thought leadership)
- Instagram (visual content)

## Content Calendar
- Week 1: Product teasers
- Week 2: Behind-the-scenes content
- Week 3: Customer testimonials
- Week 4: Launch announcement

## Metrics to Track
- Reach and impressions
- Engagement rate
- Click-through rate
- Lead generation
```

## Event Planning

### 🎉 Event Planning Board

Organize conferences, workshops, or team events with detailed task tracking.

**Use Case**: Event organizers, conference planning, workshop coordination, and team building activities.

#### Directory Structure

```
conference-2024/
├── boards/
│   └── event-planning.view.json
└── issues/
    └── conference-planning/
        ├── venue-booking.md
        ├── speaker-outreach.md
        ├── catering-arrangements.md
        ├── av-equipment-setup.md
        └── registration-system.md
```

#### Board Configuration

```json title="boards/event-planning.view.json"
{
  "name": "Conference 2024",
  "path": "conference-planning",
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
      "name": "Confirmed",
      "color": "#10b981",
      "filters": {
        "status": "confirmed"
      }
    },
    {
      "name": "Completed",
      "color": "#059669",
      "filters": {
        "status": "completed"
      }
    }
  ],
  "boardFilters": {
    "category": ["venue", "speakers", "logistics", "marketing"],
    "priority": ["critical", "high", "medium", "low"]
  },
  "cardFields": ["title", "deadline", "assignedTo", "category", "budget"],
  "sortBy": "deadline"
}
```

## Getting Started Templates

### Quick Setup Commands

Use these commands to quickly set up any of the example projects:

```bash
# Create project directory
mkdir my-gitplan-project
cd my-gitplan-project

# Initialize GitPlan with demo content
gitplan init

# Start the server
gitplan start

# Open browser to http://localhost:3057
```

### Customization Tips

- **Adapt status values**: Modify the status values in both view.json and markdown files to match your workflow
- **Add custom fields**: Include additional frontmatter fields relevant to your use case
- **Adjust colors**: Choose colors that match your brand or preferences
- **Create multiple boards**: Set up different boards for different projects or teams

## Best Practices from Examples

### Naming Conventions

- Use descriptive, kebab-case file names
- Organize issues in directories that match board paths
- Keep board names clear and project-specific

### Status Workflows

- **Simple workflow**: `todo` → `in-progress` → `completed`
- **Review workflow**: `todo` → `in-progress` → `review` → `completed`
- **GTD workflow**: `someday` → `next` → `waiting` → `completed`

### Field Selection

- Include only essential fields in cardFields to avoid clutter
- Use priority and deadline for time-sensitive projects
- Add assignedTo for team collaboration
- Include category or tags for better organization

## Multi-Board Project Example

### Complex Project Structure

For larger projects, you might have multiple boards:

```
enterprise-project/
├── boards/
│   ├── development.view.json
│   ├── marketing.view.json
│   ├── operations.view.json
│   └── leadership/
│       └── view.json
└── issues/
    ├── development/
    │   ├── frontend/
    │   │   ├── user-interface.md
    │   │   └── responsive-design.md
    │   └── backend/
    │       ├── api-development.md
    │       └── database-design.md
    ├── marketing/
    │   ├── campaigns/
    │   │   ├── social-media.md
    │   │   └── email-marketing.md
    │   └── content/
    │       ├── blog-posts.md
    │       └── case-studies.md
    └── operations/
        ├── infrastructure.md
        ├── monitoring.md
        └── security.md
```

### Cross-Board Issue Linking

Link related issues across boards using custom fields:

```markdown
---
title: API Development
status: in-progress
priority: high
assignedTo: backend-team
relatedIssues: ["marketing/api-documentation", "operations/api-monitoring"]
dependencies: ["database-design"]
---
```

## Integration Examples

### Git Integration

Use GitPlan with Git workflows:

```bash
# Create feature branch for new issues
git checkout -b feature/user-authentication

# Edit issues and board configurations
# Commit changes
git add .
git commit -m "Add user authentication requirements"

# Push and create pull request
git push origin feature/user-authentication
```

### CI/CD Integration

Automate board updates with CI/CD:

```yaml title=".github/workflows/update-boards.yml"
name: Update GitPlan Boards
on:
  push:
    paths:
      - 'issues/**'
      - 'boards/**'

jobs:
  update-boards:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitPlan Server
        run: |
          # Deploy updated boards to production
          rsync -av boards/ issues/ server:/path/to/gitplan/
```

## Advanced Configuration Examples

### Dynamic Filtering

Create boards that filter by multiple criteria:

```json
{
  "name": "Sprint Board",
  "path": "development",
  "columns": [
    {
      "name": "Sprint Backlog",
      "color": "#6b7280",
      "filters": {
        "status": ["todo", "backlog"],
        "sprint": "current-sprint"
      }
    },
    {
      "name": "In Progress",
      "color": "#f59e0b",
      "filters": {
        "status": "in-progress",
        "sprint": "current-sprint"
      }
    }
  ],
  "boardFilters": {
    "sprint": ["current-sprint"],
    "assignedTo": ["team-member-1", "team-member-2"]
  }
}
```

### Custom Field Examples

Use custom fields for specific workflows:

```markdown
---
title: Database Migration
status: planning
priority: high
assignedTo: database-team
estimate: 8
complexity: high
riskLevel: medium
stakeholders: ["product-team", "ops-team"]
rollbackPlan: "migration-rollback.md"
testingRequired: true
---
```

## Troubleshooting Examples

### Common Configuration Issues

**Issue**: Board not showing issues

```json
// Problem: Status values don't match
{
  "filters": {
    "status": "in-progress"  // Board expects "in-progress"
  }
}
```

```markdown
<!-- But markdown file has: -->
---
status: "in_progress"  <!-- Uses underscore instead of hyphen -->
---
```

**Solution**: Ensure consistent status values across all files.

**Issue**: Issues appearing in wrong columns

```json
// Problem: Overlapping filters
{
  "columns": [
    {
      "name": "To Do",
      "filters": { "status": ["todo", "backlog"] }
    },
    {
      "name": "Backlog", 
      "filters": { "status": "backlog" }  // This will never show issues
    }
  ]
}
```

**Solution**: Make column filters mutually exclusive.

### Testing Your Configuration

Create a test issue to verify your setup:

```markdown title="test-issue.md"
---
title: Test Issue
status: todo
priority: high
assignedTo: test-user
category: test
---

# Test Issue

This issue is used to test board configuration.
```

Then check:
1. Does it appear on the board?
2. Is it in the correct column?
3. Are all metadata fields displayed correctly?

## Next Steps

Ready to start your GitPlan journey? Here's what to do next:

1. **[Install GitPlan](./cli-commands#installation)** - Get the CLI tool set up
2. **[Initialize a Project](./cli-commands#gitplan-init)** - Start with demo content
3. **[Customize Your Boards](./view-json-guide)** - Adapt to your workflow
4. **[Create Your Issues](./markdown-guide)** - Write your first tasks
5. **[Explore the UI](./ui-features)** - Learn the web interface

Have questions? Check out the other documentation sections or refer back to these examples as you build your own GitPlan projects!
