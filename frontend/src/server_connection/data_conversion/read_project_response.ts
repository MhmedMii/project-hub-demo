import type { Project } from '../../data_models/project';
import type { ProjectResponse } from '../message_shapes/project_response';

export function readProjectResponse(data: ProjectResponse): Project {
  return {
    id: data.id, title: data.title, description: data.description, category: data.category,
    status: data.status, toolPath: data.tool_path, createdAt: data.created_at, updatedAt: data.updated_at,
    revision: data.revision,
    ...(data.private_notes === undefined ? {} : { privateNotes: data.private_notes }),
  };
}
