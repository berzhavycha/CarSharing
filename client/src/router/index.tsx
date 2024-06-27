import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { CSDashboardCarForm, CSDashboardCarReport, CSDashboardProfileSettingsForm } from '@/components';
import { CSDashboardSidebar, CSHeaderLayout, CSProtectedRoute } from '@/layouts';
import { CSMainUserPage, CSSignInPage, CSSignUpPage } from '@/pages';
import { addNewCar } from '@/services';
import { isAdmin, ONLY_ADMIN_PAGE_ERROR } from '@/helpers';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<CSHeaderLayout />}>
        <Route index element={<CSMainUserPage />} />
      </Route>
      <Route element={<CSProtectedRoute isAllowed={isAdmin} errorMessage={ONLY_ADMIN_PAGE_ERROR} />}>
        <Route path="dashboard" element={<CSDashboardSidebar />}>
          <Route path="settings" element={<CSDashboardProfileSettingsForm />} />
          <Route path="car-report" element={<CSDashboardCarReport />} />
          <Route path="add-car" element={<CSDashboardCarForm onFormSubmit={addNewCar} />} />
        </Route>
      </Route>
      <Route path="sign-up" element={<CSSignUpPage />} />
      <Route path="sign-in" element={<CSSignInPage />} />
    </>,
  ),
);
