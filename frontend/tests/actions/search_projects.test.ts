import { describe, expect, it } from 'vitest';
import { searchProjects } from '../../src/actions/display_helpers/search_projects';
import { filterProjects } from '../../src/actions/display_helpers/filter_projects';
import { checkAccountForm } from '../../src/actions/display_helpers/check_account_form';
import { checkProjectForm } from '../../src/actions/display_helpers/check_project_form';

const project = {
  id: 'sample', title: { en: 'Planner', ar: 'المخطط' },
  description: { en: 'Plan sessions', ar: 'تخطيط الجلسات' },
  category: { en: 'Planning', ar: 'التخطيط' }, status: 'live' as const,
  toolPath: '/demo/tools/sample', createdAt: '2026-10-12', updatedAt: '2026-10-12',
};

describe('project browsing', () => {
  it('searches the active language with trimmed case-insensitive input', () => {
    expect(searchProjects([project], ' PLANNER ', 'en')).toEqual([project]);
    expect(searchProjects([project], 'الجلسات', 'ar')).toEqual([project]);
    expect(searchProjects([project], 'Planner', 'ar')).toEqual([]);
  });
  it('filters status without changing the source list', () => {
    expect(filterProjects([project], 'maintenance')).toEqual([]);
    expect(filterProjects([project], 'all')).toEqual([project]);
  });
});

describe('form feedback', () => {
  it('requires both language titles and descriptions', () => {
    const input = { ...project, title: { en: 'Planner', ar: ' ' }, privateNotes: '' };
    expect(checkProjectForm(input).title_ar).toBe('required');
  });
  it('rejects real addresses and allows fictional addresses', () => {
    const input = { name: 'Sample', email: 'person@gmail.com', role: 'counselor' as const, isActive: true };
    expect(checkAccountForm(input).email).toBe('demoEmailRequired');
    expect(checkAccountForm({ ...input, email: 'person@demo.example' })).toEqual({});
  });
});
