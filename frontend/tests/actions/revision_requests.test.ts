import { expect, it } from 'vitest';
import { createProjectInput } from '../../src/actions/display_helpers/create_project_input';
import { createAccountInput } from '../../src/actions/display_helpers/create_account_input';
import { writeProjectRequest } from '../../src/server_connection/data_conversion/write_project_request';
import { writeAccountRequest } from '../../src/server_connection/data_conversion/write_account_request';
import { readProjectResponse } from '../../src/server_connection/data_conversion/read_project_response';
import { readAccountResponse } from '../../src/server_connection/data_conversion/read_account_response';

const project = { id: 'sample', revision: 7, title: { en: 'Sample', ar: 'عينة' },
  description: { en: 'Fictional', ar: 'وهمي' }, category: { en: 'General', ar: 'عام' }, status: 'live' as const,
  toolPath: '/demo/tools/sample', privateNotes: '', createdAt: '2026-10-13', updatedAt: '2026-10-13' };
const account = { id: 'sample', revision: 4, name: 'Sample', email: 'sample@demo.example',
  role: 'admin' as const, isActive: true, isFixed: false };

it('carries the opened project revision into edit requests', () => {
  const response = { ...project, tool_path: project.toolPath, created_at: project.createdAt, updated_at: project.updatedAt };
  const input = createProjectInput(readProjectResponse(response));
  expect(writeProjectRequest(input)).toMatchObject({ expected_revision: 7 });
});

it('carries the opened account revision into edit requests', () => {
  const response = { ...account, is_active: true, is_fixed: false };
  const input = createAccountInput(readAccountResponse(response));
  expect(writeAccountRequest(input)).toMatchObject({ expected_revision: 4 });
});

it('does not send an edit revision when creating a new record', () => {
  expect(writeProjectRequest(createProjectInput())).not.toHaveProperty('expected_revision');
  expect(writeAccountRequest(createAccountInput())).not.toHaveProperty('expected_revision');
});
