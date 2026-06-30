import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileMenu } from '@components/profile-menu';
import { ThemeToggle } from '@components/theme-toggle';
import { SettingsIcon } from '@icons/settings';
import { RoundButton } from '@ui/round-button';
import { Text } from '@ui/text';

import {
  HeaderShellStyle,
  StyledHeader,
  StyledHeaderActions,
  StyledHeaderBar,
  StyledHeaderBrand,
  StyledHeaderProject,
} from './header.styles';
import { useHeaderAutoHide } from './use-header-auto-hide';

type HeaderProps = {
  /** true — хедер скрывается и всплывает по наведению на верхнюю кромку; false — стики. */
  autoHide?: boolean;
  /** Бренд слева; по умолчанию «Project Name». */
  brand?: ReactNode;
  /** Слот центральной колонки (rename/nav в продукте). */
  center?: ReactNode;
  /** Узлы в actions перед шестерёнкой (продукт: LocaleSwitcher). */
  leadingActions?: ReactNode;
  /** Действие кнопки-шестерёнки. По умолчанию — переход на страницу дизайн-системы. */
  onSettingsClick?: () => void;
  /** Доступное имя шестерёнки — отражает её действие в текущем контексте. */
  settingsLabel?: string;
};

export function Header({
  autoHide = false,
  brand,
  center,
  leadingActions,
  onSettingsClick,
  settingsLabel = 'Design system',
}: HeaderProps) {
  const navigate = useNavigate();
  const { dataRevealed, onMouseEnter, onMouseLeave } = useHeaderAutoHide(autoHide);
  const handleSettingsClick = onSettingsClick ?? (() => navigate('/design-system'));
  const brandNode = brand ?? <Text sizePreset="bold">Project Name</Text>;

  return (
    <>
      <HeaderShellStyle />
      <StyledHeader
        $autoHide={autoHide}
        data-revealed={dataRevealed}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
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
