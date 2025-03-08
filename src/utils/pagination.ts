import { PaginatedResponse, PaginationParams } from '../types';

/**
 * Default pagination parameters
 */
export const DEFAULT_PAGINATION: Required<PaginationParams> = {
  maxResults: 50,
  startAt: 0,
};

/**
 * Create pagination parameters for a request
 * @param params - The pagination parameters to use
 * @returns The pagination parameters with defaults applied
 */
export function createPaginationParams(params?: PaginationParams): Required<PaginationParams> {
  return {
    maxResults: params?.maxResults ?? DEFAULT_PAGINATION.maxResults,
    startAt: params?.startAt ?? DEFAULT_PAGINATION.startAt,
  };
}

/**
 * Create a paginated response from the API response
 * @param values - The values returned by the API
 * @param total - The total number of results
 * @param params - The pagination parameters used for the request
 * @returns A paginated response
 */
export function createPaginatedResponse<T>(
  values: T[],
  total: number,
  params: Required<PaginationParams>
): PaginatedResponse<T> {
  const { maxResults, startAt } = params;
  const isLast = startAt + values.length >= total;

  return {
    values,
    maxResults,
    startAt,
    total,
    isLast,
  };
}

/**
 * Fetch all pages of a paginated resource
 * @param fetchPage - Function to fetch a page of results
 * @param params - Initial pagination parameters
 * @returns All results from all pages
 */
export async function fetchAllPages<T>(
  fetchPage: (params: Required<PaginationParams>) => Promise<PaginatedResponse<T>>,
  params?: PaginationParams
): Promise<T[]> {
  const paginationParams = createPaginationParams(params);
  const results: T[] = [];
  let isLast = false;

  while (!isLast) {
    const response = await fetchPage(paginationParams);
    results.push(...response.values);
    isLast = response.isLast;

    if (!isLast) {
      paginationParams.startAt += paginationParams.maxResults;
    }
  }

  return results;
} 