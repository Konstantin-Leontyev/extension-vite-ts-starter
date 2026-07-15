/**
 * Файл: `src/ui/switch/switch.styles.ts`
 * Определяет внешний вид компонента Switch.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SwitchTrackStyleProps` и `SwitchStyleProps`
 * 2. Хранить габариты дорожки и бегунка в `switchSizePresets`
 * 3. Предоставить функции `getSwitchTextSize` и `getSwitchTrackStyles`
 * 4. Предоставить styled-узлы `StyledSwitchRoot` и `StyledSwitchTrack`
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
 * switchSizePresets — хранит габариты дорожки и бегунка для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключи шкалы из `@ui/spacing`:
 *  - `trackInline` → ширина дорожки
 *  - `trackBlock` → высота дорожки
 *  - `knob` → диаметр бегунка
 * Ряд компактнее контролов.
 */
const switchSizePresets = {
  small: { trackInline: 28, trackBlock: 16, knob: 12 },
  medium: { trackInline: 36, trackBlock: 20, knob: 16 },
  large: { trackInline: 48, trackBlock: 24, knob: 20 },
} as const satisfies Record<
  SizePreset,
  { knob: SpacingValue; trackBlock: SpacingValue; trackInline: SpacingValue }
>;

/**
 * SwitchTrackStyleProps — представляет пропсы стилизации дорожки Switch.
 *
 * @property sizePreset — размер дорожки
 * @property tone — тон включённого состояния
 */
export type SwitchTrackStyleProps = {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * SwitchStyleProps — представляет пропсы стилизации Switch и layout-пропсы.
 */
export type SwitchStyleProps = LayoutProps & SwitchTrackStyleProps;

/**
 * SWITCH_TRACK_PROP_NAMES — хранит имена пропсов стилизации дорожки Switch.
 */
const SWITCH_TRACK_PROP_NAMES = new Set<string>(['sizePreset', 'tone']);

/**
 * TRACK_BORDER — задаёт ширину рамки дорожки.
 * Вычитается из инсета бегунка, иначе `border-box` смещает его вниз.
 */
const TRACK_BORDER = '1px';

/**
 * getSwitchTrackInline — возвращает CSS-ширину дорожки.
 *
 * @param sizePreset — размер из ряда контролов
 * @returns ширина дорожки в rem
 */
function getSwitchTrackInline(sizePreset: SizePreset): string {
  return getSpacingValue(switchSizePresets[sizePreset].trackInline);
}

/**
 * getSwitchTrackBlock — возвращает CSS-высоту дорожки.
 *
 * @param sizePreset — размер из ряда контролов
 * @returns высота дорожки в rem
 */
function getSwitchTrackBlock(sizePreset: SizePreset): string {
  return getSpacingValue(switchSizePresets[sizePreset].trackBlock);
}

/**
 * getSwitchKnob — возвращает CSS-диаметр бегунка.
 *
 * @param sizePreset — размер из ряда контролов
 * @returns диаметр бегунка в rem
 */
function getSwitchKnob(sizePreset: SizePreset): string {
  return getSpacingValue(switchSizePresets[sizePreset].knob);
}

/**
 * getSwitchTextSize — возвращает размер подписи по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset — размер дорожки
 * @returns метка размера текста из `TextSizePreset` для подписи справа от дорожки
 */
export function getSwitchTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * getSwitchTrackStyles — возвращает CSS-правила для узла `StyledSwitchTrack`:
 * габариты, бегунок и checked/focus-вид по пропам `sizePreset` и `tone`.
 * Состояния читаются со скрытого соседнего input через селектор `input:checked + &`.
 *
 * @param props — пропсы стилизации дорожки и тема
 * @returns CSS-правила дорожки и псевдоэлемента бегунка
 */
export function getSwitchTrackStyles(
  props: SwitchTrackStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET, tone = DEFAULT_TONE } = props;
  const trackInline = getSwitchTrackInline(sizePreset);
  const trackBlock = getSwitchTrackBlock(sizePreset);
  const knob = getSwitchKnob(sizePreset);
  // Бегунок центрируется инсетом: из расчёта вычитается рамка, потому что inset
  // отсчитывается от padding-края
  // Ход бегунка равен trackInline минус trackBlock — обе позиции смещены рамкой одинаково
  const knobInset = `calc((${trackBlock} - ${knob}) / 2 - ${TRACK_BORDER})`;
  const knobTravel = `calc(${trackInline} - ${trackBlock})`;
  const checkedBackground = getToneColor(theme, tone, theme.colors.primary);

  return `
    position: relative;
    display: inline-block;
    flex-shrink: 0;
    inline-size: ${trackInline};
    block-size: ${trackBlock};
    background-color: ${theme.colors.border};
    border: ${TRACK_BORDER} solid ${theme.colors.border};
    border-radius: calc(${trackBlock} / 2);
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease;

    &::after {
      position: absolute;
      inset-block-start: ${knobInset};
      inset-inline-start: ${knobInset};
      inline-size: ${knob};
      block-size: ${knob};
      content: '';
      background-color: ${theme.colors.surface};
      border-radius: 50%;
      box-shadow: ${theme.shadow.surface};
      transition: transform 0.15s ease;
    }

    input:checked + & {
      background-color: ${checkedBackground};
      border-color: ${checkedBackground};
    }

    input:checked + &::after {
      transform: translateX(${knobTravel});
    }

    input:focus-visible + & {
      outline: 2px solid ${theme.colors.focusRing};
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.3s;

      &::after {
        transition-duration: 0.3s;
      }
    }
  `;
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

/**
 * StyledSwitchRoot — задаёт корневой узел компонента Switch с нативной связью label ↔ input.
 * Базируется на `<label>` и поддерживает layout-пропсы.
 *
 * Встроенные стили:
 *  - `display: inline-grid` и `grid-auto-flow: column` — дорожка и подпись в одной строке
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
