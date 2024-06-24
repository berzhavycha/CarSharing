import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { UserSettings } from '@/components';
import { DashboardSidebar, Header } from '@/layouts';
import { MainUserPage, SignInPage, SignUpPage } from '@/pages';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Header />}>
        <Route index element={<MainUserPage />} />
      </Route>
      <Route path="dashboard" element={<DashboardSidebar />}>
        <Route path="settings" element={<UserSettings />} />
      </Route>
      <Route path="sign-up" element={<SignUpPage />} />
      <Route path="sign-in" element={<SignInPage />} />
    </>,
  ),
);
