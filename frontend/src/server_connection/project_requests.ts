import type { ProjectOperations } from '../actions/data_interfaces/project_operations';
import { readProjectResponse } from './data_conversion/read_project_response';
import { writeProjectRequest } from './data_conversion/write_project_request';
import type { ProjectResponse } from './message_shapes/project_response';
import { sendRequest } from './send_request';

export const projectRequests: ProjectOperations = {
  list: async () => {
    const data = await sendRequest<{ projects: ProjectResponse[] }>('/api/projects');
    return data.projects.map(readProjectResponse);
  },
  get: async identifier => {
    const data = await sendRequest<{ project: ProjectResponse }>(`/api/projects/${encodeURIComponent(identifier)}`);
    return readProjectResponse(data.project);
  },
  add: async input => {
    const data = await sendRequest<{ project: ProjectResponse }>('/api/projects', { method: 'POST', body: writeProjectRequest(input) });
    return readProjectResponse(data.project);
  },
  edit: async (identifier, input) => {
    const data = await sendRequest<{ project: ProjectResponse }>(`/api/projects/${encodeURIComponent(identifier)}`,
      { method: 'PATCH', body: writeProjectRequest(input) });
    return readProjectResponse(data.project);
  },
  remove: identifier => sendRequest(`/api/projects/${encodeURIComponent(identifier)}`, { method: 'DELETE' }),
};
