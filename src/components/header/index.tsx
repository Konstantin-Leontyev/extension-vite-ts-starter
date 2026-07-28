/**
 * Файл: `src/components/header/index.tsx`
 * Предоставляет компонент Header для отображения шапки страницы.
 *
 * Поддерживает:
 *  - режим скрытия шапки через проп `autoHide`
 *  - содержимое бренда слева через проп `brand`
 *  - содержимое центральной колонки через проп `center`
 *  - узлы перед кнопкой настроек через проп `leadingActions`
 *  - обработчик кнопки настроек через проп `onSettingsClick`
 *  - доступное имя кнопки настроек через проп `settingsLabel`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Header
 * 2. Типизировать пропсы через `HeaderProps`
 * 3. Реэкспортировать `HEADER_BLOCK_SIZE`
 * 4. Выставлять `aria-label` кнопки настроек
 *
 * Потребители:
 *  - `src/components/router/router-layout.tsx` — рендерит Header в каркасе страницы
 *  - `src/pages/showcase/showcase.styles.ts` — читает `HEADER_BLOCK_SIZE` для высоты витрины
 *  - `src/context/toast/toast.styles.ts` — читает `HEADER_BLOCK_SIZE` для высоты стека уведомлений
 */

import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileMenu } from '@components/profile-menu';
import { ThemeToggle } from '@components/theme-toggle';
import { SettingsIcon } from '@icons';
import { RoundButton } from '@ui/round-button';
import { Text } from '@ui/text';

import {
  DEFAULT_HEADER_AUTO_HIDE,
  HEADER_BLOCK_SIZE,
  HeaderShellStyle,
  StyledHeader,
  StyledHeaderActions,
  StyledHeaderBar,
  StyledHeaderBrand,
  StyledHeaderProject,
} from './header.styles';
import { useHeaderAutoHide } from './use-header-auto-hide';

/**
 * DEFAULT_HEADER_SETTINGS_LABEL — задаёт доступное имя кнопки настроек по умолчанию.
 * Используется, когда вызывающий код не передал проп `settingsLabel`.
 */
const DEFAULT_HEADER_SETTINGS_LABEL = 'Showcase';

/**
 * HeaderProps — представляет пропсы компонента Header.
 *
 * @property autoHide — включает режим скрытия шапки
 * @property brand — содержимое бренда слева
 * @property center — содержимое центральной колонки
 * @property leadingActions — узлы перед кнопкой настроек в ряду действий
 * @property onSettingsClick — обработчик нажатия кнопки настроек
 * @property settingsLabel — доступное имя кнопки настроек
 */
type HeaderProps = {
  autoHide?: boolean;
  brand?: ReactNode;
  center?: ReactNode;
  leadingActions?: ReactNode;
  onSettingsClick?: () => void;
  settingsLabel?: string;
};

/**
 * Header — отображает шапку страницы с брендом, центральным слотом и рядом действий.
 *
 * @example
 * <Header />
 * <Header autoHide brand={<Text sizePreset="bold">AlgoTrade</Text>} />
 */
export function Header({
  autoHide,
  brand,
  center,
  leadingActions,
  onSettingsClick,
  settingsLabel = DEFAULT_HEADER_SETTINGS_LABEL,
}: HeaderProps) {
  const navigate = useNavigate();
  const { dataRevealed, handleMouseEnter, handleMouseLeave } = useHeaderAutoHide(
    autoHide ?? DEFAULT_HEADER_AUTO_HIDE
  );
  const handleSettingsClick = onSettingsClick ?? (() => navigate('/showcase'));
  const brandNode = brand ?? <Text sizePreset="bold">Project Name</Text>;

  return (
    <>
      <HeaderShellStyle />
      <StyledHeader
        autoHide={autoHide}
        data-revealed={dataRevealed}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <StyledHeaderBar>
          <StyledHeaderBrand end to="/">
            {brandNode}
          </StyledHeaderBrand>

          {Boolean(center) && <StyledHeaderProject>{center}</StyledHeaderProject>}

          <StyledHeaderActions>
            {leadingActions}
            <RoundButton aria-label={settingsLabel} onClick={handleSettingsClick}>
              <SettingsIcon />
            </RoundButton>
            <ThemeToggle />
            <ProfileMenu />
          </StyledHeaderActions>
        </StyledHeaderBar>
      </StyledHeader>
    </>
  );
}

export { HEADER_BLOCK_SIZE };
