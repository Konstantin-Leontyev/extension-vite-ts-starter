import { Outlet } from 'react-router-dom';

import { Header } from '@components/header';
import { ModelDownloadGate } from '@components/model-download-gate';

export function RouterLayout() {
  return (
    <ModelDownloadGate>
      <Header />
      <Outlet />
    </ModelDownloadGate>
  );
}
