import type { Project } from '../../data_models/project';
import { useActions } from './ActionSettings';
import { useScreenData } from './use_screen_data';

export function useProjects() { return useScreenData<Project[]>(useActions().projects.list, []); }
