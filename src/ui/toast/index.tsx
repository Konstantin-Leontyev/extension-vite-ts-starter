/**
 * Файл: `src/ui/toast/index.tsx`
 * Предоставляет компонент Toast для отображения уведомлений.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - тон текста сообщения через проп `textTone`
 *  - размер текста сообщения через проп `textSize`
 *  - курсив текста сообщения через проп `textItalic`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Toast
 * 2. Типизировать пропсы через `ToastProps`
 * 3. Выставлять `role` и `aria-live` по тону: для `danger` — `alert` и `assertive`
 * 4. Реэкспортировать мост размера текста `getToastTextSize`
 *
 * Потребители:
 *  - `src/context/toast/index.tsx` — рендерит Toast в стеке уведомлений
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { Text, type TextSizePreset, type TextTone } from '@ui/text';

import { StyledToast, getToastTextSize, type ToastStyleProps } from './toast.styles';

/**
 * ToastProps — представляет пропсы компонента Toast.
 *
 * @property message — текст уведомления
 * @property textItalic — включает курсив текста сообщения
 * @property textSize — размер текста сообщения
 * @property textTone — тон текста сообщения
 */
type ToastProps = ToastStyleProps & {
  message: string;
  textItalic?: boolean;
  textSize?: TextSizePreset;
  textTone?: TextTone;
} & Omit<
    ComponentPropsWithRef<'div'>,
    keyof ToastStyleProps | 'children' | 'className' | 'style'
  >;

/**
 * Toast — отображает уведомление.
 *
 * @example
 * <Toast message="Успешно сохранено" />
 * <Toast message="Ошибка" tone="danger" />
 */
function Toast({
  message,
  sizePreset,
  textItalic,
  textSize,
  textTone,
  tone,
  ...rest
}: ToastProps) {
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
      <Text
        italic={textItalic}
        sizePreset={textSize ?? getToastTextSize(sizePreset)}
        tone={textTone}
      >
        {message}
      </Text>
    </StyledToast>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { Toast, getToastTextSize };
