import { useNavigate } from 'react-router-dom';

import { ProfileMenu } from '@components/profile-menu';
import { ThemeToggle } from '@components/theme-toggle';
import { SettingsIcon } from '@icons/settings';
import { RoundButton } from '@ui/round-button';
import { Text } from '@ui/text';

import { StyledHeader, StyledHeaderActions, StyledHeaderBrand } from './header.styles';

export function Header() {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <StyledHeaderBrand end to="/">
        <Text sizePreset="bold">Project Name</Text>
      </StyledHeaderBrand>

      <StyledHeaderActions>
        <RoundButton
          aria-label="Design system"
          onClick={() => navigate('/design-system')}
        >
          <SettingsIcon />
        </RoundButton>
        <ThemeToggle />
        <ProfileMenu />
      </StyledHeaderActions>
    </StyledHeader>
  );
}
