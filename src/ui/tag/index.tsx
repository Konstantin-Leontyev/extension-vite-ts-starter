/**
 * Файл: `src/ui/tag/index.tsx`
 * Предоставляет компонент Tag для отображения меток.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - форму через проп `shape`
 *  - содержимое через `children`. Без `children` рендерится только точка-индикатор
 *  - тон текста через проп `textTone`
 *  - размер текста через проп `textSize`
 *  - курсив текста через проп `textItalic`
 *  - точку-индикатор через проп `showDot`
 *  - тон точки через проп `dotTone`
 *  - границу через проп `showBorder`
 *  - тон границы через проп `borderTone`
 *  - режим мягкой заливки через проп `tinted`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Tag
 * 2. Типизировать пропсы через `TagProps`
 * 3. Реэкспортировать публичное API стилей: `TAG_SIZE_PRESET_KEYS`, `getTagTextSize`
 *    и тип `TagSizePreset`
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают статусы и метки
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Text, type TextSizePreset, type TextTone } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import {
  StyledTag,
  StyledTagDot,
  TAG_SIZE_PRESET_KEYS,
  getTagTextSize,
  type TagSizePreset,
  type TagStyleProps,
} from './tag.styles';

/**
 * TagProps — представляет пропсы компонента Tag.
 *
 * @property children — содержимое метки
 * @property dotTone — тон точки
 * @property showDot — включает точку-индикатор
 * @property textItalic — включает курсив текста
 * @property textSize — размер текста
 * @property textTone — тон текста
 */
type TagProps = {
  children?: ReactNode;
  dotTone?: TonePreset;
  showDot?: boolean;
  textItalic?: boolean;
  textSize?: TextSizePreset;
  textTone?: TextTone;
} & TagStyleProps &
  Omit<ComponentPropsWithRef<'span'>, 'className' | 'style' | keyof TagStyleProps>;

/**
 * Tag — отображает метку с заливкой, границей и точкой-индикатором.
 *
 * @example
 * <Tag>Метка</Tag>
 * <Tag tone="primary" showDot>Статус</Tag>
 * <Tag tone="success" tinted showBorder>Активно</Tag>
 */
export function Tag({
  children,
  dotTone,
  showDot,
  sizePreset,
  textItalic,
  textSize,
  textTone,
  tone,
  ...rest
}: TagProps) {
  return (
    <StyledTag sizePreset={sizePreset} tone={tone} {...rest}>
      {showDot && <StyledTagDot dotTone={dotTone} />}
      {Boolean(children) && (
        <Text
          ellipsis
          italic={textItalic}
          sizePreset={textSize ?? getTagTextSize(sizePreset)}
          tone={textTone}
        >
          {children}
        </Text>
      )}
    </StyledTag>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { TAG_SIZE_PRESET_KEYS, getTagTextSize, type TagSizePreset };
