import axios, { AxiosInstance } from 'axios';
import { IssuesApiClient } from '../api/issues';
import { JiraClientConfig, JiraIssue, CreateIssueData, UpdateIssueData } from '../types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IssuesApiClient', () => {
  const mockConfig: JiraClientConfig = {
    baseUrl: 'https://example.atlassian.net',
    email: 'test@example.com',
    apiToken: 'test-token',
  };

  let issuesClient: IssuesApiClient;
  let mockAxiosInstance: Record<string, jest.Mock>;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as unknown as AxiosInstance);
    issuesClient = new IssuesApiClient(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getIssue', () => {
    it('should get an issue by key', async () => {
      const mockIssue: JiraIssue = {
        id: '10000',
        key: 'TEST-1',
        self: 'https://example.atlassian.net/rest/api/3/issue/10000',
        fields: {
          summary: 'Test issue',
          issuetype: {
            id: '10001',
            name: 'Task',
            self: 'https://example.atlassian.net/rest/api/3/issuetype/10001',
          },
          project: {
            id: '10000',
            key: 'TEST',
            name: 'Test Project',
            self: 'https://example.atlassian.net/rest/api/3/project/10000',
          },
          status: {
            id: '10000',
            name: 'To Do',
            self: 'https://example.atlassian.net/rest/api/3/status/10000',
          },
          created: '2023-01-01T00:00:00.000Z',
          updated: '2023-01-01T00:00:00.000Z',
        },
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockIssue });

      const result = await issuesClient.getIssue('TEST-1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/issue/TEST-1', expect.any(Object));
      expect(result).toEqual(mockIssue);
    });

    it('should get an issue with specific fields', async () => {
      const mockIssue: JiraIssue = {
        id: '10000',
        key: 'TEST-1',
        self: 'https://example.atlassian.net/rest/api/3/issue/10000',
        fields: {
          summary: 'Test issue',
          issuetype: {
            id: '10001',
            name: 'Task',
            self: 'https://example.atlassian.net/rest/api/3/issuetype/10001',
          },
          project: {
            id: '10000',
            key: 'TEST',
            name: 'Test Project',
            self: 'https://example.atlassian.net/rest/api/3/project/10000',
          },
          status: {
            id: '10000',
            name: 'To Do',
            self: 'https://example.atlassian.net/rest/api/3/status/10000',
          },
          created: '2023-01-01T00:00:00.000Z',
          updated: '2023-01-01T00:00:00.000Z',
        },
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockIssue });

      const fields = ['summary', 'status', 'assignee'];
      await issuesClient.getIssue('TEST-1', fields);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/issue/TEST-1', {
        params: { fields: 'summary,status,assignee' },
      });
    });
  });

  describe('createIssue', () => {
    it('should create a new issue', async () => {
      const mockIssue: JiraIssue = {
        id: '10000',
        key: 'TEST-1',
        self: 'https://example.atlassian.net/rest/api/3/issue/10000',
        fields: {
          summary: 'New issue',
          issuetype: {
            id: '10001',
            name: 'Task',
            self: 'https://example.atlassian.net/rest/api/3/issuetype/10001',
          },
          project: {
            id: '10000',
            key: 'TEST',
            name: 'Test Project',
            self: 'https://example.atlassian.net/rest/api/3/project/10000',
          },
          status: {
            id: '10000',
            name: 'To Do',
            self: 'https://example.atlassian.net/rest/api/3/status/10000',
          },
          created: '2023-01-01T00:00:00.000Z',
          updated: '2023-01-01T00:00:00.000Z',
        },
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockIssue });

      const issueData: CreateIssueData = {
        fields: {
          project: { key: 'TEST' },
          summary: 'New issue',
          issuetype: { name: 'Task' },
        },
      };

      const result = await issuesClient.createIssue(issueData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/issue', issueData, undefined);
      expect(result).toEqual(mockIssue);
    });
  });

  describe('updateIssue', () => {
    it('should update an issue', async () => {
      mockAxiosInstance.put.mockResolvedValue({ data: undefined });

      const updateData: UpdateIssueData = {
        fields: {
          summary: 'Updated summary',
          description: 'Updated description',
        },
      };

      await issuesClient.updateIssue('TEST-1', updateData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/issue/TEST-1', updateData, undefined);
    });
  });

  describe('deleteIssue', () => {
    it('should delete an issue', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: undefined });

      await issuesClient.deleteIssue('TEST-1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/issue/TEST-1', {
        params: { deleteSubtasks: false },
      });
    });

    it('should delete an issue with subtasks', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: undefined });

      await issuesClient.deleteIssue('TEST-1', true);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/issue/TEST-1', {
        params: { deleteSubtasks: true },
      });
    });
  });

  describe('searchIssues', () => {
    it('should search for issues using JQL', async () => {
      const mockResponse = {
        issues: [
          {
            id: '10000',
            key: 'TEST-1',
            self: 'https://example.atlassian.net/rest/api/3/issue/10000',
            fields: {
              summary: 'Test issue 1',
              status: { id: '10000', name: 'To Do', self: 'https://example.atlassian.net/rest/api/3/status/10000' },
            },
          },
          {
            id: '10001',
            key: 'TEST-2',
            self: 'https://example.atlassian.net/rest/api/3/issue/10001',
            fields: {
              summary: 'Test issue 2',
              status: { id: '10000', name: 'To Do', self: 'https://example.atlassian.net/rest/api/3/status/10000' },
            },
          },
        ],
        total: 2,
        startAt: 0,
        maxResults: 50,
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const jql = 'project = TEST';
      const result = await issuesClient.searchIssues(jql);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql,
        startAt: 0,
        maxResults: 50,
        fields: ['summary', 'status', 'assignee', 'priority', 'issuetype', 'created', 'updated'],
      }, undefined);

      expect(result).toEqual({
        values: mockResponse.issues,
        total: mockResponse.total,
        startAt: 0,
        maxResults: 50,
        isLast: true,
      });
    });

    it('should search for issues with custom fields and pagination', async () => {
      const mockResponse = {
        issues: [
          {
            id: '10000',
            key: 'TEST-1',
            self: 'https://example.atlassian.net/rest/api/3/issue/10000',
            fields: {
              summary: 'Test issue 1',
              description: 'Description 1',
            },
          },
        ],
        total: 10,
        startAt: 5,
        maxResults: 1,
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const jql = 'project = TEST';
      const fields = ['summary', 'description'];
      const pagination = { startAt: 5, maxResults: 1 };

      const result = await issuesClient.searchIssues(jql, fields, pagination);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/search', {
        jql,
        startAt: 5,
        maxResults: 1,
        fields,
      }, undefined);

      expect(result).toEqual({
        values: mockResponse.issues,
        total: mockResponse.total,
        startAt: 5,
        maxResults: 1,
        isLast: false, // Not the last page since total > startAt + issues.length
      });
    });
  });

  describe('getTransitions', () => {
    it('should get transitions for an issue', async () => {
      const mockTransitions = [
        {
          id: '10000',
          name: 'To Do',
          to: { id: '10000', name: 'To Do', self: 'https://example.atlassian.net/rest/api/3/status/10000' },
        },
        {
          id: '10001',
          name: 'In Progress',
          to: { id: '10001', name: 'In Progress', self: 'https://example.atlassian.net/rest/api/3/status/10001' },
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({ data: { transitions: mockTransitions } });

      const result = await issuesClient.getTransitions('TEST-1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/issue/TEST-1/transitions', undefined);
      expect(result).toEqual(mockTransitions);
    });
  });

  describe('transitionIssue', () => {
    it('should transition an issue by transition ID', async () => {
      const mockTransitions = [
        {
          id: '10000',
          name: 'To Do',
          to: { id: '10000', name: 'To Do', self: 'https://example.atlassian.net/rest/api/3/status/10000' },
        },
        {
          id: '10001',
          name: 'In Progress',
          to: { id: '10001', name: 'In Progress', self: 'https://example.atlassian.net/rest/api/3/status/10001' },
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({ data: { transitions: mockTransitions } });
      mockAxiosInstance.post.mockResolvedValue({ data: undefined });

      await issuesClient.transitionIssue('TEST-1', '10001');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/issue/TEST-1/transitions', undefined);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/issue/TEST-1/transitions', {
        transition: { id: '10001' },
      }, undefined);
    });

    it('should transition an issue by transition name', async () => {
      const mockTransitions = [
        {
          id: '10000',
          name: 'To Do',
          to: { id: '10000', name: 'To Do', self: 'https://example.atlassian.net/rest/api/3/status/10000' },
        },
        {
          id: '10001',
          name: 'In Progress',
          to: { id: '10001', name: 'In Progress', self: 'https://example.atlassian.net/rest/api/3/status/10001' },
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({ data: { transitions: mockTransitions } });
      mockAxiosInstance.post.mockResolvedValue({ data: undefined });

      await issuesClient.transitionIssue('TEST-1', 'In Progress');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/issue/TEST-1/transitions', undefined);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/issue/TEST-1/transitions', {
        transition: { id: '10001' },
      }, undefined);
    });

    it('should throw an error if transition is not found', async () => {
      const mockTransitions = [
        {
          id: '10000',
          name: 'To Do',
          to: { id: '10000', name: 'To Do', self: 'https://example.atlassian.net/rest/api/3/status/10000' },
        },
        {
          id: '10001',
          name: 'In Progress',
          to: { id: '10001', name: 'In Progress', self: 'https://example.atlassian.net/rest/api/3/status/10001' },
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({ data: { transitions: mockTransitions } });

      await expect(issuesClient.transitionIssue('TEST-1', 'Done')).rejects.toThrow(
        'Transition "Done" not found for issue TEST-1'
      );

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/issue/TEST-1/transitions', undefined);
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });
  });

  describe('getComments', () => {
    it('should get comments for an issue', async () => {
      const mockResponse = {
        comments: [
          {
            id: '10000',
            self: 'https://example.atlassian.net/rest/api/3/issue/TEST-1/comment/10000',
            body: 'This is a comment',
            author: {
              accountId: 'user123',
              displayName: 'Test User',
              self: 'https://example.atlassian.net/rest/api/3/user?accountId=user123',
            },
            created: '2023-01-01T00:00:00.000Z',
            updated: '2023-01-01T00:00:00.000Z',
          },
        ],
        total: 1,
        startAt: 0,
        maxResults: 50,
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockResponse });

      const result = await issuesClient.getComments('TEST-1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/issue/TEST-1/comment', {
        params: {
          startAt: 0,
          maxResults: 50,
        },
      });

      expect(result).toEqual({
        values: mockResponse.comments,
        total: mockResponse.total,
        startAt: 0,
        maxResults: 50,
        isLast: true,
      });
    });
  });

  describe('addComment', () => {
    it('should add a comment to an issue', async () => {
      const mockComment = {
        id: '10000',
        self: 'https://example.atlassian.net/rest/api/3/issue/TEST-1/comment/10000',
        body: 'This is a new comment',
        author: {
          accountId: 'user123',
          displayName: 'Test User',
          self: 'https://example.atlassian.net/rest/api/3/user?accountId=user123',
        },
        created: '2023-01-01T00:00:00.000Z',
        updated: '2023-01-01T00:00:00.000Z',
      };

      mockAxiosInstance.post.mockResolvedValue({ data: mockComment });

      const result = await issuesClient.addComment('TEST-1', 'This is a new comment');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/issue/TEST-1/comment', {
        body: 'This is a new comment',
      }, undefined);

      expect(result).toEqual(mockComment);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const mockComment = {
        id: '10000',
        self: 'https://example.atlassian.net/rest/api/3/issue/TEST-1/comment/10000',
        body: 'This is an updated comment',
        author: {
          accountId: 'user123',
          displayName: 'Test User',
          self: 'https://example.atlassian.net/rest/api/3/user?accountId=user123',
        },
        created: '2023-01-01T00:00:00.000Z',
        updated: '2023-01-01T00:00:00.000Z',
      };

      mockAxiosInstance.put.mockResolvedValue({ data: mockComment });

      const result = await issuesClient.updateComment('TEST-1', '10000', 'This is an updated comment');

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/issue/TEST-1/comment/10000', {
        body: 'This is an updated comment',
      }, undefined);

      expect(result).toEqual(mockComment);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: undefined });

      await issuesClient.deleteComment('TEST-1', '10000');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/issue/TEST-1/comment/10000', undefined);
    });
  });

  describe('assignIssue', () => {
    it('should assign an issue to a user', async () => {
      mockAxiosInstance.put.mockResolvedValue({ data: undefined });

      await issuesClient.assignIssue('TEST-1', 'user123');

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/issue/TEST-1/assignee', {
        accountId: 'user123',
      }, undefined);
    });

    it('should unassign an issue', async () => {
      mockAxiosInstance.put.mockResolvedValue({ data: undefined });

      await issuesClient.assignIssue('TEST-1', null);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/issue/TEST-1/assignee', {
        accountId: null,
      }, undefined);
    });
  });
}); 