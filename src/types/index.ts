/**
 * Configuration options for the Jira API client
 */
export interface JiraClientConfig {
  /** Base URL of the Jira instance (e.g., https://your-domain.atlassian.net) */
  baseUrl: string;
  /** Bearer token for authentication */
  token: string;
  /** API version to use (default: 3) */
  apiVersion?: number;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Pagination parameters for Jira API requests
 */
export interface PaginationParams {
  /** Maximum number of results to return (default: 50) */
  maxResults?: number;
  /** Index of the first result to return (default: 0) */
  startAt?: number;
}

/**
 * Response structure for paginated Jira API responses
 */
export interface PaginatedResponse<T> {
  /** The list of results */
  values: T[];
  /** The maximum number of results per page */
  maxResults: number;
  /** The index of the first result */
  startAt: number;
  /** The total number of results */
  total: number;
  /** Whether there are more results */
  isLast: boolean;
}

/**
 * Basic Jira issue fields
 */
export interface JiraIssue {
  /** The issue ID */
  id: string;
  /** The issue key (e.g., PROJECT-123) */
  key: string;
  /** The issue self URL */
  self: string;
  /** The issue fields */
  fields: {
    /** The issue summary */
    summary: string;
    /** The issue description */
    description?: string;
    /** The issue type */
    issuetype: {
      id: string;
      name: string;
      self: string;
    };
    /** The issue project */
    project: {
      id: string;
      key: string;
      name: string;
      self: string;
    };
    /** The issue status */
    status: {
      id: string;
      name: string;
      self: string;
    };
    /** The issue priority */
    priority?: {
      id: string;
      name: string;
      self: string;
    };
    /** The issue assignee */
    assignee?: {
      accountId: string;
      displayName: string;
      emailAddress: string;
      self: string;
    };
    /** The issue reporter */
    reporter?: {
      accountId: string;
      displayName: string;
      emailAddress: string;
      self: string;
    };
    /** The issue creation date */
    created: string;
    /** The issue update date */
    updated: string;
    /** Additional fields */
    [key: string]: unknown;
  };
}

/**
 * Data for creating a new Jira issue
 */
export interface CreateIssueData {
  /** The fields to set on the new issue */
  fields: {
    /** The project key or ID */
    project: {
      id?: string;
      key?: string;
    };
    /** The issue summary */
    summary: string;
    /** The issue description */
    description?: string;
    /** The issue type ID or name */
    issuetype: {
      id?: string;
      name?: string;
    };
    /** The issue assignee account ID */
    assignee?: {
      accountId: string;
    };
    /** The issue priority ID or name */
    priority?: {
      id?: string;
      name?: string;
    };
    /** Additional fields */
    [key: string]: unknown;
  };
}

/**
 * Data for updating an existing Jira issue
 */
export interface UpdateIssueData {
  /** The fields to update on the issue */
  fields?: {
    /** The issue summary */
    summary?: string;
    /** The issue description */
    description?: string;
    /** The issue assignee account ID */
    assignee?: {
      accountId: string;
    } | null;
    /** The issue priority ID or name */
    priority?: {
      id?: string;
      name?: string;
    };
    /** Additional fields */
    [key: string]: unknown;
  };
  /** The issue transition ID or name */
  transition?: {
    id?: string;
    name?: string;
  };
}

/**
 * Basic Jira project fields
 */
export interface JiraProject {
  /** The project ID */
  id: string;
  /** The project key */
  key: string;
  /** The project name */
  name: string;
  /** The project self URL */
  self: string;
  /** The project description */
  description?: string;
  /** The project lead */
  lead?: {
    accountId: string;
    displayName: string;
    self: string;
  };
  /** The project URL */
  url?: string;
  /** The project category */
  projectCategory?: {
    id: string;
    name: string;
    self: string;
  };
  /** The project type */
  projectTypeKey: string;
  /** Whether the project is simplified */
  simplified: boolean;
  /** The project style */
  style: string;
  /** Whether the project is private */
  isPrivate: boolean;
}

/**
 * Error response from the Jira API
 */
export interface JiraApiError {
  /** The error messages */
  errorMessages: string[];
  /** The error details */
  errors: Record<string, string>;
  /** The HTTP status code */
  status?: number;
}

/**
 * Jira issue comment
 */
export interface JiraComment {
  /** The comment ID */
  id: string;
  /** The comment self URL */
  self: string;
  /** The comment body */
  body: string;
  /** The comment author */
  author: {
    accountId: string;
    displayName: string;
    self: string;
  };
  /** The comment creation date */
  created: string;
  /** The comment update date */
  updated: string;
}

/**
 * Jira issue transition
 */
export interface JiraTransition {
  /** The transition ID */
  id: string;
  /** The transition name */
  name: string;
  /** The transition description */
  description?: string;
  /** The transition status */
  to: {
    id: string;
    name: string;
    self: string;
  };
}

/**
 * Jira issue type
 */
export interface JiraIssueType {
  /** The issue type ID */
  id: string;
  /** The issue type name */
  name: string;
  /** The issue type description */
  description: string;
  /** The issue type icon URL */
  iconUrl: string;
  /** The issue type self URL */
  self: string;
  /** Whether the issue type is a subtask */
  subtask: boolean;
}

/**
 * Jira user
 */
export interface JiraUser {
  /** The user account ID */
  accountId: string;
  /** The user display name */
  displayName: string;
  /** The user email address */
  emailAddress?: string;
  /** The user self URL */
  self: string;
  /** The user active status */
  active: boolean;
  /** The user time zone */
  timeZone?: string;
  /** The user avatar URLs */
  avatarUrls?: Record<string, string>;
} 