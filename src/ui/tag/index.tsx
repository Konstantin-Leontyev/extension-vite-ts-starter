/**
 * Файл: index.tsx
 * Точка входа для компонента Tag и его публичного API.
 * Предоставляет компонент для отображения тегов с поддержкой:
 * - размерного ряда (`tiny`, `small`, `medium`, `large`)
 * - семантических тонов заливки (`tone`) и текста (`textTone`)
 * - опциональной точки (`dot`) с отдельным `dotTone`
 * - режимов `bordered` и `tinted`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Tag для использования в приложении
 * 2. Обеспечить типизацию пропсов
 * 3. Предоставить единый интерфейс для отображения тегов с настраиваемым
 *    размером, тоном и визуальными режимами (точка, граница, tinted)
 *
 * Потребители: страницы и виджеты приложения, витрина design-system.
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Text, type TextTone } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import {
  StyledTag,
  StyledTagDot,
  getTagTextSize,
  type TagSizePreset,
  type TagStyleProps,
} from './tag.styles';

/**
 * TagProps — пропсы компонента Tag.
 *
 * @property children — содержимое тега
 * @property dot — показывать точку-индикатор (флаг сборки, не ось CSS корня)
 * @property dotTone — тон точки; без значения — `currentColor` с корня `StyledTag`
 * @property textTone — тон текста; пробрасывается во внутренний Text как `tone`
 *
 * Остальные оси — из `TagStyleProps` и нативных атрибутов `span`.
 */
type TagProps = {
  children: ReactNode;
  dot?: boolean;
  dotTone?: TonePreset;
  textTone?: TextTone;
} & TagStyleProps &
  Omit<ComponentPropsWithRef<'span'>, keyof TagStyleProps | 'className' | 'style'>;

/**
 * Tag — компонент для отображения ярлыка.
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

export type { TagSizePreset, TagStyleProps };
