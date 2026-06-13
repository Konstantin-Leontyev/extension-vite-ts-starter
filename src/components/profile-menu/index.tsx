import { Fragment, useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'styled-components';

import { AvatarIcon } from '@icons/avatar';
import { CloseIcon } from '@icons/close';
import { SignOutIcon } from '@icons/sign-out';
import { Card } from '@ui/card';
import { RoundButton } from '@ui/round-button';
import { SegmentButton } from '@ui/segment-button';
import { Text } from '@ui/text';

import {
  StyledProfileMenu,
  StyledProfileMenuActions,
  StyledProfileMenuContent,
  StyledProfileMenuHeader,
  StyledProfileMenuLegal,
  StyledProfileMenuLegalLink,
} from './profile-menu.styles';
import { PROFILE_STUB } from './profile-stub';

const PROFILE_MENU_LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
] as const;

export function ProfileMenu() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const { displayEmail, displayName } = PROFILE_STUB;

  const closeMenu = useCallback((): void => {
    setIsOpen(false);
  }, []);

  function handleToggle(): void {
    setIsOpen((current) => !current);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeMenu, isOpen]);

  return (
    <StyledProfileMenu ref={rootRef}>
      <RoundButton
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Profile menu for ${displayName}`}
        title={displayEmail}
        onClick={handleToggle}
      >
        <AvatarIcon />
      </RoundButton>

      {isOpen && (
        <Card
          aria-modal="true"
          icon={<CloseIcon />}
          iconAriaLabel="Close profile menu"
          id={menuId}
          insetBlockStart={40}
          insetInlineEnd={0}
          marginBlockStart={12}
          maxBlockSize="calc(100dvb - 6.25rem)"
          maxInlineSize="calc(100vw - 4rem)"
          minBlockSize="0"
          minInlineSize="min(360px, calc(100vw - 4rem))"
          position="absolute"
          role="dialog"
          subtitle={displayEmail}
          subtitleAlign="center"
          zIndex="20"
          onIconClick={closeMenu}
        >
          <StyledProfileMenuContent>
            <StyledProfileMenuHeader>
              <RoundButton aria-hidden="true" sizePreset="huge" tabIndex={-1}>
                <AvatarIcon />
              </RoundButton>
              <Text align="center" as="p" sizePreset="extraBold">
                Hello, {displayName}!
              </Text>
            </StyledProfileMenuHeader>

            <StyledProfileMenuActions>
              <SegmentButton
                shape="round"
                left={{ text: 'Profile', onClick: closeMenu }}
                right={{
                  icon: <SignOutIcon />,
                  text: 'Sign out',
                  onClick: closeMenu,
                }}
              />
            </StyledProfileMenuActions>

            <StyledProfileMenuLegal aria-label="Legal">
              {PROFILE_MENU_LEGAL_LINKS.map((link, index) => (
                <Fragment key={link.to}>
                  {index > 0 && (
                    <Text aria-hidden="true" color={theme.colors.muted}>
                      ·
                    </Text>
                  )}
                  <StyledProfileMenuLegalLink to={link.to} onClick={closeMenu}>
                    <Text align="center" sizePreset="thin">
                      {link.label}
                    </Text>
                  </StyledProfileMenuLegalLink>
                </Fragment>
              ))}
            </StyledProfileMenuLegal>
          </StyledProfileMenuContent>
        </Card>
      )}
    </StyledProfileMenu>
  );
}
