import { CalendarDays, LibraryBig, ClipboardList, Bell, Palette, NotebookPen, Heart, Users, Archive } from 'lucide-react';
import type { ProjectStatus } from '../../data_models/project_status';
import './ProjectIcon.css';

const icons = { 'session planning': CalendarDays, resources: LibraryBig, intake: ClipboardList,
  'follow-ups': Bell, workshops: Palette, wellbeing: Heart, planning: CalendarDays, referrals: Users };

export function ProjectIcon({ category, status }: { category: string; status: ProjectStatus }) {
  const Icon = status === 'archived' ? Archive : icons[category.toLowerCase() as keyof typeof icons] ?? NotebookPen;
  return <span className="project-icon"><Icon size={25} strokeWidth={1.8} aria-hidden="true" /></span>;
}
