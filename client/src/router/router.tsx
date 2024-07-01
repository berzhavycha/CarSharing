import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import {
  carLoader,
  carsLoader,
  CSDashboardCarEditForm,
  CSDashboardCarForm,
  CSDashboardCarReport,
  CSDashboardProfileSettings,
  CSDashboardTransactions,
  transactionsLoader,
} from '@/components';
import { isAdmin, ONLY_ADMIN_PAGE_ERROR } from '@/helpers';
import { CSDashboardSidebar, CSHeaderLayout, CSProtectedRoute } from '@/layouts';
import { CSMainUserPage, CSSignInPage, CSSignUpPage } from '@/pages';
import { addNewCar } from '@/services';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<CSHeaderLayout />}>
        <Route index element={<CSMainUserPage />} />
      </Route>
      <Route
        element={<CSProtectedRoute isAllowed={isAdmin} errorMessage={ONLY_ADMIN_PAGE_ERROR} />}
      >
        <Route path="dashboard" element={<CSDashboardSidebar />}>
          <Route path="settings" element={<CSDashboardProfileSettings />} />
          <Route
            path="transactions"
            element={<CSDashboardTransactions />}
            loader={transactionsLoader}
          />
          <Route path="car-report" element={<CSDashboardCarReport />} loader={carsLoader} />
          <Route path="add-car" element={<CSDashboardCarForm onFormSubmit={addNewCar} />} />
          <Route path="edit-car" element={<CSDashboardCarEditForm />} loader={carLoader} />
        </Route>
      </Route>
      <Route path="sign-up" element={<CSSignUpPage />} />
      <Route path="sign-in" element={<CSSignInPage />} />
    </>,
  ),
);
