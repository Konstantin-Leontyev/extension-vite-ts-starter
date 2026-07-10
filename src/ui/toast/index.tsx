/**
 * Файл: `src/ui/toast/index.tsx`
 * Точка входа для компонента Toast и его публичного API.
 * Предоставляет компонент для отображения уведомлений с поддержкой:
 * - размерного ряда (`sizePreset` — из канона `@ui/presets`)
 * - семантического тона (`tone` — акцентная полоса слева, не заливка)
 *
 * Основные задачи:
 * 1. Экспортировать компонент Toast для использования в приложении
 * 2. Обеспечить типизацию пропсов
 * 3. Автоматически выставлять `role`/`aria-live` в зависимости от `tone` (`danger` → `alert`)
 *
 * Потребители: страницы и виджеты приложения, витрина design-system.
 */

import { type ComponentPropsWithRef } from 'react';

import { Text } from '@ui/text';

import { StyledToast, getToastTextSize, type ToastStyleProps } from './toast.styles';

/**
 * ToastProps — пропсы компонента Toast.
 *
 * @property message — текст уведомления. Рендерится во внутреннем Text
 *
 * Остальные оси — из `ToastStyleProps` и нативных атрибутов `<div>`.
 * `tone === 'danger'` задаёт `role="alert"` и `aria-live="assertive"` на корне.
 */
type ToastProps = ToastStyleProps & {
  message: string;
} & Omit<
    ComponentPropsWithRef<'div'>,
    keyof ToastStyleProps | 'children' | 'className' | 'style'
  >;

/**
 * Toast — компонент для отображения уведомлений.
 * `tone` определяет акцентную полосу слева (не заливку).
 * Layout-пропы и оси вида идут на один корень — `StyledToast` потребляет layout
 * через `getLayoutStyles` и фильтрует их из DOM (`shouldForwardProp`); split не нужен.
 *
 * @example
 * <Toast message="Успешно сохранено" />
 * <Toast message="Ошибка" tone="danger" />
 */
export function Toast({ message, sizePreset, tone, ...rest }: ToastProps) {
  const isDanger = tone === 'danger';
  const role = isDanger ? 'alert' : 'status';
  const ariaLive = isDanger ? 'assertive' : 'polite';

  return (
    <StyledToast
      role={role}
      aria-live={ariaLive}
      sizePreset={sizePreset}
      tone={tone}
      {...rest}
    >
      <Text sizePreset={getToastTextSize(sizePreset)}>{message}</Text>
    </StyledToast>
  );
}
