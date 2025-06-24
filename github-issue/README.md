# GitHub Issue Tool

A powerful Node.js and Express.js tool for creating and managing GitHub issues with rich formatting support. This tool provides a modern web interface and RESTful API for interacting with GitHub issues.

## Features

- 🚀 **Create Issues**: Create new GitHub issues with rich markdown formatting
- 📖 **Read Issues**: Browse and search issues from any repository
- ✏️ **Update Issues**: Modify existing issues (title, description, state)
- 💬 **Comments**: Add and view comments on issues
- 🏷️ **Labels & Assignees**: Support for labels and assignees
- 🎨 **Rich Formatting**: Markdown support with syntax highlighting
- 🌐 **Web Interface**: Modern, responsive web UI
- 🔌 **REST API**: Full RESTful API for programmatic access

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- GitHub Personal Access Token

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd github-issue-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your GitHub Personal Access Token:
   ```
   GITHUB_TOKEN=your_github_personal_access_token_here
   PORT=3000
   ```

4. **Generate GitHub Personal Access Token**
   - Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `issues`
   - Copy the token and paste it in your `.env` file

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Web Interface: http://localhost:3000
   - API Health Check: http://localhost:3000/api/health

## API Endpoints

### Create Issue
```http
POST /api/issues
Content-Type: application/json

{
  "owner": "octocat",
  "repo": "Hello-World",
  "title": "Bug Report",
  "body": "This is a bug description with **markdown** support",
  "labels": ["bug", "urgent"],
  "assignees": ["username1", "username2"]
}
```

### Get Repository Issues
```http
GET /api/issues/:owner/:repo?state=open&per_page=30&page=1
```

### Get Specific Issue
```http
GET /api/issues/:owner/:repo/:issue_number
```

### Update Issue
```http
PATCH /api/issues/:owner/:repo/:issue_number
Content-Type: application/json

{
  "title": "Updated Title",
  "body": "Updated description",
  "state": "closed",
  "labels": ["bug", "fixed"],
  "assignees": ["username1"]
}
```

### Close Issue
```http
PATCH /api/issues/:owner/:repo/:issue_number/close
```

### Add Comment
```http
POST /api/issues/:owner/:repo/:issue_number/comments
Content-Type: application/json

{
  "body": "This is a comment with **markdown** support"
}
```

### Get Issue Comments
```http
GET /api/issues/:owner/:repo/:issue_number/comments
```

### Health Check
```http
GET /api/health
```

## Web Interface Usage

### Creating Issues
1. Navigate to the "Create Issue" tab
2. Fill in the repository owner and name
3. Enter a descriptive title
4. Use the formatting toolbar or write markdown in the description
5. Add labels and assignees (optional)
6. Click "Create Issue"

### Reading Issues
1. Go to the "Read Issues" tab
2. Enter repository owner and name
3. Select issue state (open/closed/all)
4. Click "Search Issues"
5. Browse through the results

### Managing Issues
1. Navigate to the "Manage Issues" tab
2. Enter repository details and issue number
3. Click "Load Issue"
4. Update fields as needed
5. Add comments or close the issue

## Markdown Support

The tool supports GitHub-flavored markdown including:

- **Bold text**: `**text**`
- *Italic text*: `*text*`
- `Inline code`: `` `code` ``
- Code blocks: ` ```language code``` `
- Headers: `## Header`
- Lists: `- item`
- Links: `[text](url)`
- Images: `![alt](url)`

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing required fields)
- `401`: Unauthorized (invalid token)
- `404`: Not Found (repository/issue doesn't exist)
- `500`: Internal Server Error

## Security Considerations

- Store your GitHub token securely in environment variables
- Never commit `.env` files to version control
- Use HTTPS in production
- Consider rate limiting for production deployments

## Development

### Project Structure
```
github-issue-tool/
├── server.js          # Main Express server
├── package.json       # Dependencies and scripts
├── public/            # Static files
│   ├── index.html     # Web interface
│   └── app.js         # Frontend JavaScript
├── env.example        # Environment variables template
└── README.md          # This file
```

### Adding New Features
1. Add new routes in `server.js`
2. Update the web interface in `public/index.html` and `public/app.js`
3. Test thoroughly with different repositories
4. Update documentation

## Troubleshooting

### Common Issues

1. **"Failed to create issue"**
   - Check your GitHub token has the correct permissions
   - Verify repository owner and name are correct
   - Ensure the repository exists and is accessible

2. **"Unauthorized" errors**
   - Verify your GitHub token is valid
   - Check token has required scopes (`repo`, `issues`)

3. **Port already in use**
   - Change the PORT in your `.env` file
   - Or kill the process using the current port

### Debug Mode
Enable debug logging by setting the environment variable:
```bash
DEBUG=* npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in this repository
- Check the troubleshooting section above
- Verify your GitHub token permissions 