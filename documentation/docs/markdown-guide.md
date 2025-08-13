---
sidebar_position: 3
---

# Markdown Guide

GitPlan uses markdown files with frontmatter to represent issues and tasks. This guide shows you how to structure your markdown files for optimal use with GitPlan's Kanban boards.

## File Structure

Every GitPlan issue is a markdown file with two parts:

1. **Frontmatter** - YAML metadata at the top
2. **Content** - Markdown content below

```markdown
---
title: Issue Title
status: todo
priority: high
assignedTo: john
---

# Issue Title

Your markdown content goes here...
```

## Frontmatter Fields

Frontmatter contains metadata that GitPlan uses to organize and display issues on your Kanban boards.

### Required Fields

#### `title`
The display name of the issue.

```yaml
title: "Implement user authentication"
```

#### `status`
Determines which column the issue appears in on your Kanban board.

```yaml
status: "in-progress"
```

Common status values:
- `todo` - To Do
- `in-progress` - In Progress  
- `review` - Under Review
- `testing` - Testing
- `completed` - Done
- `blocked` - Blocked

### Optional Fields

#### `priority`
Indicates the importance or urgency of the issue.

```yaml
priority: "high"
```

Common priority values:
- `urgent` - Critical, needs immediate attention
- `high` - Important, should be done soon
- `medium` - Normal priority
- `low` - Nice to have

#### `assignedTo`
Person responsible for the issue.

```yaml
assignedTo: "john"
# or
assignedTo: "john.doe@company.com"
```

#### `deadline`
Due date for the issue.

```yaml
deadline: "2024-12-31"
# or
deadline: "2024-03-15T10:00:00Z"
```

#### `estimate`
Time estimate in hours or story points.

```yaml
estimate: 8
# or
estimate: "3 days"
```

#### `category`
Type or category of the issue.

```yaml
category: "feature"
```

Common categories:
- `feature` - New functionality
- `bug` - Bug fix
- `enhancement` - Improvement
- `documentation` - Documentation update
- `maintenance` - Technical maintenance

#### `tags`
Array of labels for the issue.

```yaml
tags: ["frontend", "authentication", "security"]
```

#### `epic`
Parent epic or project this issue belongs to.

```yaml
epic: "user-management"
```

#### `sprint`
Sprint or iteration identifier.

```yaml
sprint: "sprint-23"
```

### Custom Fields

You can add any custom fields you need:

```yaml
---
title: "Design new homepage"
status: "in-progress"
designer: "sarah"
mockupUrl: "https://figma.com/mockup-123"
stakeholder: "marketing-team"
budget: 5000
---
```

## Complete Example

Here's a comprehensive example of a well-structured issue:

```markdown
---
title: "Implement user authentication system"
status: "in-progress"
priority: "high"
assignedTo: "john.doe"
deadline: "2024-04-15"
estimate: 16
category: "feature"
tags: ["backend", "security", "authentication"]
epic: "user-management"
sprint: "sprint-23"
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

## Resources

- [JWT Best Practices](https://example.com)
- [OWASP Authentication Guide](https://example.com)
```

## File Organization

### Directory Structure

Organize your markdown files in directories that match your board configurations:

```
issues/
├── web-development/
│   ├── user-authentication.md
│   ├── responsive-dashboard.md
│   └── api-documentation.md
├── marketing-campaign/
│   ├── social-media-strategy.md
│   ├── blog-content-calendar.md
│   └── email-automation.md
└── personal-goals/
    ├── learn-spanish.md
    ├── read-24-books.md
    └── home-gym-setup.md
```

### File Naming

Use descriptive, kebab-case file names:

✅ **Good**
- `user-authentication.md`
- `responsive-dashboard.md`
- `social-media-strategy.md`

❌ **Avoid**
- `task1.md`
- `User Authentication.md`
- `userAuth.md`

## Issue Templates

### Bug Report Template

```markdown
---
title: "Bug: [Brief description]"
status: "todo"
priority: "medium"
category: "bug"
assignedTo: ""
tags: ["bug"]
---

# Bug: [Brief description]

## Description
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

## Additional Context
Any other context about the problem.
```

### Feature Request Template

```markdown
---
title: "Feature: [Brief description]"
status: "todo"
priority: "medium"
category: "feature"
assignedTo: ""
estimate: 0
tags: ["feature"]
---

# Feature: [Brief description]

## Problem Statement
What problem does this feature solve?

## Proposed Solution
Describe your solution to the problem.

## User Stories
- As a [user type], I want [goal] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Requirements
- Technical consideration 1
- Technical consideration 2

## Design Mockups
Link to design files or embed images.

## Dependencies
List any dependencies or prerequisites.
```

### Task Template

```markdown
---
title: "[Task description]"
status: "todo"
priority: "medium"
assignedTo: ""
estimate: 0
category: "task"
---

# [Task description]

## Objective
What needs to be accomplished?

## Steps
1. Step 1
2. Step 2
3. Step 3

## Definition of Done
- [ ] Requirement 1 met
- [ ] Requirement 2 met
- [ ] Testing completed
- [ ] Documentation updated

## Notes
Any additional information or context.
```

## Best Practices

### Frontmatter Guidelines

1. **Be Consistent**: Use the same field names across all issues
2. **Use Standard Values**: Stick to common status and priority values
3. **Keep It Simple**: Don't over-complicate with too many custom fields
4. **Quote Strings**: Always quote string values in YAML

### Content Guidelines

1. **Clear Titles**: Make titles descriptive and actionable
2. **Use Checklists**: Break down work into checkable items
3. **Add Context**: Include background information and links
4. **Update Regularly**: Keep issues current as work progresses

### Organization Tips

1. **Match Directory Structure**: Align with your view.json board paths
2. **Use Consistent Naming**: Follow kebab-case for file names
3. **Group Related Issues**: Keep similar issues in the same directory
4. **Archive Completed Work**: Move or archive old completed issues

## Markdown Features

GitPlan supports full Markdown syntax including:

### Code Blocks

```javascript
function authenticate(user) {
  return jwt.sign({ id: user.id }, secret);
}
```

### Tables

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Issue title |
| status | string | Yes | Current status |
| priority | string | No | Priority level |

### Links and Images

```markdown
[Documentation](https://example.com)
![Screenshot](./images/screenshot.png)
```

### Task Lists

```markdown
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task
```

## Troubleshooting

### Common Issues

**Issue not appearing on board**
- Check that the status value matches a column filter in your view.json
- Verify the file is in the correct directory path
- Ensure frontmatter YAML is valid

**Incorrect column placement**
- Verify status value matches column filters exactly
- Check for typos in status values
- Ensure consistent casing (lowercase recommended)

**Missing metadata**
- Check YAML syntax in frontmatter
- Ensure proper indentation
- Quote string values that contain special characters

### Validation

Use online YAML validators to check your frontmatter:
- [YAML Lint](http://www.yamllint.com/)
- [Online YAML Parser](https://yaml-online-parser.appspot.com/)

## Next Steps

Now that you understand how to write markdown issues, learn about:

- **[View.json Configuration](./view-json-guide)** - Set up your Kanban boards
- **[UI Features](./ui-features)** - Use the web interface effectively
- **[Examples](./examples)** - See complete project examples
