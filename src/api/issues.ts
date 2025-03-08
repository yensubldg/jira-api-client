import { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from './base';
import { 
  CreateIssueData, 
  JiraComment, 
  JiraIssue, 
  JiraTransition, 
  PaginatedResponse, 
  PaginationParams, 
  UpdateIssueData 
} from '../types';
import { createPaginationParams, createPaginatedResponse } from '../utils/pagination';

/**
 * API client for Jira issues
 */
export class IssuesApiClient extends BaseApiClient {
  /**
   * Get an issue by ID or key
   * @param issueIdOrKey - The issue ID or key
   * @param fields - The fields to include in the response
   * @returns The issue
   */
  async getIssue(issueIdOrKey: string, fields?: string[]): Promise<JiraIssue> {
    const config: AxiosRequestConfig = {};
    
    if (fields && fields.length > 0) {
      config.params = { fields: fields.join(',') };
    }
    
    return this.get<JiraIssue>(`/issue/${issueIdOrKey}`, config);
  }

  /**
   * Create a new issue
   * @param data - The issue data
   * @returns The created issue
   */
  async createIssue(data: CreateIssueData): Promise<JiraIssue> {
    return this.post<JiraIssue>('/issue', data);
  }

  /**
   * Update an issue
   * @param issueIdOrKey - The issue ID or key
   * @param data - The update data
   * @returns Nothing
   */
  async updateIssue(issueIdOrKey: string, data: UpdateIssueData): Promise<void> {
    await this.put<void>(`/issue/${issueIdOrKey}`, data);
  }

  /**
   * Delete an issue
   * @param issueIdOrKey - The issue ID or key
   * @param deleteSubtasks - Whether to delete subtasks
   * @returns Nothing
   */
  async deleteIssue(issueIdOrKey: string, deleteSubtasks = false): Promise<void> {
    const config: AxiosRequestConfig = {
      params: { deleteSubtasks },
    };
    
    await this.delete<void>(`/issue/${issueIdOrKey}`, config);
  }

  /**
   * Search for issues using JQL
   * @param jql - The JQL query
   * @param fields - The fields to include in the response
   * @param pagination - The pagination parameters
   * @returns The search results
   */
  async searchIssues(
    jql: string,
    fields?: string[],
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<JiraIssue>> {
    const params = createPaginationParams(pagination);
    
    const data = {
      jql,
      startAt: params.startAt,
      maxResults: params.maxResults,
      fields: fields || ['summary', 'status', 'assignee', 'priority', 'issuetype', 'created', 'updated'],
    };
    
    const response = await this.post<{
      issues: JiraIssue[];
      total: number;
      startAt: number;
      maxResults: number;
    }>('/search', data);
    
    return createPaginatedResponse(
      response.issues,
      response.total,
      params
    );
  }

  /**
   * Get all transitions available for an issue
   * @param issueIdOrKey - The issue ID or key
   * @returns The available transitions
   */
  async getTransitions(issueIdOrKey: string): Promise<JiraTransition[]> {
    const response = await this.get<{ transitions: JiraTransition[] }>(
      `/issue/${issueIdOrKey}/transitions`
    );
    
    return response.transitions;
  }

  /**
   * Transition an issue to a new status
   * @param issueIdOrKey - The issue ID or key
   * @param transitionIdOrName - The transition ID or name
   * @returns Nothing
   */
  async transitionIssue(issueIdOrKey: string, transitionIdOrName: string): Promise<void> {
    // First, check if the transition ID is valid
    const transitions = await this.getTransitions(issueIdOrKey);
    
    // Find the transition by ID or name
    const transition = transitions.find(
      (t) => t.id === transitionIdOrName || t.name === transitionIdOrName
    );
    
    if (!transition) {
      throw new Error(`Transition "${transitionIdOrName}" not found for issue ${issueIdOrKey}`);
    }
    
    // Perform the transition
    await this.post<void>(`/issue/${issueIdOrKey}/transitions`, {
      transition: { id: transition.id },
    });
  }

  /**
   * Get comments for an issue
   * @param issueIdOrKey - The issue ID or key
   * @param pagination - The pagination parameters
   * @returns The comments
   */
  async getComments(
    issueIdOrKey: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<JiraComment>> {
    const params = createPaginationParams(pagination);
    
    const config: AxiosRequestConfig = {
      params: {
        startAt: params.startAt,
        maxResults: params.maxResults,
      },
    };
    
    const response = await this.get<{
      comments: JiraComment[];
      total: number;
      startAt: number;
      maxResults: number;
    }>(`/issue/${issueIdOrKey}/comment`, config);
    
    return createPaginatedResponse(
      response.comments,
      response.total,
      params
    );
  }

  /**
   * Add a comment to an issue
   * @param issueIdOrKey - The issue ID or key
   * @param body - The comment body
   * @returns The created comment
   */
  async addComment(issueIdOrKey: string, body: string): Promise<JiraComment> {
    return this.post<JiraComment>(`/issue/${issueIdOrKey}/comment`, { body });
  }

  /**
   * Update a comment
   * @param issueIdOrKey - The issue ID or key
   * @param commentId - The comment ID
   * @param body - The new comment body
   * @returns The updated comment
   */
  async updateComment(issueIdOrKey: string, commentId: string, body: string): Promise<JiraComment> {
    return this.put<JiraComment>(`/issue/${issueIdOrKey}/comment/${commentId}`, { body });
  }

  /**
   * Delete a comment
   * @param issueIdOrKey - The issue ID or key
   * @param commentId - The comment ID
   * @returns Nothing
   */
  async deleteComment(issueIdOrKey: string, commentId: string): Promise<void> {
    await this.delete<void>(`/issue/${issueIdOrKey}/comment/${commentId}`);
  }

  /**
   * Assign an issue to a user
   * @param issueIdOrKey - The issue ID or key
   * @param accountId - The user account ID, or null to unassign
   * @returns Nothing
   */
  async assignIssue(issueIdOrKey: string, accountId: string | null): Promise<void> {
    const data = accountId ? { accountId } : { accountId: null };
    await this.put<void>(`/issue/${issueIdOrKey}/assignee`, data);
  }
} 