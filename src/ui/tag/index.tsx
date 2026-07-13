/**
 * Файл: `src/ui/tag/index.tsx`
 * Предоставляет компонент Tag для отображения тегов.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - тон текста через проп `textTone`
 *  - точку-индикатор через проп `dot` с отдельным тоном `dotTone`
 *  - режимы `bordered` и `tinted`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Tag
 * 2. Типизировать пропсы через `TagProps`
 * 3. Реэкспортировать публичное API стилей: `TAG_SIZE_PRESET_KEYS` и тип `TagSizePreset`
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают статусы и метки
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Text, type TextTone } from '@ui/text';
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
 * @property children — содержимое тега
 * @property dot — включает точку-индикатор
 * @property dotTone — тон точки
 * @property textTone — тон текста
 */
type TagProps = {
  children: ReactNode;
  dot?: boolean;
  dotTone?: TonePreset;
  textTone?: TextTone;
} & TagStyleProps &
  Omit<ComponentPropsWithRef<'span'>, keyof TagStyleProps | 'className' | 'style'>;

/**
 * Tag — отображает тег с заливкой, границей и точкой-индикатором.
 *
 * @example
 * <Tag>Метка</Tag>
 * <Tag tone="primary" dot>Статус</Tag>
 * <Tag tone="success" tinted bordered>Активно</Tag>
 */
export function Tag({
  children,
  dot,
  dotTone,
  sizePreset,
  textTone,
  tone,
  ...rest
}: TagProps) {
  return (
    <StyledTag sizePreset={sizePreset} tone={tone} {...rest}>
      {dot && <StyledTagDot dotTone={dotTone} />}
      <Text ellipsis sizePreset={getTagTextSize(sizePreset)} tone={textTone}>
        {children}
      </Text>
    </StyledTag>
  );
}

export { TAG_SIZE_PRESET_KEYS, type TagSizePreset };
