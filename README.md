# Boosty Supporters Generator

A browser-based application that processes Boosty subscription data and generates supporter lists in multiple formats.

For this project, the GitHub Pages URL is https://mahenzon.github.io/render-boosty-supporters/

## Features

- **Drag & Drop Upload**: Easy CSV file upload with visual feedback
- **Data Processing**: Filters active subscriptions, sorts by date and name
- **Multiple Outputs**: Generates HTML credits page, plain text list, and Markdown list
- **Bootstrap UI**: Modern, responsive interface
- **Client-Side Processing**: No server required, works entirely in the browser

## Usage

1. Open `index.html` in a modern web browser
2. Drag and drop your `stat-subscriptions.csv` file or click to browse
3. Click "Process File" to analyze the data
4. Download individual files or all files as a ZIP archive

## File Structure

```
single-page-boosty-supporters/
├── index.html          # Main application
├── css/
│   └── styles.css      # Custom styles
├── js/
│   ├── app.js          # Main application logic
│   ├── dataProcessor.js # CSV processing
│   ├── uiManager.js    # UI state management
│   └── templates.js    # Jinja2 templates
└── docs/               # Documentation
```

## Dependencies

- **Bootstrap 5**: UI framework
- **PapaParse**: CSV parsing
- **Nunjucks**: Template rendering
- **JSZip**: ZIP file creation
- **FileSaver.js**: File downloads

All dependencies are loaded via CDN.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

The application can be deployed to any static web hosting service:

### GitHub Pages
1. Create a GitHub repository
2. Upload all files
3. Enable GitHub Pages in repository settings
4. Access at `https://[username].github.io/[repository-name]/`

### Other Options
- Netlify
- Vercel
- Firebase Hosting
- AWS S3 + CloudFront

## Data Processing Logic

The application replicates the logic from `render.py`:

1. **Parse CSV**: Read semicolon-delimited CSV with UTF-8 encoding
2. **Filter Data**: Remove "Follower" level and expired subscriptions
3. **Sort Data**: By start_date ascending, then by name alphabetical
4. **Group Data**: By level_name, sorted by level_price descending
5. **Render Templates**: Generate HTML, TXT, and MD outputs

## Development

### Local Testing
- Open `index.html` directly in a browser
- No build process required
- All dependencies loaded from CDN

### File Structure
- Keep JS files in `js/` folder
- Keep CSS in `css/` folder
- Update `index.html` to reference correct paths

## License

This project is open source. Feel free to use and modify as needed.

## Contributing

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request
