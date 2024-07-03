import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import { isAdmin, isRegularUser, ONLY_ADMIN_PAGE_ERROR, ONLY_USER_PAGE_ERROR } from '@/helpers';
import { CSDashboardSidebar, CSMainLayout, CSProtectedRoute } from '@/layouts';
import {
  allCarsLoader,
  availableCarsLoader,
  carLoader,
  CSDashboardAddCarPage,
  CSDashboardCarsPage,
  CSDashboardEditCarPage,
  CSDashboardProfileSettingsPage,
  CSDashboardTransactionsPage,
  CSMainAvailableCarsPage,
  CSMainRentalHistoryPage,
  CSMainRentalPaymentPage,
  CSMainSingleCarPage,
  CSMainSingleRentalPage,
  CSMainUserPage,
  CSMainUserProfileSettingsPage,
  CSMainUserTopUpPage,
  CSSignInPage,
  CSSignUpPage,
  initialCarsLoader,
  rentalHistoryLoader,
  singleCarLoader,
  transactionsLoader,
} from '@/pages';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        element={<CSProtectedRoute isAllowed={isRegularUser} errorMessage={ONLY_USER_PAGE_ERROR} />}
      >
        <Route path="/" element={<CSMainLayout />}>
          <Route index element={<CSMainUserPage />} loader={initialCarsLoader} />
          <Route
            path="available-cars"
            element={<CSMainAvailableCarsPage />}
            loader={availableCarsLoader}
          />
          <Route
            path="available-cars/:carId"
            element={<CSMainSingleCarPage />}
            loader={singleCarLoader}
          />
          <Route path="rental-form" element={<CSMainRentalPaymentPage />} />
          <Route path="top-up" element={<CSMainUserTopUpPage />} />
          <Route path="profile-settings" element={<CSMainUserProfileSettingsPage />} />
          <Route path="rental-history" element={<CSMainRentalHistoryPage />} loader={rentalHistoryLoader} />
          <Route path="rental-history/:rentalId" element={<CSMainSingleRentalPage />} loader={rentalHistoryLoader} />
        </Route>
      </Route>
      <Route
        element={<CSProtectedRoute isAllowed={isAdmin} errorMessage={ONLY_ADMIN_PAGE_ERROR} />}
      >
        <Route path="dashboard" element={<CSDashboardSidebar />}>
          <Route path='profile-settings' element={<CSDashboardProfileSettingsPage />} />
          <Route
            path="transactions"
            element={<CSDashboardTransactionsPage />}
            loader={transactionsLoader}
          />
          <Route path="car-report" element={<CSDashboardCarsPage />} loader={allCarsLoader} />
          <Route path="add-car" element={<CSDashboardAddCarPage />} />
          <Route path="edit-car" element={<CSDashboardEditCarPage />} loader={carLoader} />
        </Route>
      </Route>
      <Route path="sign-up" element={<CSSignUpPage />} />
      <Route path="sign-in" element={<CSSignInPage />} />
    </>,
  ),
);
