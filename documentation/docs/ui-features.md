---
sidebar_position: 5
---

# UI Features

GitPlan provides a modern web interface for managing your Kanban boards. The interface is built with Next.js and React, offering a responsive and intuitive experience for project management.

## Overview

The GitPlan web interface transforms your markdown files and JSON configurations into interactive Kanban boards. Access your boards at `http://localhost:3057` when running the development server.

## Board Management

### Board Overview

The main dashboard displays all your boards in an organized layout:

- **Grid View**: Visual cards showing board names and issue counts
- **Search Functionality**: Quickly find boards by name
- **Quick Navigation**: One-click access to any board
- **Real-time Updates**: Automatic refresh when files change

### Board Search

Use the search functionality to quickly locate specific boards:

- **Real-time Filtering**: Results update as you type
- **Keyboard Navigation**: Use arrow keys to navigate results
- **Quick Access**: Press Enter to open the selected board

## Kanban Board Interface

### Column Management

Columns are automatically generated based on your view.json configuration:

- **Color-coded Headers**: Each column displays with its configured color
- **Issue Counts**: Shows the number of issues in each column
- **Responsive Layout**: Adapts to different screen sizes
- **Horizontal Scrolling**: On mobile devices for easy navigation

### Column Filtering

Issues are automatically organized into columns based on their metadata:

- **Status-based Filtering**: Primary organization by status field
- **Multi-field Filtering**: Support for complex filter combinations
- **Real-time Updates**: Changes reflect immediately when files are modified

## Issue Cards

### Card Display

Issue cards show configurable metadata fields for quick reference:

- **Title and Description**: Primary issue information
- **Priority Indicators**: Visual priority levels with color coding
- **Assignment Information**: Shows who's responsible for the issue
- **Due Dates**: Deadline information with urgency indicators
- **Category Badges**: Visual tags for issue categorization
- **Custom Fields**: Any additional frontmatter fields you configure

### Card Interactions

Click on cards to access detailed information and editing capabilities:

- **Full Issue View**: Complete markdown content with proper rendering
- **Metadata Editing**: Update issue properties directly in the UI
- **Status Changes**: Move issues between columns by changing status
- **Quick Actions**: Common operations accessible via context menus

## Issue Detail View

### Content Display

The issue detail view provides comprehensive information:

- **Markdown Rendering**: Full markdown content with syntax highlighting
- **Metadata Panel**: All frontmatter fields displayed in an organized layout
- **File Information**: Shows filename, path, and last modified date
- **Navigation Controls**: Easy movement between related issues

### Editing Capabilities

Make changes directly through the web interface:

- **Inline Editing**: Update metadata fields without leaving the interface
- **Status Updates**: Change issue status to move between columns
- **Priority Adjustments**: Modify priority levels with visual feedback
- **Assignment Changes**: Reassign issues to different team members

:::tip Pro Tip
Changes made in the UI are automatically saved back to your markdown files, keeping your Git repository in sync.
:::

## Responsive Design

### Desktop Experience

Optimized for productivity on larger screens:

- **Full-width Layout**: Maximum use of available screen space
- **Multiple Columns**: View several columns simultaneously
- **Sidebar Navigation**: Persistent navigation for quick board switching
- **Keyboard Shortcuts**: Efficient navigation and actions

### Mobile Experience

Touch-friendly interface for on-the-go access:

- **Touch Interactions**: Optimized for finger navigation
- **Horizontal Scrolling**: Swipe between columns easily
- **Collapsible Navigation**: More screen space for content
- **Optimized Card Layouts**: Readable on small screens

### Tablet Experience

Balanced experience for medium-sized screens:

- **Adaptive Columns**: Intelligent column sizing based on screen width
- **Touch and Mouse Support**: Works with both input methods
- **Portrait/Landscape**: Optimized for both orientations

## Navigation Features

### Board Navigation

Easy switching between different project boards:

- **Board Selector**: Dropdown menu with all available boards
- **Breadcrumb Navigation**: Clear indication of current location
- **Recent Boards**: Quick access to recently viewed boards
- **Favorites**: Pin frequently used boards for easy access

### URL Routing

Direct links to specific boards and issues:

- **Shareable URLs**: Send direct links to specific boards
- **Deep Linking**: Link directly to individual issues
- **Browser Support**: Full back/forward button support
- **Bookmarkable**: Save specific views as browser bookmarks

## Performance Features

### Loading and Caching

Optimized for fast, responsive performance:

- **Fast Initial Load**: Minimized bundle size and optimized loading
- **Progressive Loading**: Load boards and issues on demand
- **Client-side Caching**: Reduce server requests for better performance
- **Real-time Updates**: Automatic refresh when files change on disk

### Error Handling

Graceful handling of various error conditions:

- **Missing Files**: Clear messaging when files are not found
- **Invalid Configurations**: Helpful error messages for JSON issues
- **Network Errors**: Retry mechanisms for failed requests
- **Graceful Degradation**: Partial functionality when some features fail

## API Integration

The UI communicates with GitPlan's REST API for all data operations:

### Board Operations

```bash
GET /api/boards                    # List all boards
GET /api/boards/:boardId           # Get board details
GET /api/boards/:boardId/kanban    # Get Kanban board data
```

### Issue Operations

```bash
GET /api/boards/:boardId/issues              # List board issues
GET /api/boards/:boardId/issues/:issueId     # Get issue details
PATCH /api/boards/:boardId/issues/:issueId   # Update issue metadata
```

## Keyboard Shortcuts

GitPlan supports keyboard shortcuts for efficient navigation:

### Navigation Shortcuts

- `Ctrl/Cmd + K` - Open quick search
- `Esc` - Close modals and dialogs
- `←/→` - Navigate between boards
- `↑/↓` - Navigate between issues in a column

### Board Actions

- `R` - Refresh board data
- `F` - Toggle fullscreen mode
- `?` - Show keyboard shortcuts help
- `Ctrl/Cmd + /` - Toggle search

## Accessibility Features

### Screen Reader Support

Built with accessibility in mind:

- **Semantic HTML**: Proper HTML structure for screen readers
- **ARIA Labels**: Descriptive labels for interactive elements
- **Keyboard Navigation**: Full functionality without mouse
- **Focus Management**: Logical focus order and visual indicators

### Visual Accessibility

Designed for users with visual impairments:

- **High Contrast**: Clear visual distinction between elements
- **Scalable Text**: Respects browser zoom and font size settings
- **Color-blind Friendly**: Doesn't rely solely on color for information
- **Clear Hierarchy**: Logical visual organization of content

## Browser Compatibility

GitPlan's web interface works with modern browsers:

### Supported Browsers

- **Chrome 90+**: Full feature support
- **Firefox 88+**: Full feature support
- **Safari 14+**: Full feature support
- **Edge 90+**: Full feature support

### Technologies Used

- **ES2020 JavaScript**: Modern JavaScript features
- **CSS Grid and Flexbox**: Advanced layout capabilities
- **Fetch API**: Modern HTTP requests
- **Local Storage**: Client-side data persistence

## Customization Options

### Theme Support

Choose from multiple visual themes:

- **Light Theme**: Clean, bright interface (default)
- **Dark Theme**: Reduced eye strain for low-light environments
- **System Theme**: Automatically follows system preferences
- **High Contrast**: Enhanced visibility for accessibility

### Layout Options

Adjust the interface to your preferences:

- **Compact Mode**: Smaller cards and reduced spacing
- **Comfortable Mode**: Standard spacing and sizing (default)
- **Spacious Mode**: Larger cards with more whitespace

:::info Customization Tip
User preferences are saved in browser local storage and persist across sessions.
:::

## Development Mode

When running GitPlan in development mode, additional features are available:

### Debug Information

Enhanced debugging capabilities:

- **API Logging**: Request/response information in console
- **Component Info**: React component render information
- **Performance Metrics**: Loading times and performance data
- **Error Details**: Detailed error messages and stack traces

### Hot Reload

Live development features:

- **File Watching**: Automatic refresh when markdown files change
- **Config Updates**: Live updates when view.json files are modified
- **UI Updates**: Real-time interface updates during development

## Troubleshooting UI Issues

### Common Problems

**Blank screen or loading issues**
- Check browser console for JavaScript errors
- Verify the GitPlan server is running
- Clear browser cache and reload

**Issues not loading or displaying incorrectly**
- Verify markdown files exist and have valid frontmatter
- Check that view.json configuration is correct
- Ensure file paths match between issues and board configuration

**Columns not showing or empty**
- Verify view.json syntax is valid
- Check that column filters match issue status values
- Restart the GitPlan server after configuration changes

**Slow performance**
- Clear browser cache
- Check for very large markdown files
- Verify network connectivity to the server

### Browser Developer Tools

Use browser tools for debugging:

- **Network Tab**: Check API requests and responses
- **Console Tab**: View JavaScript errors and debug logs
- **Application Tab**: Inspect local storage data
- **Elements Tab**: Examine HTML structure and CSS

### Debug Mode

Enable additional debugging information:

Add `?debug=true` to the URL to enable verbose console logging and additional debugging information.

## Advanced Features

### Bulk Operations

Perform actions on multiple issues:

- **Multi-select**: Select multiple issues with checkboxes
- **Bulk Status Changes**: Update status for multiple issues
- **Batch Assignment**: Assign multiple issues to team members

### Filtering and Search

Advanced filtering capabilities:

- **Global Search**: Search across all issues and boards
- **Advanced Filters**: Filter by multiple criteria simultaneously
- **Saved Filters**: Save frequently used filter combinations
- **Quick Filters**: One-click common filter presets

### Export and Import

Data portability features:

- **Export Boards**: Download board data in various formats
- **Import Issues**: Bulk import from CSV or JSON
- **Backup Data**: Export complete project data
- **Print Views**: Print-friendly board layouts

## Next Steps

Now that you understand the UI features, explore:

- **[Examples](./examples)** - See complete project setups
- **[CLI Commands](./cli-commands)** - Learn about command-line tools
- **[Markdown Guide](./markdown-guide)** - Master issue creation
