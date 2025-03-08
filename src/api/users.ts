import { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from './base';
import { 
  JiraUser, 
  PaginatedResponse, 
  PaginationParams 
} from '../types';
import { createPaginationParams, createPaginatedResponse } from '../utils/pagination';

/**
 * API client for Jira users
 */
export class UsersApiClient extends BaseApiClient {
  /**
   * Get the current user
   * @returns The current user
   */
  async getCurrentUser(): Promise<JiraUser> {
    return this.get<JiraUser>('/myself');
  }

  /**
   * Get a user by account ID
   * @param accountId - The user account ID
   * @returns The user
   */
  async getUser(accountId: string): Promise<JiraUser> {
    const config: AxiosRequestConfig = {
      params: { accountId },
    };
    
    return this.get<JiraUser>('/user', config);
  }

  /**
   * Search for users
   * @param query - The search query
   * @param pagination - The pagination parameters
   * @returns The search results
   */
  async searchUsers(
    query: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<JiraUser>> {
    const params = createPaginationParams(pagination);
    
    const config: AxiosRequestConfig = {
      params: {
        query,
        startAt: params.startAt,
        maxResults: params.maxResults,
      },
    };
    
    const users = await this.get<JiraUser[]>('/user/search', config);
    
    return createPaginatedResponse(
      users,
      users.length, // Jira API doesn't return total count for user search
      params
    );
  }

  /**
   * Get all users assignable to a project
   * @param projectIdOrKey - The project ID or key
   * @param pagination - The pagination parameters
   * @returns The assignable users
   */
  async getAssignableUsers(
    projectIdOrKey: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<JiraUser>> {
    const params = createPaginationParams(pagination);
    
    const config: AxiosRequestConfig = {
      params: {
        project: projectIdOrKey,
        startAt: params.startAt,
        maxResults: params.maxResults,
      },
    };
    
    const users = await this.get<JiraUser[]>('/user/assignable/search', config);
    
    return createPaginatedResponse(
      users,
      users.length, // Jira API doesn't return total count for assignable users
      params
    );
  }
} 