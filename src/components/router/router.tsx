import { createHashRouter } from 'react-router-dom';

import { RouterLayout } from '@components/router';
import { DesignSystemPage } from '@pages/design-system';
import { HomePage } from '@pages/home';
import { PrivacyPage } from '@pages/privacy';
import { TermsPage } from '@pages/terms';

export const router = createHashRouter([
  {
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        element: <DesignSystemPage />,
        path: 'design-system',
      },
      {
        element: <PrivacyPage />,
        path: 'privacy',
      },
      {
        element: <TermsPage />,
        path: 'terms',
      },
    ],
    element: <RouterLayout />,
  },
]);
