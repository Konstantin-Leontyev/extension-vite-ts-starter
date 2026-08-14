/**
 * Файл: `src/components/profile-menu/index.tsx`
 * Предоставляет компонент ProfileMenu для отображения меню профиля в шапке.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *
 * Основные задачи:
 * 1. Экспортировать компонент ProfileMenu
 * 2. Типизировать пропсы через `ProfileMenuProps`
 * 3. Выставлять `role` и `aria`-атрибуты панели и триггера.
 *    Фокус панели — на первом действии
 *
 * Потребители:
 *  - `src/components/header/index.tsx` — рендерит меню профиля в шапке
 */

import { Fragment, useId, useRef, useState, type ComponentPropsWithRef } from 'react';

import { getFocusables } from '@hooks/use-focus';
import { AddCircleIcon, AvatarIcon, CloseIcon, SignOutIcon } from '@icons';
import { AnchoredPortal } from '@ui/anchored-portal';
import { Icon } from '@ui/icon';
import { SegmentButton } from '@ui/segment-button';
import { getSpacingValue } from '@ui/spacing';
import { Text } from '@ui/text';

import {
  StyledProfileMenu,
  StyledProfileMenuContent,
  StyledProfileMenuHeader,
  StyledProfileMenuLegal,
  StyledProfileMenuLegalLink,
  StyledProfileMenuPanel,
  type ProfileMenuStyleProps,
} from './profile-menu.styles';

/**
 * PROFILE_STUB — представляет заглушку данных профиля.
 * Используется в ProfileMenu до возврата данных из входа через Google.
 */
const PROFILE_STUB = {
  displayEmail: 'user@example.com',
  displayName: 'User',
} as const;

/**
 * PROFILE_MENU_CLOSE_ARIA_LABEL — задаёт доступное имя кнопки закрытия панели.
 * Используется в `headerActions` Card панели ProfileMenu.
 */
const PROFILE_MENU_CLOSE_ARIA_LABEL = 'Close profile menu';

/**
 * PROFILE_MENU_CLOSE_ICON_PADDING — задаёт отступ окна Icon у кнопки закрытия.
 */
const PROFILE_MENU_CLOSE_ICON_PADDING = 12;

/**
 * PROFILE_MENU_AVATAR_PADDING — задаёт отступ окна Icon аватара в шапке панели.
 */
const PROFILE_MENU_AVATAR_PADDING = 8;

/**
 * PROFILE_MENU_ACTIONS_PADDING_INLINE — задаёт боковой отступ ряда SegmentButton.
 */
const PROFILE_MENU_ACTIONS_PADDING_INLINE = 4;

/**
 * PROFILE_MENU_ACTIONS_MARGIN_BLOCK_START — задаёт отступ ряда действий от шапки.
 */
const PROFILE_MENU_ACTIONS_MARGIN_BLOCK_START = 12;

/**
 * PROFILE_MENU_LEGAL_ARIA_LABEL — задаёт доступное имя навигации правовых ссылок.
 * Используется в `StyledProfileMenuLegal`.
 */
const PROFILE_MENU_LEGAL_ARIA_LABEL = 'Legal';

/**
 * PROFILE_MENU_LEGAL_LINKS — задаёт перечень правовых ссылок меню профиля.
 * Используется в нижней навигации панели ProfileMenu.
 */
const PROFILE_MENU_LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
] as const;

/**
 * PROFILE_MENU_PANEL_MIN_INLINE_SIZE_PX — задаёт минимальную ширину панели меню профиля в px.
 * Используется в `PROFILE_MENU_INLINE_SIZE`.
 */
const PROFILE_MENU_PANEL_MIN_INLINE_SIZE_PX = 360;

/**
 * PROFILE_MENU_VIEWPORT_INLINE_GUTTER — задаёт суммарный горизонтальный зазор панели
 * от краёв вьюпорта по `32` с каждой стороны.
 * Используется в `PROFILE_MENU_MAX_INLINE_SIZE`.
 */
const PROFILE_MENU_VIEWPORT_INLINE_GUTTER = `calc(${getSpacingValue(32)} * 2)`;

/**
 * PROFILE_MENU_MAX_INLINE_SIZE — задаёт максимальную ширину панели меню профиля:
 * вьюпорт минус зазор по обеим сторонам.
 * Используется в `maxInlineSize` Card панели ProfileMenu и внутри `PROFILE_MENU_INLINE_SIZE`.
 */
const PROFILE_MENU_MAX_INLINE_SIZE = `calc(100vw - ${PROFILE_MENU_VIEWPORT_INLINE_GUTTER})`;

/**
 * PROFILE_MENU_INLINE_SIZE — задаёт минимальную ширину панели меню профиля.
 * Используется в `minInlineSize` Card панели ProfileMenu.
 */
const PROFILE_MENU_INLINE_SIZE = `min(${PROFILE_MENU_PANEL_MIN_INLINE_SIZE_PX}px, ${PROFILE_MENU_MAX_INLINE_SIZE})`;

/**
 * ProfileMenuProps — представляет пропсы компонента ProfileMenu.
 */
type ProfileMenuProps = ProfileMenuStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'style' | keyof ProfileMenuStyleProps
  >;

/**
 * ProfileMenu — отображает меню профиля с аватаром, действиями и правовыми ссылками.
 *
 * @example
 * <ProfileMenu />
 */
export function ProfileMenu(props: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { displayEmail, displayName } = PROFILE_STUB;

  function handleClose(): void {
    setIsOpen(false);
  }

  function handleToggle(): void {
    setIsOpen((current) => !current);
  }

  function handleOpenFocus(panel: HTMLElement): void {
    getFocusables(panel)[0]?.focus();
  }

  return (
    <StyledProfileMenu {...props}>
      <Icon
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Profile menu for ${displayName}`}
        as="button"
        ref={triggerRef}
        shape="round"
        title={displayEmail}
        onClick={handleToggle}
      >
        <AvatarIcon />
      </Icon>

      <AnchoredPortal
        anchorRef={triggerRef}
        dismissZoneRefs={[triggerRef, panelRef]}
        open={isOpen}
        panelRef={panelRef}
        returnFocusRef={triggerRef}
        onDismiss={handleClose}
        onOpenFocus={handleOpenFocus}
      >
        <StyledProfileMenuPanel
          aria-labelledby={titleId}
          aria-modal={true}
          headerActions={[
            {
              ariaLabel: PROFILE_MENU_CLOSE_ARIA_LABEL,
              icon: <CloseIcon />,
              iconPadding: PROFILE_MENU_CLOSE_ICON_PADDING,
              onClick: handleClose,
            },
          ]}
          id={menuId}
          maxInlineSize={PROFILE_MENU_MAX_INLINE_SIZE}
          minBlockSize="0"
          minInlineSize={PROFILE_MENU_INLINE_SIZE}
          position="fixed"
          ref={panelRef}
          role="dialog"
          subtitle={displayEmail}
          subtitleAlign="center"
        >
          <StyledProfileMenuContent>
            <StyledProfileMenuHeader>
              <Icon
                aria-hidden="true"
                blockSize={getSpacingValue(80)}
                inlineSize={getSpacingValue(80)}
                padding={PROFILE_MENU_AVATAR_PADDING}
                shape="round"
                showBorder
              >
                <AvatarIcon />
              </Icon>
              <Text align="center" as="p" id={titleId} sizePreset="extraBold">
                Hello, {displayName}!
              </Text>
            </StyledProfileMenuHeader>

            <SegmentButton
              left={{
                icon: <AddCircleIcon />,
                iconFill: 'primary',
                iconPosition: 'start',
                label: 'Profile',
                onClick: handleClose,
              }}
              marginBlockStart={PROFILE_MENU_ACTIONS_MARGIN_BLOCK_START}
              paddingInline={PROFILE_MENU_ACTIONS_PADDING_INLINE}
              right={{
                icon: <SignOutIcon />,
                label: 'Sign out',
                onClick: handleClose,
              }}
              shape="pill"
            />

            <StyledProfileMenuLegal aria-label={PROFILE_MENU_LEGAL_ARIA_LABEL}>
              {PROFILE_MENU_LEGAL_LINKS.map((link, index) => (
                <Fragment key={link.to}>
                  {index > 0 && (
                    <Text aria-hidden="true" tone="muted">
                      ·
                    </Text>
                  )}
                  <StyledProfileMenuLegalLink to={link.to} onClick={handleClose}>
                    <Text align="center" sizePreset="thin">
                      {link.label}
                    </Text>
                  </StyledProfileMenuLegalLink>
                </Fragment>
              ))}
            </StyledProfileMenuLegal>
          </StyledProfileMenuContent>
        </StyledProfileMenuPanel>
      </AnchoredPortal>
    </StyledProfileMenu>
  );
}
