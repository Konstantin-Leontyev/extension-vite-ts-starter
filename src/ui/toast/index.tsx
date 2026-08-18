/**
 * Файл: `src/ui/toast/index.tsx`
 * Предоставляет компонент Toast для отображения уведомлений.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - семантический тон через проп `tone`
 *  - текст сообщения через `children`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Toast
 * 2. Типизировать пропсы через `ToastProps`
 * 3. Выставлять `role` и `aria-live` по тону: для `danger` — `alert` и `assertive`
 *
 * Потребители:
 *  - `src/context/toast/index.tsx` — рендерит Toast в стеке уведомлений
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { getTextSize } from '@ui/presets';
import { Text } from '@ui/text';

import { StyledToast, type ToastStyleProps } from './toast.styles';

/**
 * ToastProps — представляет пропсы компонента Toast.
 *
 * @property children — текст сообщения
 */
type ToastProps = ToastStyleProps & {
  children: ReactNode;
} & Omit<
    ComponentPropsWithRef<'div'>,
    'children' | 'className' | 'style' | keyof ToastStyleProps
  >;

/**
 * Toast — отображает уведомление.
 *
 * @example
 * <Toast>Успешно сохранено</Toast>
 * <Toast tone="danger">Ошибка</Toast>
 */
function Toast({ children, size, tone, ...rest }: ToastProps) {
  const isDanger = tone === 'danger';
  const role = isDanger ? 'alert' : 'status';
  const ariaLive = isDanger ? 'assertive' : 'polite';

  return (
    <StyledToast aria-live={ariaLive} role={role} size={size} tone={tone} {...rest}>
      <Text size={getTextSize(size)}>{children}</Text>
    </StyledToast>
  );
}

export { Toast };
