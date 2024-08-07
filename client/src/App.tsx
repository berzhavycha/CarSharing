import { RouterProvider } from 'react-router-dom';

import { GlobalStyles } from '@/styles';

import { CSStoreProvider } from './context';
import { router } from './router';

function App(): JSX.Element {
  return (
    <CSStoreProvider>
      <GlobalStyles />
      <RouterProvider router={router} />
    </CSStoreProvider>
  );
}

export default App;
