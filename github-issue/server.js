const express = require('express');
const { Octokit } = require('octokit');
const cors = require('cors');
const bodyParser = require('body-parser');
const { marked } = require('marked');
const hljs = require('highlight.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure marked for syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Routes

// Create a new GitHub issue
app.post('/api/issues', async (req, res) => {
  try {
    const { owner, repo, title, body, labels, assignees } = req.body;
    
    if (!owner || !repo || !title) {
      return res.status(400).json({
        error: 'Missing required fields: owner, repo, and title are required'
      });
    }

    // Convert markdown to HTML for better formatting
    const formattedBody = marked(body || '');
    
    const issue = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body: formattedBody,
      labels: labels || [],
      assignees: assignees || []
    });

    res.json({
      success: true,
      issue: issue.data,
      message: 'Issue created successfully'
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({
      error: 'Failed to create issue',
      details: error.message
    });
  }
});

// Get all issues for a repository
app.get('/api/issues/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'open', per_page = 30, page = 1 } = req.query;

    const issues = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state,
      per_page: parseInt(per_page),
      page: parseInt(page)
    });

    res.json({
      success: true,
      issues: issues.data,
      total_count: issues.data.length
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      error: 'Failed to fetch issues',
      details: error.message
    });
  }
});

// Get a specific issue
app.get('/api/issues/:owner/:repo/:issue_number', async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.params;

    const issue = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: parseInt(issue_number)
    });

    res.json({
      success: true,
      issue: issue.data
    });
  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      error: 'Failed to fetch issue',
      details: error.message
    });
  }
});

// Update an issue
app.patch('/api/issues/:owner/:repo/:issue_number', async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.params;
    const { title, body, state, labels, assignees } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (body) updateData.body = marked(body);
    if (state) updateData.state = state;
    if (labels) updateData.labels = labels;
    if (assignees) updateData.assignees = assignees;

    const issue = await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: parseInt(issue_number),
      ...updateData
    });

    res.json({
      success: true,
      issue: issue.data,
      message: 'Issue updated successfully'
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({
      error: 'Failed to update issue',
      details: error.message
    });
  }
});

// Close an issue
app.patch('/api/issues/:owner/:repo/:issue_number/close', async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.params;

    const issue = await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: parseInt(issue_number),
      state: 'closed'
    });

    res.json({
      success: true,
      issue: issue.data,
      message: 'Issue closed successfully'
    });
  } catch (error) {
    console.error('Error closing issue:', error);
    res.status(500).json({
      error: 'Failed to close issue',
      details: error.message
    });
  }
});

// Add a comment to an issue
app.post('/api/issues/:owner/:repo/:issue_number/comments', async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.params;
    const { body } = req.body;

    if (!body) {
      return res.status(400).json({
        error: 'Comment body is required'
      });
    }

    const comment = await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: parseInt(issue_number),
      body: marked(body)
    });

    res.json({
      success: true,
      comment: comment.data,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      error: 'Failed to add comment',
      details: error.message
    });
  }
});

// Get issue comments
app.get('/api/issues/:owner/:repo/:issue_number/comments', async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.params;

    const comments = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: parseInt(issue_number)
    });

    res.json({
      success: true,
      comments: comments.data
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      error: 'Failed to fetch comments',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'GitHub Issue Tool is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GitHub Issue Tool server running on port ${PORT}`);
  console.log(`📝 API Documentation available at http://localhost:${PORT}/api/health`);
}); 