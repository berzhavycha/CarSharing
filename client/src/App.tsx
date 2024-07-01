import '@fontsource/plus-jakarta-sans';
import '@fontsource/plus-jakarta-sans/300.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import { RouterProvider } from 'react-router-dom';

import { CSStoreProvider } from './context';
import { router } from './router';

function App(): JSX.Element {
  return (
    <CSStoreProvider>
      <RouterProvider router={router} />
    </CSStoreProvider>
  );
}

export default App;
