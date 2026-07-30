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

import { AddCircleIcon, AvatarIcon, CloseIcon, SignOutIcon } from '@icons';
import { AnchoredPortal } from '@ui/anchored-portal';
import { Card } from '@ui/card';
import { Icon } from '@ui/icon';
import { SegmentButton } from '@ui/segment-button';
import { getSpacingValue } from '@ui/spacing';
import { STACKING_PROFILE_MENU } from '@ui/stacking';
import { Text } from '@ui/text';
import { PORTAL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

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
 * PROFILE_MENU_MAX_INLINE_SIZE — задаёт максимальную ширину панели меню профиля:
 * вьюпорт минус зазор по обеим сторонам.
 * Используется в пределах ширины панели и внутри `PROFILE_MENU_INLINE_SIZE`.
 */
const PROFILE_MENU_MAX_INLINE_SIZE = 'calc(100vw - 4rem)';

/**
 * PROFILE_MENU_INLINE_SIZE — задаёт минимальную ширину панели меню профиля.
 * Используется в `AnchoredPortal` панели ProfileMenu.
 */
const PROFILE_MENU_INLINE_SIZE = `min(360px, ${PROFILE_MENU_MAX_INLINE_SIZE})`;

/**
 * PROFILE_MENU_TRIGGER_GAP_PX — задаёт зазор между триггером и панелью в px.
 * Совпадает с ключом шкалы отступов `12` из `@ui/spacing`.
 * Используется в `applyProfileMenuPanelPosition`.
 */
const PROFILE_MENU_TRIGGER_GAP_PX = 12;

/**
 * applyProfileMenuPanelPosition — позиционирует панель меню относительно триггера.
 *
 * Как работает:
 * 1. Берёт прямоугольник триггера через `getBoundingClientRect`
 * 2. Ставит верх панели ниже триггера на `PROFILE_MENU_TRIGGER_GAP_PX`
 * 3. Выравнивает правый край панели с правым краем триггера
 * 4. Считает доступную высоту до нижнего края вьюпорта с учётом
 *    `PORTAL_VIEWPORT_EDGE_INSET`
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
    window.innerHeight - top - PORTAL_VIEWPORT_EDGE_INSET
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
        dismissZoneRefs={[triggerRef, panelRef]}
        open={isOpen}
        panelRef={panelRef}
        positionStrategy={{
          anchorRef: triggerRef,
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
          maxInlineSize={PROFILE_MENU_MAX_INLINE_SIZE}
          minBlockSize="0"
          minInlineSize={PROFILE_MENU_INLINE_SIZE}
          position="fixed"
          ref={panelRef}
          role="dialog"
          subtitle={displayEmail}
          subtitleAlign="center"
          zIndex={STACKING_PROFILE_MENU}
        >
          <StyledProfileMenuContent>
            <StyledProfileMenuHeader>
              <Icon
                aria-hidden="true"
                as="button"
                blockSize={getSpacingValue(80)}
                inlineSize={getSpacingValue(80)}
                padding={8}
                shape="round"
                showBorder
                tabIndex={-1}
              >
                <AvatarIcon />
              </Icon>
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
