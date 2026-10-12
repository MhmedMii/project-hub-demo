export const projectStatuses = ['live', 'maintenance', 'development', 'archived'] as const;
export type ProjectStatus = typeof projectStatuses[number];
export type StatusFilter = ProjectStatus | 'all';
