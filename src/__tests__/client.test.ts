import axios, { AxiosInstance } from 'axios';
import { JiraClient } from '../index';
import { JiraClientConfig } from '../types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JiraClient', () => {
  const mockConfig: JiraClientConfig = {
    baseUrl: 'https://example.atlassian.net',
    email: 'test@example.com',
    apiToken: 'test-token',
  };

  beforeEach(() => {
    mockedAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: {} }),
      post: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn().mockResolvedValue({ data: {} }),
      delete: jest.fn().mockResolvedValue({ data: {} }),
    } as unknown as AxiosInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a client with the provided configuration', () => {
    const client = new JiraClient(mockConfig);
    
    expect(client.issues).toBeDefined();
    expect(client.projects).toBeDefined();
    expect(client.users).toBeDefined();
    
    expect(mockedAxios.create).toHaveBeenCalledTimes(3);
    expect(mockedAxios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: 'https://example.atlassian.net/rest/api/3',
      auth: {
        username: 'test@example.com',
        password: 'test-token',
      },
    }));
  });

  it('should create a client with custom API version', () => {
    const customConfig: JiraClientConfig = {
      ...mockConfig,
      apiVersion: 2,
    };
    
    const _client = new JiraClient(customConfig);
    
    expect(mockedAxios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: 'https://example.atlassian.net/rest/api/2',
    }));
  });

  it('should create a client with custom timeout', () => {
    const customConfig: JiraClientConfig = {
      ...mockConfig,
      timeout: 60000,
    };
    
    const _client = new JiraClient(customConfig);
    
    expect(mockedAxios.create).toHaveBeenCalledWith(expect.objectContaining({
      timeout: 60000,
    }));
  });
}); 