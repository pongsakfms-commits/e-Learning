# e-Learning Platform - UI Framework Documentation

## Overview
This responsive UI framework is built with Bootstrap 5 and custom CSS to provide a consistent, modern interface for the e-Learning platform. It includes layouts for both learners and administrators with full responsive design support.

## Technology Stack
- **Bootstrap 5.3.2** - Core responsive framework
- **Bootstrap Icons 1.11.1** - Icon library
- **Custom CSS** - Enhanced styling and theming
- **Vanilla JavaScript** - Interactive components

## Color Scheme

### Primary Colors
- **Primary Blue**: `#4A90E2` - Main action color
- **Secondary Green**: `#50C878` - Success and progress
- **Accent Red**: `#FF6B6B` - Highlights and warnings
- **Dark**: `#2C3E50` - Text and headers
- **Light**: `#F8F9FA` - Background

### Semantic Colors
- **Success**: `#28A745`
- **Warning**: `#FFC107`
- **Danger**: `#DC3545`
- **Info**: `#17A2B8`

## Typography
- **Primary Font**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Secondary Font**: Helvetica Neue, Helvetica, Arial, sans-serif
- **Line Height**: 1.6
- **Heading Weights**: 600

## Layout Structure

### Sidebar Navigation
- Fixed width: `250px`
- Collapsible on mobile (< 992px)
- Gradient background from primary to dark
- Smooth transitions and hover effects

### Topbar
- Fixed height: `60px`
- Sticky positioning
- Contains user profile and notifications
- Mobile-responsive with hamburger menu

### Main Content
- Flexible width with left margin for sidebar
- Responsive padding (2rem on desktop, 1rem on mobile)
- Smooth transition when sidebar toggles

## Responsive Breakpoints

```css
/* Mobile First Approach */
- xs: < 576px (phones)
- sm: ≥ 576px (landscape phones)
- md: ≥ 768px (tablets)
- lg: ≥ 992px (desktops)
- xl: ≥ 1200px (large desktops)
```

### Responsive Behavior
- **Desktop (≥ 992px)**: Sidebar always visible, full layout
- **Tablet (768px - 991px)**: Sidebar toggles with overlay
- **Mobile (< 768px)**: Compact layout, hidden sidebar, smaller fonts

## Reusable Components

### 1. Cards

#### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h5 class="mb-0">Title</h5>
  </div>
  <div class="card-body">
    Content here
  </div>
  <div class="card-footer">
    Footer content
  </div>
</div>
```

#### Stats Card
```html
<div class="card stats-card">
  <div class="stats-icon">
    <i class="bi bi-people"></i>
  </div>
  <div class="stats-value">1,245</div>
  <div class="stats-label">Total Users</div>
</div>
```

#### Course Card
```html
<div class="card course-card">
  <img src="image.jpg" alt="Course" class="course-card-image">
  <span class="course-badge">กำลังเรียน</span>
  <div class="card-body">
    <h6>Course Title</h6>
    <p class="text-muted small">Description</p>
    <div class="progress-wrapper">
      <div class="d-flex justify-content-between mb-2">
        <span class="small">Progress</span>
        <span class="small fw-semibold">75%</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 75%"></div>
      </div>
    </div>
  </div>
</div>
```

### 2. Tables

```html
<div class="table-wrapper">
  <table class="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

Features:
- Responsive horizontal scroll
- Hover effects on rows
- Colored header
- Clean borders

### 3. Forms

```html
<div class="form-group">
  <label class="form-label">Label Text</label>
  <input type="text" class="form-control" placeholder="Placeholder">
  <small class="form-text">Helper text</small>
</div>
```

Features:
- Validation on blur and input
- Error states with red border
- Focus states with blue shadow
- Helper text support

### 4. Buttons

```html
<!-- Primary -->
<button class="btn btn-primary">Primary</button>

<!-- Secondary -->
<button class="btn btn-secondary">Secondary</button>

<!-- Outline -->
<button class="btn btn-outline">Outline</button>

<!-- With Icon -->
<button class="btn btn-primary">
  <i class="bi bi-plus-circle me-2"></i>Add New
</button>
```

Features:
- Hover lift effect
- Color variations
- Icon support
- Rounded corners (8px)

### 5. Badges

```html
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-info">Info</span>
```

### 6. Alerts

```html
<div class="alert alert-success">
  <strong>Success!</strong> Message here.
</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-danger">Error message</div>
<div class="alert alert-info">Info message</div>
```

Features:
- Color-coded borders
- Icon support
- Auto-dismiss capability (via JS)

### 7. Progress Bars

```html
<div class="progress-wrapper">
  <div class="d-flex justify-content-between mb-2">
    <span class="small">Progress</span>
    <span class="small fw-semibold">75%</span>
  </div>
  <div class="progress">
    <div class="progress-bar" style="width: 75%"></div>
  </div>
</div>
```

Features:
- Gradient colors
- Smooth animations
- Percentage display

## JavaScript Features

### Sidebar Toggle
- Automatically handles mobile menu
- Overlay backdrop
- Smooth transitions

### Form Validation
- Real-time validation
- Email and phone validation
- Required field checking
- Error message display

### Active Navigation
- Auto-highlight current page
- Click handlers for navigation

### Tooltips
- Custom tooltip implementation
- Hover to display
- Positioned automatically

## File Structure

```
/home/engine/project/
├── css/
│   └── styles.css           # Main stylesheet
├── js/
│   └── main.js             # JavaScript functionality
├── assets/
│   └── images/             # Image assets
├── learner-dashboard.html  # Learner interface
├── admin-dashboard.html    # Admin interface
├── components-demo.html    # Component library
└── UI-README.md           # This file
```

## Usage Examples

### Creating a New Page

1. Copy the structure from `learner-dashboard.html` or `admin-dashboard.html`
2. Update the sidebar navigation links
3. Modify the page content area
4. Ensure responsive meta tags are included

### Adding Custom Colors

Update CSS variables in `styles.css`:

```css
:root {
  --your-custom-color: #HEX;
}
```

### Customizing Components

All components are defined in `styles.css` with clear class names. Override or extend as needed.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states on interactive elements
- Sufficient color contrast ratios

## Performance Optimization

- Minimal CSS (~600 lines)
- CDN-hosted Bootstrap and icons
- Optimized images with placeholders
- Efficient JavaScript (~200 lines)

## Future Enhancements

- Dark mode toggle
- More color themes
- Additional component variations
- Animation library integration
- Accessibility improvements (WCAG 2.1 AA compliance)

## Support

For questions or issues with the UI framework, please refer to:
- Bootstrap 5 Documentation: https://getbootstrap.com/docs/5.3/
- Bootstrap Icons: https://icons.getbootstrap.com/

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Author**: e-Learning Platform Team
