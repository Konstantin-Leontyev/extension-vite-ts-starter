/**
 * Файл: `src/ui/segment-button/index.tsx`
 * Предоставляет компонент SegmentButton для отображения сегментного ряда действий.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму оболочки через проп `shape`
 *  - тон рамки через проп `borderTone`
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
 * 3. Выставлять `role="group"` и `aria-labelledby` при передаче `label`
 *
 * Потребители:
 *  - компоненты приложения, например ProfileMenu — переключают режимы и действия
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { useId, type ComponentPropsWithRef } from 'react';

import { FieldLabel } from '@ui/field-label';
import { getTextSize } from '@ui/presets';
import {
  SEGMENT_BUTTON_PARTS_FLUSH_SHAPE,
  SegmentButtonParts,
  type SegmentButtonPartsProps,
} from '@ui/segment-button-parts';
import { type TextSizePreset } from '@ui/text';

import {
  StyledSegmentButton,
  StyledSegmentButtonRoot,
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
 *   left={{ label: 'Day', onClick: showDay }}
 *   right={{ label: 'Week', onClick: showWeek }}
 * />
 * <SegmentButton
 *   left={{ label: 'A', active: true }}
 *   center={{ label: 'B' }}
 *   right={{ label: 'C' }}
 *   sizePreset="normal"
 * />
 */
export function SegmentButton({
  borderTone,
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
  const labelledBy = label ? labelId : undefined;
  const resolvedTextSize = textSize ?? getTextSize(sizePreset);

  const partsProps = {
    left,
    // Прямые углы: скругление даёт обрезка оболочки SegmentButton, не сегменты.
    shape: SEGMENT_BUTTON_PARTS_FLUSH_SHAPE,
    sizePreset,
    textItalic,
    textSize: resolvedTextSize,
    ...(center != null ? { center, right } : { right }),
  } as SegmentButtonPartsProps;

  return (
    <StyledSegmentButtonRoot
      aria-labelledby={labelledBy}
      ref={ref}
      role={labelledBy ? 'group' : undefined}
      {...layoutProps}
      {...restProps}
    >
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <StyledSegmentButton borderTone={borderTone} shape={shape} sizePreset={sizePreset}>
        <SegmentButtonParts {...partsProps} />
      </StyledSegmentButton>
    </StyledSegmentButtonRoot>
  );
}
