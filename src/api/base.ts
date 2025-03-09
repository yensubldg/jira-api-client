import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { JiraClientConfig } from '../types';
import { createConfig } from '../utils/config';
import { handleApiError } from '../utils/error';

/**
 * Base API client for Jira
 */
export class BaseApiClient {
  /** The Axios instance for making requests */
  protected client: AxiosInstance;
  /** The configuration for the client */
  protected config: Required<JiraClientConfig>;

  /**
   * Create a new BaseApiClient
   * @param config - The configuration for the client
   */
  constructor(config: JiraClientConfig) {
    this.config = createConfig(config);
    this.client = this.createAxiosInstance();
  }

  /**
   * Create an Axios instance for making requests
   * @returns The Axios instance
   */
  private createAxiosInstance(): AxiosInstance {
    const { baseUrl, token, apiVersion, timeout, email } = this.config;

    let auth = '';

    if (email) {
      auth = 'Basic ' + Buffer.from(`${email}:${token}`).toString('base64');
    } else {
      auth = `Bearer ${token}`;
    }
    
    const instance = axios.create({
      baseURL: `${baseUrl}/rest/api/${apiVersion}`,
      timeout,      
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return instance;
  }

  /**
   * Make a GET request to the Jira API
   * @param url - The URL to request
   * @param config - The request configuration
   * @returns The response data
   */
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a POST request to the Jira API
   * @param url - The URL to request
   * @param data - The data to send
   * @param config - The request configuration
   * @returns The response data
   */
  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a PUT request to the Jira API
   * @param url - The URL to request
   * @param data - The data to send
   * @param config - The request configuration
   * @returns The response data
   */
  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Make a DELETE request to the Jira API
   * @param url - The URL to request
   * @param config - The request configuration
   * @returns The response data
   */
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
} 