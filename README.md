# Jira API Client

A TypeScript client for interacting with the Jira API. This package provides a simple and type-safe way to work with Jira's REST API, including authentication, CRUD operations on issues, project management, and user operations.

[![npm version](https://img.shields.io/npm/v/jira-api-client.svg)](https://www.npmjs.com/package/jira-api-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔒 **Authentication** - Secure Bearer token authentication
- 📝 **Issue Management** - Create, read, update, and delete Jira issues
- 🔄 **Transitions** - Move issues through workflows
- 💬 **Comments** - Manage issue comments
- 📊 **Projects** - Access project details and metadata
- 👥 **Users** - Search and manage users
- 📄 **Pagination** - Handle paginated responses with ease
- ⚠️ **Error Handling** - Detailed error information
- 📦 **TypeScript** - Full type definitions for all API responses

## Installation

```bash
npm install jira-api-client
```

## Configuration

You can configure the client using environment variables or by passing a configuration object directly.

### Using Environment Variables

Create a `.env` file in your project root:

```
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_TOKEN=your-bearer-token
JIRA_API_VERSION=3
JIRA_REQUEST_TIMEOUT=30000
```

Then initialize the client:

```typescript
import { JiraClient } from 'jira-api-client';

const jira = JiraClient.fromEnv();
```

### Using Configuration Object

```typescript
import { JiraClient } from 'jira-api-client';

const jira = new JiraClient({
  baseUrl: 'https://your-domain.atlassian.net',
  token: 'your-bearer-token',
  apiVersion: 3, // optional, defaults to 3
  timeout: 30000, // optional, defaults to 30000 (30 seconds)
});
```

## Usage Examples

### Working with Issues

```typescript
import { JiraClient, CreateIssueData } from 'jira-api-client';

const jira = JiraClient.fromEnv();

// Get an issue
const issue = await jira.issues.getIssue('PROJECT-123');
console.log(issue.fields.summary);

// Create an issue
const newIssueData: CreateIssueData = {
  fields: {
    project: { key: 'PROJECT' },
    summary: 'New issue created via API',
    description: 'This is a description of the issue',
    issuetype: { name: 'Task' },
  },
};
const newIssue = await jira.issues.createIssue(newIssueData);
console.log(`Created issue: ${newIssue.key}`);

// Update an issue
await jira.issues.updateIssue('PROJECT-123', {
  fields: {
    summary: 'Updated summary',
    description: 'Updated description',
  },
});

// Delete an issue
await jira.issues.deleteIssue('PROJECT-123');

// Search for issues using JQL
const searchResults = await jira.issues.searchIssues(
  'project = PROJECT AND status = "In Progress"'
);
console.log(`Found ${searchResults.total} issues`);
```

### Working with Comments

```typescript
// Get comments for an issue
const comments = await jira.issues.getComments('PROJECT-123');
console.log(`Issue has ${comments.total} comments`);

// Add a comment
const comment = await jira.issues.addComment('PROJECT-123', 'This is a new comment');
console.log(`Added comment with ID: ${comment.id}`);

// Update a comment
await jira.issues.updateComment('PROJECT-123', comment.id, 'Updated comment text');

// Delete a comment
await jira.issues.deleteComment('PROJECT-123', comment.id);
```

### Working with Transitions

```typescript
// Get available transitions
const transitions = await jira.issues.getTransitions('PROJECT-123');
console.log('Available transitions:', transitions.map(t => t.name));

// Transition an issue
await jira.issues.transitionIssue('PROJECT-123', 'Done');
```

### Working with Projects

```typescript
// Get all projects
const projects = await jira.projects.getAllProjects();
console.log(`Found ${projects.values.length} projects`);

// Get a specific project
const project = await jira.projects.getProject('PROJECT');
console.log(`Project name: ${project.name}`);

// Get project issue types
const issueTypes = await jira.projects.getProjectIssueTypes('PROJECT');
console.log('Issue types:', issueTypes.map(t => t.name));

// Search for projects
const searchResults = await jira.projects.searchProjects('Marketing');
console.log(`Found ${searchResults.values.length} matching projects`);
```

### Working with Users

```typescript
// Get current user
const currentUser = await jira.users.getCurrentUser();
console.log(`Current user: ${currentUser.displayName}`);

// Search for users
const users = await jira.users.searchUsers('john');
console.log(`Found ${users.values.length} matching users`);

// Get assignable users for a project
const assignableUsers = await jira.users.getAssignableUsers('PROJECT');
console.log(`Found ${assignableUsers.values.length} assignable users`);
```

### Handling Pagination

```typescript
import { fetchAllPages } from 'jira-api-client';

// Fetch all issues across multiple pages
const allIssues = await fetchAllPages(
  params => jira.issues.searchIssues('project = PROJECT', undefined, params)
);
console.log(`Fetched all ${allIssues.length} issues`);

// Or manually handle pagination
let startAt = 0;
const maxResults = 50;
let isLast = false;

while (!isLast) {
  const response = await jira.issues.searchIssues(
    'project = PROJECT',
    undefined,
    { startAt, maxResults }
  );
  
  // Process the current page of results
  response.values.forEach(issue => {
    console.log(issue.key, issue.fields.summary);
  });
  
  isLast = response.isLast;
  startAt += maxResults;
}
```

### Error Handling

```typescript
import { isJiraError } from 'jira-api-client';

try {
  await jira.issues.getIssue('NONEXISTENT-123');
} catch (error) {
  if (isJiraError(error)) {
    console.error(`Jira API Error (${error.status}):`, error.message);
    console.error('Error details:', error.errors);
    console.error('Error messages:', error.errorMessages);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## API Documentation

### JiraClient

The main client class that provides access to all API endpoints.

```typescript
class JiraClient {
  readonly issues: IssuesApiClient;
  readonly projects: ProjectsApiClient;
  readonly users: UsersApiClient;

  constructor(config: JiraClientConfig);
  static fromEnv(): JiraClient;
}
```

### IssuesApiClient

```typescript
class IssuesApiClient {
  getIssue(issueIdOrKey: string, fields?: string[]): Promise<JiraIssue>;
  createIssue(data: CreateIssueData): Promise<JiraIssue>;
  updateIssue(issueIdOrKey: string, data: UpdateIssueData): Promise<void>;
  deleteIssue(issueIdOrKey: string, deleteSubtasks?: boolean): Promise<void>;
  searchIssues(jql: string, fields?: string[], pagination?: PaginationParams): Promise<PaginatedResponse<JiraIssue>>;
  getTransitions(issueIdOrKey: string): Promise<JiraTransition[]>;
  transitionIssue(issueIdOrKey: string, transitionIdOrName: string): Promise<void>;
  getComments(issueIdOrKey: string, pagination?: PaginationParams): Promise<PaginatedResponse<JiraComment>>;
  addComment(issueIdOrKey: string, body: string): Promise<JiraComment>;
  updateComment(issueIdOrKey: string, commentId: string, body: string): Promise<JiraComment>;
  deleteComment(issueIdOrKey: string, commentId: string): Promise<void>;
  assignIssue(issueIdOrKey: string, accountId: string | null): Promise<void>;
}
```

### ProjectsApiClient

```typescript
class ProjectsApiClient {
  getAllProjects(pagination?: PaginationParams): Promise<PaginatedResponse<JiraProject>>;
  getProject(projectIdOrKey: string): Promise<JiraProject>;
  getProjectIssueTypes(projectIdOrKey: string): Promise<JiraIssueType[]>;
  getProjectComponents(projectIdOrKey: string): Promise<any[]>;
  getProjectVersions(projectIdOrKey: string): Promise<any[]>;
  getProjectStatuses(projectIdOrKey: string): Promise<any[]>;
  searchProjects(query: string, pagination?: PaginationParams): Promise<PaginatedResponse<JiraProject>>;
}
```

### UsersApiClient

```typescript
class UsersApiClient {
  getCurrentUser(): Promise<JiraUser>;
  getUser(accountId: string): Promise<JiraUser>;
  searchUsers(query: string, pagination?: PaginationParams): Promise<PaginatedResponse<JiraUser>>;
  getAssignableUsers(projectIdOrKey: string, pagination?: PaginationParams): Promise<PaginatedResponse<JiraUser>>;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
- [Axios](https://github.com/axios/axios) for HTTP requests
- [TypeScript](https://www.typescriptlang.org/) for type safety
