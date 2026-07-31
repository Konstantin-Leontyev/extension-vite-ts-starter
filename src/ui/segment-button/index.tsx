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
 *  - подпись над рядом через проп `label`
 *  - размер текста сегмента через проп `textSize`
 *  - курсив текста сегмента через проп `textItalic`
 *
 * Основные задачи:
 * 1. Экспортировать компонент SegmentButton
 * 2. Типизировать пропсы через `SegmentButtonProps`
 * 3. Реэкспортировать мост размера текста `getSegmentButtonTextSize`
 *
 * Потребители:
 *  - компоненты приложения, например ProfileMenu — переключают режимы и действия
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { useId, type ComponentPropsWithRef } from 'react';

import { FieldLabel } from '@ui/field-label';
import {
  SegmentButtonParts,
  type SegmentButtonPartsProps,
} from '@ui/segment-button-parts';
import { type TextSizePreset } from '@ui/text';

import {
  StyledSegmentButton,
  StyledSegmentButtonRoot,
  getSegmentButtonTextSize,
  splitLayoutProps,
  type SegmentButtonStyleProps,
} from './segment-button.styles';

/**
 * SegmentButtonProps — представляет пропсы компонента SegmentButton.
 *
 * @property label — подпись над рядом сегментов
 * @property textItalic — включает курсив текста сегмента
 * @property textSize — размер текста сегмента
 */
type SegmentButtonProps = {
  label?: string;
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
 *   sizePreset="normal"
 * />
 */
export function SegmentButton({
  center,
  label,
  left,
  ref,
  right,
  shape,
  sizePreset,
  textItalic,
  textSize,
  ...rest
}: SegmentButtonProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const labelId = useId();
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
    <StyledSegmentButtonRoot
      aria-labelledby={label ? labelId : undefined}
      ref={ref}
      {...layoutProps}
      {...restProps}
    >
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <StyledSegmentButton shape={shape} sizePreset={sizePreset}>
        <SegmentButtonParts {...partsProps} />
      </StyledSegmentButton>
    </StyledSegmentButtonRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { getSegmentButtonTextSize };
