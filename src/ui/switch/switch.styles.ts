/**
 * Файл: `src/ui/switch/switch.styles.ts`
 * Определяет внешний вид компонента Switch.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SwitchStyleProps`
 * 2. Хранить габариты дорожки и бегунка в `switchTrackInlineSize`,
 *    `switchTrackBlockSize` и `switchKnobSize`
 * 3. Предоставить функцию `getSwitchTextSize`
 * 4. Предоставить styled-узлы `StyledSwitchRoot` и `StyledSwitchTrack`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/switch/index.tsx` — собирает компонент Switch и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, getTextSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * switchTrackInlineSize — хранит ширину дорожки для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы из `@ui/spacing`.
 * Ряд компактнее контролов.
 */
const switchTrackInlineSize = {
  small: 28,
  medium: 36,
  large: 48,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getSwitchTrackInlineSize — возвращает CSS-ширину дорожки.
 *
 * @param sizePreset размер из ряда контролов
 * @returns ширина дорожки в rem
 */
function getSwitchTrackInlineSize(sizePreset: SizePreset): string {
  return getSpacingValue(switchTrackInlineSize[sizePreset]);
}

/**
 * switchTrackBlockSize — хранит высоту дорожки для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы из `@ui/spacing`.
 */
const switchTrackBlockSize = {
  small: 16,
  medium: 20,
  large: 24,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getSwitchTrackBlockSize — возвращает CSS-высоту дорожки.
 *
 * @param sizePreset размер из ряда контролов
 * @returns высота дорожки в rem
 */
function getSwitchTrackBlockSize(sizePreset: SizePreset): string {
  return getSpacingValue(switchTrackBlockSize[sizePreset]);
}

/**
 * switchKnobSize — хранит диаметр бегунка для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы из `@ui/spacing`.
 */
const switchKnobSize = {
  small: 12,
  medium: 16,
  large: 20,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getSwitchKnobSize — возвращает CSS-диаметр бегунка.
 *
 * @param sizePreset размер из ряда контролов
 * @returns диаметр бегунка в rem
 */
function getSwitchKnobSize(sizePreset: SizePreset): string {
  return getSpacingValue(switchKnobSize[sizePreset]);
}

/**
 * getSwitchTextSize — возвращает размер подписи по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер дорожки
 * @returns метка размера текста из `TextSizePreset` для подписи справа от дорожки
 */
export function getSwitchTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * SwitchStyleProps — представляет пропсы стилизации Switch и layout-пропсы.
 *
 * @property sizePreset — размер дорожки
 * @property tone — тон включённого состояния
 */
export type SwitchStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * StyledSwitchRoot — задаёт корневой узел компонента Switch с нативной связью label ↔ input.
 * Базируется на `<label>` и поддерживает layout-пропсы.
 *
 * Встроенные стили:
 *  - `display: inline-grid` и `grid-auto-flow: column` — дорожка и подпись в одной строке
 *  - `gap` — отступ между дорожкой и подписью
 *  - `align-items: center` и `justify-content: start` — при растяжении корня родителем
 *    подпись остаётся прижатой к дорожке
 *  - `cursor: pointer` — кликабельная область корня
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledSwitchRoot = styled.label.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: inline-grid;
  grid-auto-flow: column;
  gap: ${getSpacingValue(8)};
  align-items: center;
  justify-content: start;
  cursor: pointer;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * SwitchTrackStyleProps — представляет пропсы стилизации дорожки Switch.
 */
type SwitchTrackStyleProps = Pick<SwitchStyleProps, 'sizePreset' | 'tone'>;

/**
 * SWITCH_TRACK_PROP_NAMES — хранит имена пропсов стилизации дорожки Switch.
 */
const SWITCH_TRACK_PROP_NAMES = new Set<string>(['sizePreset', 'tone']);

/**
 * TRACK_BORDER — задаёт ширину рамки дорожки.
 * Вычитается из смещения бегунка, иначе `border-box` смещает его вниз.
 */
const TRACK_BORDER = '1px';

/**
 * getSwitchTrackStyles — возвращает CSS-правила для узла `StyledSwitchTrack`:
 * габариты, бегунок и checked/focus-вид по пропам `sizePreset` и `tone`.
 * Состояния читаются со скрытого соседнего input через селектор `input:checked + &`.
 *
 * Как работает:
 * 1. Считает габариты дорожки и бегунка по `sizePreset`
 * 2. Центрирует бегунок смещением от края: из расчёта вычитает `TRACK_BORDER`,
 *    потому что `inset` отсчитывается от padding-края
 * 3. Задаёт ход бегунка как ширину дорожки минус её высоту — обе позиции смещены
 *    рамкой одинаково
 * 4. Собирает заливку, рамку, бегунок и checked/focus-вид по `tone`
 *
 * @param props пропсы стилизации дорожки и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSwitchTrackStyles(
  props: SwitchTrackStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET, tone = DEFAULT_TONE } = props;
  const trackInlineSize = getSwitchTrackInlineSize(sizePreset);
  const trackBlockSize = getSwitchTrackBlockSize(sizePreset);
  const knobSize = getSwitchKnobSize(sizePreset);
  const knobInset = `calc((${trackBlockSize} - ${knobSize}) / 2 - ${TRACK_BORDER})`;
  const knobTravel = `calc(${trackInlineSize} - ${trackBlockSize})`;
  const checkedBackground = getToneColor(theme, tone, theme.colors.primary);

  const styles = [
    'position: relative;',
    'display: inline-block;',
    'flex-shrink: 0;',
    `inline-size: ${trackInlineSize};`,
    `block-size: ${trackBlockSize};`,
    `background-color: ${theme.colors.border};`,
    `border: ${TRACK_BORDER} solid ${theme.colors.border};`,
    `border-radius: calc(${trackBlockSize} / 2);`,
    `transition:
      background-color 0.15s ease,
      border-color 0.15s ease;`,
    `&::after {
      position: absolute;
      inset-block-start: ${knobInset};
      inset-inline-start: ${knobInset};
      inline-size: ${knobSize};
      block-size: ${knobSize};
      content: '';
      background-color: ${theme.colors.surface};
      border-radius: 50%;
      box-shadow: ${theme.shadow.surface};
      transition: transform 0.15s ease;
    }`,
    `input:checked + & {
      background-color: ${checkedBackground};
      border-color: ${checkedBackground};
    }`,
    `input:checked + &::after {
      transform: translateX(${knobTravel});
    }`,
    `input:focus-visible + & {
      outline: 2px solid ${theme.colors.focusRing};
      outline-offset: 2px;
    }`,
    `@media (prefers-reduced-motion: reduce) {
      transition-duration: 0.3s;

      &::after {
        transition-duration: 0.3s;
      }
    }`,
  ];

  return styles.join('\n');
}

/**
 * StyledSwitchTrack — задаёт дорожку компонента Switch.
 * Базируется на `<span>` и поддерживает пропсы из `SwitchTrackStyleProps`.
 *
 * Генерация стилей:
 *  - `getSwitchTrackStyles` — габариты, бегунок, цвета и checked/focus-вид
 */
export const StyledSwitchTrack = styled.span.withConfig({
  shouldForwardProp: (prop) => !SWITCH_TRACK_PROP_NAMES.has(prop),
})<SwitchTrackStyleProps>`
  ${(props) => getSwitchTrackStyles(props)}
`;
