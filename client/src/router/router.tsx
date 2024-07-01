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
import { isAdmin, isRegularUser, ONLY_ADMIN_PAGE_ERROR, ONLY_USER_PAGE_ERROR } from '@/helpers';
import { CSDashboardSidebar, CSMainLayout, CSProtectedRoute } from '@/layouts';
import { CSMainUserPage, CSSignInPage, CSSignUpPage, initialCarsLoader } from '@/pages';
import { addNewCar } from '@/services';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<CSProtectedRoute isAllowed={isRegularUser} errorMessage={ONLY_USER_PAGE_ERROR} />}>
        <Route path="/" element={<CSMainLayout />}>
          <Route index element={<CSMainUserPage />} loader={initialCarsLoader} />
        </Route>
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
