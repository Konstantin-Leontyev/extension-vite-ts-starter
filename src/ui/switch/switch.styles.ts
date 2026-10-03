/**
 * Файл: `src/ui/switch/switch.styles.ts`
 * Определяет внешний вид компонента Switch.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SwitchStyleProps`
 * 2. Хранить габариты дорожки и бегунка в `switchTrackInlineSize`,
 *    `switchTrackBlockSize` и `switchKnobSize`
 * 3. Предоставить styled-узлы `StyledSwitchRoot` и `StyledSwitchTrack`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/switch/index.tsx` — собирает компонент Switch и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { getChoiceControlRootStyles } from '@ui/choice-control';
import { LAYOUT_PROP_NAMES, type LayoutProps } from '@ui/layout';
import { MOTION_CONTROL_DURATION, getTransitionStyles } from '@ui/motion';
import { getOutlineStyles } from '@ui/outline';
import { DEFAULT_SIZE_PRESET, resolveBlockRadius, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { getToneColor, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * switchTrackInlineSize — хранит ширину дорожки для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы из `@ui/spacing`.
 * Ряд компактнее контролов.
 */
const switchTrackInlineSize = {
  small: 28,
  normal: 36,
  large: 48,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getSwitchTrackInlineSize — возвращает CSS-ширину дорожки.
 *
 * @param size размер из ряда контролов
 * @returns ширина дорожки в rem
 */
function getSwitchTrackInlineSize(size: SizePreset): string {
  return getSpacingValue(switchTrackInlineSize[size]);
}

/**
 * switchTrackBlockSize — хранит высоту дорожки для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы из `@ui/spacing`.
 */
const switchTrackBlockSize = {
  small: 16,
  normal: 20,
  large: 24,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getSwitchTrackBlockSize — возвращает CSS-высоту дорожки.
 *
 * @param size размер из ряда контролов
 * @returns высота дорожки в rem
 */
function getSwitchTrackBlockSize(size: SizePreset): string {
  return getSpacingValue(switchTrackBlockSize[size]);
}

/**
 * switchKnobSize — хранит диаметр бегунка для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы из `@ui/spacing`.
 */
const switchKnobSize = {
  small: 12,
  normal: 16,
  large: 20,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getSwitchKnobSize — возвращает CSS-диаметр бегунка.
 *
 * @param size размер из ряда контролов
 * @returns диаметр бегунка в rem
 */
function getSwitchKnobSize(size: SizePreset): string {
  return getSpacingValue(switchKnobSize[size]);
}

/**
 * SwitchStyleProps — представляет пропсы стилизации Switch и layout-пропсы.
 *
 * @property size — размер дорожки
 * @property tone — тон включённого состояния
 */
export type SwitchStyleProps = LayoutProps & {
  size?: SizePreset;
  tone?: TonePreset;
};

/**
 * StyledSwitchRoot — задаёт корневой узел компонента Switch.
 * Базируется на `<label>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getChoiceControlRootStyles` — ряд дорожки и подписи, layout-пропсы
 */
export const StyledSwitchRoot = styled.label.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${(props) => getChoiceControlRootStyles(props)}
`;

/**
 * SwitchTrackStyleProps — представляет пропсы стилизации дорожки Switch.
 */
type SwitchTrackStyleProps = Pick<SwitchStyleProps, 'size' | 'tone'>;

/**
 * SWITCH_TRACK_PROP_NAMES — хранит имена пропсов стилизации дорожки Switch.
 */
const SWITCH_TRACK_PROP_NAMES = new Set<string>(['size', 'tone']);

/**
 * DEFAULT_SWITCH_TONE — задаёт тон включённого состояния по умолчанию.
 * Используется, когда вызывающий код не передал проп `tone`.
 */
const DEFAULT_SWITCH_TONE: TonePreset = 'primary';

/**
 * getSwitchTrackStyles — возвращает CSS-правила для узла `StyledSwitchTrack`:
 * габариты, скругление, бегунок и checked/focus-вид по пропам `size` и `tone`.
 * Состояния читаются со скрытого соседнего input через селектор `input:checked + &`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `size` и `tone`
 * 2. Считает габариты дорожки и бегунка по `size`
 * 3. Центрирует бегунок смещением от края: половина разницы высоты дорожки
 *    и диаметра бегунка
 * 4. Задаёт ход бегунка как ширину дорожки минус её высоту
 * 5. Собирает заливку, `border-radius` через `resolveBlockRadius` с формой
 *    `pill` по высоте дорожки, бегунок и checked/focus-вид. Цвет checked —
 *    через `getToneColor` с запасным `theme.colors.border`
 *
 * @param props пропсы стилизации дорожки и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSwitchTrackStyles(
  props: SwitchTrackStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { size = DEFAULT_SIZE_PRESET, tone = DEFAULT_SWITCH_TONE } = props;
  const trackInlineSize = getSwitchTrackInlineSize(size);
  const trackBlockSize = getSwitchTrackBlockSize(size);
  const knobSize = getSwitchKnobSize(size);
  const knobInset = `calc((${trackBlockSize} - ${knobSize}) / 2)`;
  const knobTravel = `calc(${trackInlineSize} - ${trackBlockSize})`;
  const checkedBackground = getToneColor(theme, tone, theme.colors.border);

  return `
    position: relative;
    inline-size: ${trackInlineSize};
    block-size: ${trackBlockSize};
    background-color: ${theme.colors.border};
    border-radius: ${resolveBlockRadius('pill', trackBlockSize)};
    ${getTransitionStyles('background-color', MOTION_CONTROL_DURATION)}

    &::after {
      position: absolute;
      inset-block-start: ${knobInset};
      inset-inline-start: ${knobInset};
      inline-size: ${knobSize};
      block-size: ${knobSize};
      content: '';
      background-color: ${theme.colors.surface};
      border-radius: 50%;
      box-shadow: ${theme.shadow.surface};
      ${getTransitionStyles('transform', MOTION_CONTROL_DURATION)}
    }

    input:checked + & {
      background-color: ${checkedBackground};
    }

    input:checked + &::after {
      transform: translateX(${knobTravel});
    }

    input:focus-visible + & {
      ${getOutlineStyles(theme.colors.focusOutline)}
    }
  `;
}

/**
 * StyledSwitchTrack — задаёт дорожку компонента Switch.
 * Базируется на `<span>` и поддерживает пропсы из `SwitchTrackStyleProps`.
 *
 * Генерация стилей:
 *  - `getSwitchTrackStyles` — габариты, скругление, бегунок, цвета и checked/focus-вид
 */
export const StyledSwitchTrack = styled.span.withConfig({
  shouldForwardProp: (prop) => !SWITCH_TRACK_PROP_NAMES.has(prop),
})<SwitchTrackStyleProps>`
  ${(props) => getSwitchTrackStyles(props)}
`;
