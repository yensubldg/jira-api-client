import { IssuesApiClient } from './api/issues';
import { ProjectsApiClient } from './api/projects';
import { UsersApiClient } from './api/users';
import { JiraClientConfig } from './types';
import { createConfigFromEnv } from './utils/config';
import { fetchAllPages } from './utils/pagination';

/**
 * Main Jira API client
 */
export class JiraClient {
  /** The issues API client */
  readonly issues: IssuesApiClient;
  /** The projects API client */
  readonly projects: ProjectsApiClient;
  /** The users API client */
  readonly users: UsersApiClient;

  /**
   * Create a new JiraClient
   * @param config - The configuration for the client
   */
  constructor(config: JiraClientConfig) {
    this.issues = new IssuesApiClient(config);
    this.projects = new ProjectsApiClient(config);
    this.users = new UsersApiClient(config);
  }

  /**
   * Create a new JiraClient from environment variables
   * @returns A new JiraClient
   */
  static fromEnv(): JiraClient {
    const config = createConfigFromEnv();
    return new JiraClient(config);
  }
}

// Export types
export * from './types';
export * from './utils/error';
export * from './utils/pagination';
export * from './utils/config';

// Export utility functions
export { fetchAllPages };

// Default export
export default JiraClient; 