import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProfileMenu } from '@components/profile-menu';
import { ThemeToggle } from '@components/theme-toggle';
import { SettingsIcon } from '@icons/settings';
import { RoundButton } from '@ui/round-button';
import { Text } from '@ui/text';

import {
  StyledHeader,
  StyledHeaderActions,
  StyledHeaderBar,
  StyledHeaderBrand,
} from './header.styles';

type HeaderProps = {
  /** true — хедер скрывается и всплывает по наведению на верхнюю кромку; false — стики. */
  autoHide?: boolean;
  /** Действие кнопки-шестерёнки. По умолчанию — переход на страницу дизайн-системы. */
  onSettingsClick?: () => void;
  /** Доступное имя шестерёнки — отражает её действие в текущем контексте. */
  settingsLabel?: string;
};

export function Header({
  autoHide = false,
  onSettingsClick,
  settingsLabel = 'Design system',
}: HeaderProps) {
  const navigate = useNavigate();
  /* Только для autoHide: хедер свёрнут в полосу-инсет, всплывает по наведению. */
  const [revealed, setRevealed] = useState(false);

  const handleSettingsClick = onSettingsClick ?? (() => navigate('/design-system'));

  return (
    <StyledHeader
      $autoHide={autoHide}
      data-revealed={autoHide ? revealed : undefined}
      onMouseEnter={autoHide ? () => setRevealed(true) : undefined}
      onMouseLeave={autoHide ? () => setRevealed(false) : undefined}
    >
      <StyledHeaderBar>
        <StyledHeaderBrand end to="/">
          <Text sizePreset="bold">Project Name</Text>
        </StyledHeaderBrand>

        <StyledHeaderActions>
          <RoundButton aria-label={settingsLabel} onClick={handleSettingsClick}>
            <SettingsIcon />
          </RoundButton>
          <ThemeToggle />
          <ProfileMenu />
        </StyledHeaderActions>
      </StyledHeaderBar>
    </StyledHeader>
  );
}
