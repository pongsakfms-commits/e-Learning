# Quick Start Guide - e-Learning Platform UI

## 🚀 Get Started in 3 Minutes

### 1. View the Demos

Simply open these HTML files in your browser:

- **Login Page**: `index.html`
- **Learner Dashboard**: `learner-dashboard.html`
- **Admin Dashboard**: `admin-dashboard.html`
- **Component Library**: `components-demo.html`

### 2. Understanding the Structure

```
├── index.html              # Login page (entry point)
├── learner-dashboard.html  # Student interface
├── admin-dashboard.html    # Administrator interface
├── components-demo.html    # Reusable component showcase
├── css/
│   └── styles.css         # All custom styles
├── js/
│   └── main.js           # Interactive functionality
└── assets/
    └── images/           # Place images here
```

### 3. Creating a New Page

Copy this template:

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title - e-Learning Platform</title>
  
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div class="main-wrapper">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h4><i class="bi bi-book"></i> e-Learning</h4>
      </div>
      <nav class="sidebar-nav">
        <ul class="nav flex-column">
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="bi bi-speedometer2"></i>
              <span>Menu Item</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="menu-toggle">
            <i class="bi bi-list"></i>
          </button>
          <h5 class="mb-0">Page Title</h5>
        </div>
        <div class="topbar-right">
          <div class="user-profile">
            <div class="user-avatar">U</div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="content-area">
        <div class="page-header">
          <h2 class="page-title">Your Content</h2>
        </div>
        
        <!-- Your content here -->
        <div class="card">
          <div class="card-body">
            Content goes here
          </div>
        </div>
      </main>
    </div>
  </div>

  <div class="overlay"></div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

## 📦 Common Components

### Stats Card
```html
<div class="card stats-card">
  <div class="stats-icon">
    <i class="bi bi-people"></i>
  </div>
  <div class="stats-value">1,245</div>
  <div class="stats-label">Total Users</div>
</div>
```

### Data Table
```html
<div class="card">
  <div class="card-header">
    <h5 class="mb-0">Table Title</h5>
  </div>
  <div class="card-body">
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
  </div>
</div>
```

### Form
```html
<form data-validate="true">
  <div class="form-group">
    <label class="form-label">Label <span class="text-danger">*</span></label>
    <input type="text" class="form-control" required>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

### Alert
```html
<div class="alert alert-success">
  <strong>Success!</strong> Your message here.
</div>
```

## 🎨 Using Colors

CSS Variables available:
```css
var(--primary-color)    /* #4A90E2 - Blue */
var(--secondary-color)  /* #50C878 - Green */
var(--accent-color)     /* #FF6B6B - Red */
var(--dark-color)       /* #2C3E50 - Dark */
var(--light-color)      /* #F8F9FA - Light */
```

## 🔧 Customization

### Change Primary Color
Edit `css/styles.css`:
```css
:root {
  --primary-color: #YOUR_COLOR;
}
```

### Add Custom Component
1. Add HTML structure
2. Add styles to `css/styles.css`
3. Add JavaScript to `js/main.js` if needed

## 📱 Responsive Design

The layout automatically adapts to:
- **Mobile** (< 576px): Compact, hidden sidebar
- **Tablet** (576px - 991px): Toggleable sidebar
- **Desktop** (≥ 992px): Full layout with visible sidebar

## ⚡ JavaScript Features

### Form Validation
Add `data-validate="true"` to any form:
```html
<form data-validate="true">
  <!-- Your form fields -->
</form>
```

### Show Alert
```javascript
showAlert('Your message', 'success'); // success, warning, danger, info
```

### Confirm Action
```javascript
confirmAction('Are you sure?', function() {
  // Action to perform
});
```

## 🎯 Bootstrap Classes Available

All Bootstrap 5.3.2 utilities are available:
- Grid: `row`, `col-*`, `g-*`
- Spacing: `m-*`, `p-*`, `mt-*`, `mb-*`, etc.
- Display: `d-flex`, `d-none`, `d-md-block`, etc.
- Text: `text-center`, `text-muted`, `fw-bold`, etc.
- Colors: `bg-primary`, `text-success`, etc.

[Full Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)

## 🔍 Icons

Use Bootstrap Icons:
```html
<i class="bi bi-icon-name"></i>
```

[Browse all icons](https://icons.getbootstrap.com/)

## 📚 Additional Resources

- **UI Documentation**: `UI-README.md`
- **Component Examples**: `components-demo.html`
- **Bootstrap Docs**: https://getbootstrap.com/docs/5.3/
- **Bootstrap Icons**: https://icons.getbootstrap.com/

## 🐛 Common Issues

### Sidebar not toggling on mobile?
Make sure you include both:
1. The overlay div: `<div class="overlay"></div>`
2. The main.js script: `<script src="js/main.js"></script>`

### Forms not validating?
Add `data-validate="true"` attribute to the form element.

### Styles not working?
Check that `css/styles.css` is included after Bootstrap CSS.

## 💡 Tips

1. Use the grid system for responsive layouts
2. Always test on mobile, tablet, and desktop sizes
3. Use semantic HTML elements
4. Add proper alt text to images
5. Keep the color scheme consistent

---

**Need more help?** Check `UI-README.md` for detailed documentation.
