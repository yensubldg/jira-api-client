import { JiraClient, CreateIssueData } from '../src';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main(): Promise<void> {
  try {
    // Create a client using environment variables
    const jira = JiraClient.fromEnv();
    
    // Or create a client with explicit configuration
    // const jira = new JiraClient({
    //   baseUrl: 'https://your-domain.atlassian.net',
    //   email: 'your-email@example.com',
    //   apiToken: 'your-api-token',
    // });

    // Get information about the current user
    const currentUser = await jira.users.getCurrentUser();
    console.log('Current user:', currentUser.displayName);

    // Get all projects
    const projects = await jira.projects.getAllProjects();
    console.log(`Found ${projects.values.length} projects:`);
    
    if (projects.values.length === 0) {
      console.log('No projects found. Please create a project in Jira first.');
      return;
    }

    // Use the first project for this example
    const project = projects.values[0];
    console.log(`Using project: ${project.name} (${project.key})`);

    // Get issue types for the project
    const issueTypes = await jira.projects.getProjectIssueTypes(project.key);
    console.log('Available issue types:', issueTypes.map(type => type.name));
    
    if (issueTypes.length === 0) {
      console.log('No issue types found for this project.');
      return;
    }

    // Use the first issue type (usually "Task")
    const issueType = issueTypes.find(type => type.name === 'Task') || issueTypes[0];
    console.log(`Using issue type: ${issueType.name}`);

    // Create a new issue
    const issueData: CreateIssueData = {
      fields: {
        project: { key: project.key },
        summary: 'Test issue created via API',
        description: 'This is a test issue created using the Jira API client.',
        issuetype: { id: issueType.id },
      },
    };

    console.log('Creating a new issue...');
    const newIssue = await jira.issues.createIssue(issueData);
    console.log(`Created issue: ${newIssue.key} - ${newIssue.fields.summary}`);

    // Get the issue details
    console.log('Fetching issue details...');
    const issue = await jira.issues.getIssue(newIssue.key);
    console.log(`Issue details: ${issue.key} - ${issue.fields.summary}`);
    console.log(`Status: ${issue.fields.status.name}`);

    // Add a comment to the issue
    console.log('Adding a comment...');
    const comment = await jira.issues.addComment(
      newIssue.key,
      'This is a comment added via the API client.'
    );
    console.log(`Added comment: ${comment.id}`);

    // Get available transitions
    console.log('Getting available transitions...');
    const transitions = await jira.issues.getTransitions(newIssue.key);
    console.log('Available transitions:', transitions.map(t => `${t.name} (${t.id})`));

    if (transitions.length > 0) {
      // Transition the issue to the first available transition
      const transition = transitions[0];
      console.log(`Transitioning issue to "${transition.name}"...`);
      await jira.issues.transitionIssue(newIssue.key, transition.id);
      console.log('Issue transitioned successfully');
    }

    // Update the issue
    console.log('Updating the issue...');
    await jira.issues.updateIssue(newIssue.key, {
      fields: {
        summary: `Updated: ${newIssue.fields.summary}`,
        description: 'This issue has been updated via the API client.',
      },
    });
    console.log('Issue updated successfully');

    // Get the updated issue
    const updatedIssue = await jira.issues.getIssue(newIssue.key);
    console.log(`Updated issue: ${updatedIssue.key} - ${updatedIssue.fields.summary}`);

    // Search for issues
    console.log('Searching for issues...');
    const searchResults = await jira.issues.searchIssues(
      `project = ${project.key} ORDER BY created DESC`,
      ['summary', 'status', 'created'],
      { maxResults: 5 }
    );
    
    console.log(`Found ${searchResults.total} issues, showing ${searchResults.values.length}:`);
    searchResults.values.forEach(issue => {
      console.log(`- ${issue.key}: ${issue.fields.summary} (${issue.fields.status.name})`);
    });

    // Uncomment to delete the issue
    // console.log('Deleting the issue...');
    // await jira.issues.deleteIssue(newIssue.key);
    // console.log('Issue deleted successfully');

    console.log('Example completed successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error); 