/**
 * Файл: `src/ui/toast/index.tsx`
 * Предоставляет компонент Toast для отображения уведомлений.
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Toast
 * 2. Типизировать пропсы через `ToastProps`
 * 3. Выставлять `role` и `aria-live` по тону: для `danger` — `alert` и `assertive`
 *
 * Потребители:
 *  - `src/context/toast/index.tsx` — рендерит Toast в стеке уведомлений
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { Text } from '@ui/text';

import { StyledToast, getToastTextSize, type ToastStyleProps } from './toast.styles';

/**
 * ToastProps — представляет пропсы компонента Toast.
 *
 * @property message — текст уведомления
 *
 * Остальные пропсы — из `ToastStyleProps` и нативных атрибутов элемента.
 */
type ToastProps = ToastStyleProps & {
  message: string;
} & Omit<
    ComponentPropsWithRef<'div'>,
    keyof ToastStyleProps | 'children' | 'className' | 'style'
  >;

/**
 * Toast — отображает уведомление.
 * Рендерит `StyledToast` с внутренним Text.
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
