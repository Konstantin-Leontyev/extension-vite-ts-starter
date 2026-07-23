/**
 * Файл: `src/ui/segment-button/index.tsx`
 * Предоставляет компонент SegmentButton для отображения сегментного ряда действий.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму оболочки через проп `shape`
 *  - левый сегмент через проп `left`
 *  - средний сегмент через проп `center`. Без `center` ряд из двух сегментов
 *  - правый сегмент через проп `right`
 *  - размер текста сегмента через проп `textSize`
 *  - курсив текста сегмента через проп `textItalic`
 *
 * Основные задачи:
 * 1. Экспортировать компонент SegmentButton
 * 2. Типизировать пропсы через `SegmentButtonProps`
 * 3. Реэкспортировать мост размера текста `getSegmentButtonTextSize`
 * 4. Реэкспортировать тип `SegmentButtonAction`
 *
 * Потребители:
 *  - компоненты приложения, например ProfileMenu — переключают режимы и действия
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import {
  SegmentButtonParts,
  type SegmentButtonPartsAction,
  type SegmentButtonPartsProps,
} from '@ui/segment-button-parts';
import { type TextSizePreset } from '@ui/text';

import {
  StyledSegmentButton,
  getSegmentButtonTextSize,
  type SegmentButtonStyleProps,
} from './segment-button.styles';

/**
 * SegmentButtonAction — представляет действие одного сегмента SegmentButton.
 * Совпадает с `SegmentButtonPartsAction` из `@ui/segment-button-parts`.
 */
export type SegmentButtonAction = SegmentButtonPartsAction;

/**
 * SegmentButtonProps — представляет пропсы компонента SegmentButton.
 *
 * @property textItalic — включает курсив текста сегмента
 * @property textSize — размер текста сегмента
 */
type SegmentButtonProps = {
  textItalic?: boolean;
  textSize?: TextSizePreset;
} & Omit<SegmentButtonStyleProps, 'left' | 'right'> &
  Pick<SegmentButtonPartsProps, 'center' | 'left' | 'right'> &
  Omit<
    ComponentPropsWithRef<'div'>,
    'center' | 'className' | 'left' | 'right' | 'style' | keyof SegmentButtonStyleProps
  >;

/**
 * SegmentButton — отображает сегментный ряд действий в общей оболочке.
 *
 * @example
 * <SegmentButton
 *   left={{ text: 'Day', onClick: showDay }}
 *   right={{ text: 'Week', onClick: showWeek }}
 * />
 * <SegmentButton
 *   left={{ text: 'A', active: true }}
 *   center={{ text: 'B' }}
 *   right={{ text: 'C' }}
 *   sizePreset="medium"
 * />
 */
export function SegmentButton({
  center,
  left,
  ref,
  right,
  shape,
  sizePreset,
  textItalic,
  textSize,
  ...rest
}: SegmentButtonProps) {
  const resolvedTextSize = textSize ?? getSegmentButtonTextSize(sizePreset);

  const partsProps = {
    left,
    shape,
    sizePreset,
    textItalic,
    textSize: resolvedTextSize,
    ...(center != null ? { center, right } : { right }),
  } as SegmentButtonPartsProps;

  return (
    <StyledSegmentButton ref={ref} shape={shape} sizePreset={sizePreset} {...rest}>
      <SegmentButtonParts {...partsProps} />
    </StyledSegmentButton>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { getSegmentButtonTextSize };
