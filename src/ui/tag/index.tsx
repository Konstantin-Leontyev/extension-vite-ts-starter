/**
 * Файл: `src/ui/tag/index.tsx`
 * Предоставляет компонент Tag для отображения меток.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - семантический тон через проп `tone`
 *  - форму через проп `shape`
 *  - содержимое через `children`. Без `children` рендерится только точка-индикатор
 *  - точку-индикатор через проп `showDot`
 *  - тон точки через проп `dotTone`
 *  - рамку через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - режим мягкой заливки через проп `tinted`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Tag
 * 2. Типизировать пропсы через `TagProps`
 * 3. Экспортировать тип `TagShowDotProps`
 * 4. Реэкспортировать публичное API стилей: `TAG_SIZE_PRESET_KEYS` и тип `TagSizePreset`
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают статусы и метки
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { Text } from '@ui/text';
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
 * TagShowDotProps — представляет пропсы точки Tag.
 * Поле `dotTone` допустимо, пока `showDot` не выключен: дефолт флага — точка есть.
 *
 * @property dotTone — тон точки
 * @property showDot — включает точку-индикатор
 */
type TagShowDotProps =
  | {
      dotTone?: never;
      showDot: false;
    }
  | {
      dotTone?: TonePreset;
      showDot?: true;
    };

/**
 * TagProps — представляет пропсы компонента Tag.
 */
type TagProps = TagShowDotProps &
  TagStyleProps &
  Omit<ComponentPropsWithRef<'span'>, 'className' | 'style' | keyof TagStyleProps>;

/**
 * DEFAULT_TAG_SHOW_DOT — задаёт показ точки-индикатора по умолчанию.
 * Используется, когда вызывающий код не передал проп `showDot`.
 */
const DEFAULT_TAG_SHOW_DOT = true;

/**
 * Tag — отображает метку с заливкой, рамкой и точкой-индикатором.
 *
 * @example
 * <Tag>Метка</Tag>
 * <Tag tone="primary" showDot>Статус</Tag>
 * <Tag tone="success" tinted showBorder>Активно</Tag>
 */
export function Tag({
  children,
  dotTone,
  showDot = DEFAULT_TAG_SHOW_DOT,
  size,
  tone,
  ...rest
}: TagProps) {
  return (
    <StyledTag size={size} tone={tone} {...rest}>
      {showDot && <StyledTagDot dotTone={dotTone} />}
      {Boolean(children) && (
        <Text ellipsis size={getTagTextSize(size)}>
          {children}
        </Text>
      )}
    </StyledTag>
  );
}

export { TAG_SIZE_PRESET_KEYS, type TagShowDotProps, type TagSizePreset };
