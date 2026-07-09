import { type ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { ProgressBar } from '@ui/progress-bar';
import { Text } from '@ui/text';

import {
  StyledModelDownloadGate,
  StyledModelDownloadGateCard,
  StyledModelDownloadGateCopy,
} from './model-download-gate.styles';
import { useBrowserAiBootstrap } from './use-browser-ai-bootstrap';

const GATE_TITLE_ID = 'model-download-gate-title';

const CHROME_UPDATE_PAGE_URL = 'https://www.google.com/chrome/update/';

type ModelDownloadGateProps = {
  children: ReactNode;
};

function openChromeUpdatePage(): void {
  void chrome.tabs.create({ url: CHROME_UPDATE_PAGE_URL });
}

function gateTitle(phase: ReturnType<typeof useBrowserAiBootstrap>['phase']): string {
  if (phase === 'checking') {
    return 'Checking on-device AI';
  }

  if (phase === 'download-required') {
    return 'On-device AI required';
  }

  if (phase === 'downloading') {
    return 'Downloading on-device AI';
  }

  if (phase === 'unavailable') {
    return 'On-device AI unavailable';
  }

  return 'Could not prepare on-device AI';
}

export function ModelDownloadGate({ children }: ModelDownloadGateProps) {
  /** Dev-only: skip gate so UI/DS work without on-device model; `vite build` keeps prod gate. */
  if (import.meta.env.DEV) {
    return children;
  }

  return <ModelDownloadGateActive>{children}</ModelDownloadGateActive>;
}

function ModelDownloadGateActive({ children }: ModelDownloadGateProps) {
  const theme = useTheme();
  const { error, loadedRatio, phase, retryDownload, startDownload } =
    useBrowserAiBootstrap();

  if (phase === 'ready') {
    return children;
  }

  return (
    <StyledModelDownloadGate>
      <Card gap={16} padding={24} title={gateTitle(phase)} titleId={GATE_TITLE_ID}>
        <StyledModelDownloadGateCard>
          <StyledModelDownloadGateCopy>
            {phase === 'checking' && (
              <Text as="p" color={theme.colors.muted} sizePreset="normal">
                Searching for the local language model required by this app.
              </Text>
            )}

            {phase === 'download-required' && (
              <>
                <Text as="p" sizePreset="normal">
                  This app requires a one-time download of the on-device language model.
                </Text>
                <Text as="p" color={theme.colors.muted} sizePreset="normal">
                  You can switch to other browser tabs while the download continues in
                  the background.
                </Text>
              </>
            )}

            {phase === 'downloading' && (
              <>
                <Text as="p" sizePreset="normal">
                  Setting up the local language model. This may take several minutes.
                </Text>
                <Text as="p" color={theme.colors.muted} sizePreset="normal">
                  You can switch to other browser tabs while the download continues in
                  the background.
                </Text>
              </>
            )}

            {phase === 'unavailable' && (
              <>
                <Text as="p" sizePreset="normal">
                  This app requires on-device AI, but it is not available on this device.
                </Text>
                <Text as="p" color={theme.colors.muted} sizePreset="normal">
                  Use Chrome 138+ on desktop with enough free disk space and check
                  chrome://on-device-internals.
                </Text>
              </>
            )}

            {phase === 'error' && (
              <>
                <Text as="p" sizePreset="normal">
                  The local language model could not be downloaded or initialized.
                </Text>
                {error != null && (
                  <Text as="p" color={theme.colors.muted} sizePreset="medium">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          </StyledModelDownloadGateCopy>

          {phase === 'downloading' && (
            <ProgressBar
              aria-labelledby={GATE_TITLE_ID}
              showLabel={true}
              value={loadedRatio}
            />
          )}

          {phase === 'download-required' && (
            <Button tone="primary" onClick={startDownload}>
              Download
            </Button>
          )}

          {phase === 'unavailable' && (
            <Button tone="primary" onClick={openChromeUpdatePage}>
              Update Chrome
            </Button>
          )}

          {phase === 'error' && (
            <Button tone="primary" onClick={retryDownload}>
              Try again
            </Button>
          )}
        </StyledModelDownloadGateCard>
      </Card>
    </StyledModelDownloadGate>
  );
}
