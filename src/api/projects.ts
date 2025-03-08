import { AxiosRequestConfig } from 'axios';
import { BaseApiClient } from './base';
import { 
  JiraIssueType, 
  JiraProject, 
  PaginatedResponse, 
  PaginationParams 
} from '../types';
import { createPaginationParams, createPaginatedResponse } from '../utils/pagination';

/**
 * API client for Jira projects
 */
export class ProjectsApiClient extends BaseApiClient {
  /**
   * Get all projects
   * @param pagination - The pagination parameters
   * @returns The projects
   */
  async getAllProjects(pagination?: PaginationParams): Promise<PaginatedResponse<JiraProject>> {
    const params = createPaginationParams(pagination);
    
    const config: AxiosRequestConfig = {
      params: {
        startAt: params.startAt,
        maxResults: params.maxResults,
      },
    };
    
    const projects = await this.get<JiraProject[]>('/project', config);
    
    return createPaginatedResponse(
      projects,
      projects.length, // Jira API doesn't return total count for projects
      params
    );
  }

  /**
   * Get a project by ID or key
   * @param projectIdOrKey - The project ID or key
   * @returns The project
   */
  async getProject(projectIdOrKey: string): Promise<JiraProject> {
    return this.get<JiraProject>(`/project/${projectIdOrKey}`);
  }

  /**
   * Get all issue types for a project
   * @param projectIdOrKey - The project ID or key
   * @returns The issue types
   */
  async getProjectIssueTypes(projectIdOrKey: string): Promise<JiraIssueType[]> {
    return this.get<JiraIssueType[]>(`/project/${projectIdOrKey}/issueTypes`);
  }

  /**
   * Get project components
   * @param projectIdOrKey - The project ID or key
   * @returns The project components
   */
  async getProjectComponents(projectIdOrKey: string): Promise<Record<string, unknown>[]> {
    return this.get<Record<string, unknown>[]>(`/project/${projectIdOrKey}/components`);
  }

  /**
   * Get project versions
   * @param projectIdOrKey - The project ID or key
   * @returns The project versions
   */
  async getProjectVersions(projectIdOrKey: string): Promise<Record<string, unknown>[]> {
    return this.get<Record<string, unknown>[]>(`/project/${projectIdOrKey}/versions`);
  }

  /**
   * Get project statuses
   * @param projectIdOrKey - The project ID or key
   * @returns The project statuses
   */
  async getProjectStatuses(projectIdOrKey: string): Promise<Record<string, unknown>[]> {
    return this.get<Record<string, unknown>[]>(`/project/${projectIdOrKey}/statuses`);
  }

  /**
   * Search for projects
   * @param query - The search query
   * @param pagination - The pagination parameters
   * @returns The search results
   */
  async searchProjects(
    query: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<JiraProject>> {
    const params = createPaginationParams(pagination);
    
    const config: AxiosRequestConfig = {
      params: {
        query,
        startAt: params.startAt,
        maxResults: params.maxResults,
      },
    };
    
    const response = await this.get<{
      values: JiraProject[];
      total: number;
      isLast: boolean;
    }>('/project/search', config);
    
    return {
      values: response.values,
      total: response.total,
      startAt: params.startAt,
      maxResults: params.maxResults,
      isLast: response.isLast,
    };
  }
} 