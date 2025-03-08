import dotenv from 'dotenv';
import { JiraClientConfig } from '../types';

// Load environment variables from .env file
dotenv.config();

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<JiraClientConfig> = {
  apiVersion: 3,
  timeout: 30000,
};

/**
 * Create a configuration object from environment variables
 * @returns The configuration object
 * @throws Error if required environment variables are missing
 */
export function createConfigFromEnv(): JiraClientConfig {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const apiVersion = process.env.JIRA_API_VERSION 
    ? parseInt(process.env.JIRA_API_VERSION, 10) 
    : DEFAULT_CONFIG.apiVersion;
  const timeout = process.env.JIRA_REQUEST_TIMEOUT 
    ? parseInt(process.env.JIRA_REQUEST_TIMEOUT, 10) 
    : DEFAULT_CONFIG.timeout;

  if (!baseUrl) {
    throw new Error('JIRA_BASE_URL environment variable is required');
  }

  if (!email) {
    throw new Error('JIRA_EMAIL environment variable is required');
  }

  if (!apiToken) {
    throw new Error('JIRA_API_TOKEN environment variable is required');
  }

  return {
    baseUrl,
    email,
    apiToken,
    apiVersion,
    timeout,
  };
}

/**
 * Create a configuration object from the provided options
 * @param config - The configuration options
 * @returns The configuration object with defaults applied
 */
export function createConfig(config: JiraClientConfig): Required<JiraClientConfig> {
  return {
    baseUrl: config.baseUrl,
    email: config.email,
    apiToken: config.apiToken,
    apiVersion: config.apiVersion ?? DEFAULT_CONFIG.apiVersion!,
    timeout: config.timeout ?? DEFAULT_CONFIG.timeout!,
  };
} 