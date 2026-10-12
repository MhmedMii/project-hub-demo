import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../user_interface/pages/LoginPage';
import { ProjectsPage } from '../user_interface/pages/ProjectsPage';
import { AdminPage } from '../user_interface/pages/AdminPage';
import { ToolPreviewPage } from '../user_interface/pages/ToolPreviewPage';
import { PageLayout } from '../user_interface/page_layout/PageLayout';
import { AuthenticatedPage } from '../user_interface/page_layout/AuthenticatedPage';
import { AdminAccess } from '../user_interface/page_layout/AdminAccess';

export function PageRoutes() {
  return <Routes><Route path="/login" element={<LoginPage />} />
    <Route element={<AuthenticatedPage />}><Route element={<PageLayout />}>
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/admin" element={<AdminAccess><AdminPage /></AdminAccess>} />
      <Route path="/demo/tools/:projectId" element={<ToolPreviewPage />} />
    </Route></Route><Route path="*" element={<Navigate to="/projects" replace />} />
  </Routes>;
}
