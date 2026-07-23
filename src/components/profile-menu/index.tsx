/**
 * Файл: `src/components/profile-menu/index.tsx`
 * Предоставляет компонент ProfileMenu для меню профиля в шапке.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *
 * Основные задачи:
 * 1. Экспортировать компонент ProfileMenu
 * 2. Типизировать пропсы через `ProfileMenuProps`
 * 3. Выставлять `role` и `aria`-атрибуты панели и триггера
 *
 * Потребители:
 *  - `src/components/header/index.tsx` — рендерит меню профиля в шапке
 */

import { Fragment, useId, useRef, useState, type ComponentPropsWithRef } from 'react';

import { AddCircleIcon } from '@icons/add-circle';
import { AvatarIcon } from '@icons/avatar';
import { CloseIcon } from '@icons/close';
import { SignOutIcon } from '@icons/sign-out';
import { AnchoredPortal } from '@ui/anchored-portal';
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
  type ProfileMenuStyleProps,
} from './profile-menu.styles';
import { PROFILE_STUB } from './profile-stub';

/**
 * PROFILE_MENU_LEGAL_LINKS — задаёт перечень правовых ссылок меню профиля.
 * Используется в нижней навигации панели ProfileMenu.
 */
const PROFILE_MENU_LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
] as const;

/**
 * PROFILE_MENU_TRIGGER_GAP_PX — задаёт зазор между триггером и панелью в px.
 * Совпадает с ключом шкалы отступов `12` из `@ui/spacing`.
 * Используется в `applyProfileMenuPanelPosition`.
 */
const PROFILE_MENU_TRIGGER_GAP_PX = 12;

/**
 * PROFILE_MENU_BOTTOM_INSET_PX — задаёт минимальный отступ панели от нижнего края
 * вьюпорта в px. Совпадает с ключом шкалы отступов `8` из `@ui/spacing`.
 * Используется в `applyProfileMenuPanelPosition`.
 */
const PROFILE_MENU_BOTTOM_INSET_PX = 8;

/**
 * applyProfileMenuPanelPosition — позиционирует панель меню относительно триггера.
 *
 * Как работает:
 * 1. Берёт прямоугольник триггера через `getBoundingClientRect`
 * 2. Ставит верх панели ниже триггера на `PROFILE_MENU_TRIGGER_GAP_PX`
 * 3. Выравнивает правый край панели с правым краем триггера
 * 4. Считает доступную высоту до нижнего края вьюпорта с учётом
 *    `PROFILE_MENU_BOTTOM_INSET_PX`
 * 5. Задаёт панели `max-block-size` и включает вертикальный скролл
 *
 * @param anchor элемент-триггер меню
 * @param panel элемент панели меню
 */
function applyProfileMenuPanelPosition(anchor: HTMLElement, panel: HTMLElement): void {
  const triggerRect = anchor.getBoundingClientRect();
  const top = triggerRect.bottom + PROFILE_MENU_TRIGGER_GAP_PX;
  const maxBlockSize = Math.max(
    0,
    window.innerHeight - top - PROFILE_MENU_BOTTOM_INSET_PX
  );

  panel.style.insetBlockStart = `${top}px`;
  panel.style.insetInlineEnd = `${window.innerWidth - triggerRect.right}px`;
  panel.style.insetInlineStart = 'auto';
  panel.style.maxBlockSize = `${maxBlockSize}px`;
  panel.style.overflowY = 'auto';
}

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

  return (
    <StyledProfileMenu {...props}>
      <RoundButton
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={`Profile menu for ${displayName}`}
        ref={triggerRef}
        title={displayEmail}
        onClick={handleToggle}
      >
        <AvatarIcon />
      </RoundButton>

      <AnchoredPortal
        dismissZoneRefs={[triggerRef, panelRef]}
        open={isOpen}
        panelRef={panelRef}
        positioning={{
          anchorRef: triggerRef,
          mode: 'custom',
          apply: applyProfileMenuPanelPosition,
        }}
        returnFocusRef={triggerRef}
        onDismiss={handleClose}
      >
        <Card
          aria-labelledby={titleId}
          aria-modal={true}
          headerActions={[
            {
              ariaLabel: 'Close profile menu',
              icon: <CloseIcon />,
              iconPadding: 12,
              onClick: handleClose,
            },
          ]}
          id={menuId}
          maxInlineSize="calc(100vw - 4rem)"
          minBlockSize="0"
          minInlineSize="min(360px, calc(100vw - 4rem))"
          position="fixed"
          ref={panelRef}
          role="dialog"
          subtitle={displayEmail}
          subtitleAlign="center"
          zIndex="20"
        >
          <StyledProfileMenuContent>
            <StyledProfileMenuHeader>
              <RoundButton aria-hidden="true" showBorder sizePreset="huge" tabIndex={-1}>
                <AvatarIcon />
              </RoundButton>
              <Text align="center" as="p" id={titleId} sizePreset="extraBold">
                Hello, {displayName}!
              </Text>
            </StyledProfileMenuHeader>

            <StyledProfileMenuActions>
              <SegmentButton
                left={{
                  icon: <AddCircleIcon />,
                  iconPosition: 'start',
                  iconFill: 'primary',
                  text: 'Profile',
                  onClick: handleClose,
                }}
                right={{
                  icon: <SignOutIcon />,
                  text: 'Sign out',
                  onClick: handleClose,
                }}
                shape="pill"
              />
            </StyledProfileMenuActions>

            <StyledProfileMenuLegal aria-label="Legal">
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
        </Card>
      </AnchoredPortal>
    </StyledProfileMenu>
  );
}
