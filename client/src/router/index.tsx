import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { CSDashboardCarReport, CSDashboardProfileSettingsForm } from '@/components';
import { CSDashboardSidebar, CSHeaderLayout } from '@/layouts';
import { CSMainUserPage, CSSignInPage, CSSignUpPage } from '@/pages';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<CSHeaderLayout />}>
        <Route index element={<CSMainUserPage />} />
      </Route>
      <Route path="dashboard" element={<CSDashboardSidebar />}>
        <Route path="settings" element={<CSDashboardProfileSettingsForm />} />
        <Route path="car-report" element={<CSDashboardCarReport />} />
      </Route>
      <Route path="sign-up" element={<CSSignUpPage />} />
      <Route path="sign-in" element={<CSSignInPage />} />
    </>,
  ),
);
