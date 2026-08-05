/**
 * Файл: `src/components/model-download-gate/index.tsx`
 * Предоставляет компонент ModelDownloadGate для отображения гейта загрузки локальной
 * языковой модели.
 *
 * Поддерживает:
 *  - содержимое приложения через `children`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ModelDownloadGate
 * 2. Типизировать пропсы через `ModelDownloadGateProps`
 *
 * Потребители:
 *  - `src/components/router/router-layout.tsx` — оборачивает каркас приложения гейтом загрузки
 *    модели
 */

import { type ReactNode } from 'react';

import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { ProgressBar } from '@ui/progress-bar';
import { Text } from '@ui/text';

import {
  StyledModelDownloadGate,
  StyledModelDownloadGateContent,
  StyledModelDownloadGateCopy,
} from './model-download-gate.styles';
import { useBrowserAiBootstrap } from './use-browser-ai-bootstrap';

/**
 * GATE_TITLE_ID — задаёт id заголовка карточки гейта для связи с `aria-labelledby`
 * индикатора прогресса.
 */
const GATE_TITLE_ID = 'model-download-gate-title';

/**
 * GATE_CARD_PADDING — задаёт `padding` карточки гейта.
 * Используется в Card активного гейта.
 */
const GATE_CARD_PADDING = 24;

/**
 * GATE_CARD_GAP — задаёт `gap` между слотами карточки гейта.
 * Используется в Card активного гейта.
 */
const GATE_CARD_GAP = 16;

/**
 * CHROME_UPDATE_PAGE_URL — задаёт url страницы обновления Chrome.
 * Используется в `handleOpenChromeUpdatePage` при недоступности модели.
 */
const CHROME_UPDATE_PAGE_URL = 'https://www.google.com/chrome/update/';

/**
 * GATE_TITLE_CHECKING — задаёт заголовок фазы проверки доступности модели.
 * Используется в `resolveGateTitle`.
 */
const GATE_TITLE_CHECKING = 'Checking on-device AI';

/**
 * GATE_TITLE_DOWNLOAD_REQUIRED — задаёт заголовок фазы запроса загрузки модели.
 * Используется в `resolveGateTitle`.
 */
const GATE_TITLE_DOWNLOAD_REQUIRED = 'On-device AI required';

/**
 * GATE_TITLE_DOWNLOADING — задаёт заголовок фазы загрузки модели.
 * Используется в `resolveGateTitle`.
 */
const GATE_TITLE_DOWNLOADING = 'Downloading on-device AI';

/**
 * GATE_TITLE_UNAVAILABLE — задаёт заголовок фазы недоступности модели.
 * Используется в `resolveGateTitle`.
 */
const GATE_TITLE_UNAVAILABLE = 'On-device AI unavailable';

/**
 * GATE_TITLE_ERROR — задаёт заголовок фазы ошибки подготовки модели.
 * Используется в `resolveGateTitle`.
 */
const GATE_TITLE_ERROR = 'Could not prepare on-device AI';

/**
 * ModelDownloadGateProps — представляет пропсы компонента ModelDownloadGate.
 *
 * @property children — содержимое приложения за гейтом
 */
type ModelDownloadGateProps = {
  children: ReactNode;
};

/**
 * resolveGateTitle — возвращает заголовок карточки гейта по текущей фазе подготовки модели.
 *
 * @param phase текущая фаза из `useBrowserAiBootstrap`
 * @returns текст заголовка для пропа `title` у Card
 */
function resolveGateTitle(
  phase: ReturnType<typeof useBrowserAiBootstrap>['phase']
): string {
  if (phase === 'checking') {
    return GATE_TITLE_CHECKING;
  }

  if (phase === 'download-required') {
    return GATE_TITLE_DOWNLOAD_REQUIRED;
  }

  if (phase === 'downloading') {
    return GATE_TITLE_DOWNLOADING;
  }

  if (phase === 'unavailable') {
    return GATE_TITLE_UNAVAILABLE;
  }

  return GATE_TITLE_ERROR;
}

/**
 * ModelDownloadGate — отображает экран подготовки локальной языковой модели или пропускает его
 * в режиме разработки.
 *
 * @example
 * <ModelDownloadGate>
 *   <Header autoHide={autoHide} onSettingsClick={handleSettingsClick} />
 *   <Outlet context={outletContext} />
 * </ModelDownloadGate>
 */
export function ModelDownloadGate({ children }: ModelDownloadGateProps) {
  // Только в режиме разработки: пропускает гейт, чтобы UI работал без локальной модели.
  // Сборка vite build оставляет гейт.
  if (import.meta.env.DEV) {
    return children;
  }

  return <ModelDownloadGateActive>{children}</ModelDownloadGateActive>;
}

/**
 * ModelDownloadGateActive — отображает фазы проверки, загрузки и ошибок локальной языковой
 * модели.
 */
function ModelDownloadGateActive({ children }: ModelDownloadGateProps) {
  const { error, loadedRatio, phase, retryDownload, startDownload } =
    useBrowserAiBootstrap();

  if (phase === 'ready') {
    return children;
  }

  const backgroundTabHint = (
    <Text as="p" tone="muted">
      You can switch to other browser tabs while the download continues in the
      background.
    </Text>
  );

  function handleOpenChromeUpdatePage(): void {
    void chrome.tabs.create({ url: CHROME_UPDATE_PAGE_URL });
  }

  return (
    <StyledModelDownloadGate>
      <Card
        as="section"
        gap={GATE_CARD_GAP}
        padding={GATE_CARD_PADDING}
        title={resolveGateTitle(phase)}
        titleId={GATE_TITLE_ID}
      >
        <StyledModelDownloadGateContent>
          <StyledModelDownloadGateCopy>
            {phase === 'checking' && (
              <Text as="p" tone="muted">
                Searching for the local language model required by this app.
              </Text>
            )}

            {phase === 'download-required' && (
              <>
                <Text as="p">
                  This app requires a one-time download of the on-device language model.
                </Text>
                {backgroundTabHint}
              </>
            )}

            {phase === 'downloading' && (
              <>
                <Text as="p">
                  Setting up the local language model. This may take several minutes.
                </Text>
                {backgroundTabHint}
              </>
            )}

            {phase === 'unavailable' && (
              <>
                <Text as="p">
                  This app requires on-device AI, but it is not available on this device.
                </Text>
                <Text as="p" tone="muted">
                  Use Chrome 138+ on desktop with enough free disk space and check
                  chrome://on-device-internals.
                </Text>
              </>
            )}

            {phase === 'error' && (
              <>
                <Text as="p">
                  The local language model could not be downloaded or initialized.
                </Text>
                {error != null && (
                  <Text as="p" sizePreset="thin" tone="muted">
                    {error.message}
                  </Text>
                )}
              </>
            )}
          </StyledModelDownloadGateCopy>

          {phase === 'downloading' && (
            <ProgressBar aria-labelledby={GATE_TITLE_ID} value={loadedRatio} />
          )}

          {phase === 'download-required' && (
            <Button tone="primary" onClick={startDownload}>
              Download
            </Button>
          )}

          {phase === 'unavailable' && (
            <Button tone="primary" onClick={handleOpenChromeUpdatePage}>
              Update Chrome
            </Button>
          )}

          {phase === 'error' && (
            <Button tone="primary" onClick={retryDownload}>
              Try again
            </Button>
          )}
        </StyledModelDownloadGateContent>
      </Card>
    </StyledModelDownloadGate>
  );
}
