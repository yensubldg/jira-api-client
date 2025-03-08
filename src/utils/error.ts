import axios, { AxiosError } from 'axios';
import { JiraApiError } from '../types';

/**
 * Custom error class for Jira API errors
 */
export class JiraError extends Error {
  /** The HTTP status code */
  status: number;
  /** The error details */
  errors: Record<string, string>;
  /** The error messages */
  errorMessages: string[];

  /**
   * Create a new JiraError
   * @param message - The error message
   * @param status - The HTTP status code
   * @param errors - The error details
   * @param errorMessages - The error messages
   */
  constructor(
    message: string,
    status: number = 500,
    errors: Record<string, string> = {},
    errorMessages: string[] = []
  ) {
    super(message);
    this.name = 'JiraError';
    this.status = status;
    this.errors = errors;
    this.errorMessages = errorMessages;
  }
}

/**
 * Handle an error from the Jira API
 * @param error - The error to handle
 * @returns A JiraError with the error details
 */
export function handleApiError(error: unknown): JiraError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<JiraApiError>;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data;

    if (data) {
      const errorMessages = data.errorMessages || [];
      const errors = data.errors || {};
      const message = errorMessages.length > 0 
        ? errorMessages[0] 
        : Object.keys(errors).length > 0 
          ? `${Object.keys(errors)[0]}: ${Object.values(errors)[0]}`
          : axiosError.message;

      return new JiraError(message, status, errors, errorMessages);
    }

    return new JiraError(axiosError.message, status);
  }

  if (error instanceof Error) {
    return new JiraError(error.message);
  }

  return new JiraError('Unknown error occurred');
}

/**
 * Check if an error is a Jira API error
 * @param error - The error to check
 * @returns Whether the error is a Jira API error
 */
export function isJiraError(error: unknown): error is JiraError {
  return error instanceof JiraError;
} 