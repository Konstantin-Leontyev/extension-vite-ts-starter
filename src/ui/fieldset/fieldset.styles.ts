/**
 * Файл: `src/ui/fieldset/fieldset.styles.ts`
 * Определяет внешний вид компонента Fieldset.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `FieldsetStyleProps` и тон рамки через `FieldsetBorderTone`
 * 2. Хранить расширенный ряд тонов рамки в `FIELDSET_BORDER_TONE_PRESETS`
 * 3. Предоставить перечень `FIELDSET_BORDER_TONE_KEYS`
 * 4. Предоставить styled-узел `StyledFieldset`
 *
 * Потребители:
 *  - `src/ui/fieldset/index.tsx` — собирает компонент Fieldset и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPadding,
  resolveBlockRadius,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme, type ThemeColors } from '@ui/theme';
import { DEFAULT_TONE, TONE_PRESETS, type TonePreset } from '@ui/tones';

/**
 * FIELDSET_BORDER_TONE_PRESETS — связывает тоны рамки с ключами цвета в теме.
 * Канонический набор расширен ключом `inverted` для белой рамки на цветной подложке.
 *
 * Соответствие приватно для модуля, доступ к перечню тонов — только через
 * `FIELDSET_BORDER_TONE_KEYS`, чтение цвета — через `getFieldsetBorderColor`.
 */
const FIELDSET_BORDER_TONE_PRESETS = {
  ...TONE_PRESETS,
  inverted: 'inverse',
} as const satisfies Record<'inverted' | TonePreset, keyof ThemeColors | undefined>;

/**
 * FieldsetBorderTone — представляет тон рамки Fieldset, включая расширение `inverted`.
 */
export type FieldsetBorderTone = keyof typeof FIELDSET_BORDER_TONE_PRESETS;

/**
 * FIELDSET_BORDER_TONE_KEYS — формирует перечень тонов рамки из ключей
 * `FIELDSET_BORDER_TONE_PRESETS`.
 * Используется в панелях настроек витрины дизайн-системы: `ToneListbox` принимает его
 * пропом `tones`.
 */
export const FIELDSET_BORDER_TONE_KEYS = Object.freeze(
  Object.keys(FIELDSET_BORDER_TONE_PRESETS) as FieldsetBorderTone[]
);

/**
 * getFieldsetBorderColor — возвращает цвет рамки по `borderTone`.
 * Ключ цвета читается из `FIELDSET_BORDER_TONE_PRESETS`. Тон по умолчанию
 * даёт `undefined` — подставляется нейтральный цвет рамки из темы.
 *
 * @param theme текущая тема
 * @param borderTone тон рамки
 * @returns CSS-цвет рамки
 */
function getFieldsetBorderColor(
  theme: AppTheme,
  borderTone: FieldsetBorderTone
): string {
  const colorKey = FIELDSET_BORDER_TONE_PRESETS[borderTone];

  return colorKey === undefined ? theme.colors.border : theme.colors[colorKey];
}

/**
 * FieldsetStyleProps — представляет пропсы стилизации Fieldset и layout-пропсы.
 *
 * @property borderTone — тон рамки
 */
export type FieldsetStyleProps = LayoutProps & {
  borderTone?: FieldsetBorderTone;
};

/**
 * FIELDSET_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Fieldset.
 */
const FIELDSET_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'borderTone']);

/**
 * DEFAULT_FIELDSET_BORDER_TONE — задаёт тон рамки по умолчанию.
 * Используется, когда вызывающий код не передал проп `borderTone`.
 */
const DEFAULT_FIELDSET_BORDER_TONE: FieldsetBorderTone = DEFAULT_TONE;

/**
 * getFieldsetStyles — возвращает CSS-правила для корня `StyledFieldset`: габариты, отступы
 * и рамка.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `borderTone`
 * 2. Собирает габариты, отступы через `getPadding`, рамку цветом через
 *    `getFieldsetBorderColor` и `border-radius` через `resolveBlockRadius`
 *
 * @param props пропсы стилизации Fieldset и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getFieldsetStyles(props: FieldsetStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const { borderTone = DEFAULT_FIELDSET_BORDER_TONE } = props;
  const padding = getPadding(DEFAULT_SIZE_PRESET);

  return `
    margin: 0;
    inline-size: 100%;
    min-inline-size: 0;
    padding-block: ${padding.block};
    padding-inline: ${padding.inline};
    border: 1px solid ${getFieldsetBorderColor(theme, borderTone)};
    border-radius: ${resolveBlockRadius(DEFAULT_SHAPE_PRESET, getMinBlockSize(DEFAULT_SIZE_PRESET))};
  `;
}

/**
 * StyledFieldset — задаёт корневой узел компонента Fieldset.
 * Базируется на `<fieldset>` и поддерживает пропсы из `FieldsetStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `grid-auto-rows: min-content` — строки по высоте содержимого
 *  - `gap` — отступ между заголовком и полями
 *  - `align-content: start` — содержимое прижато к началу
 *
 * Генерация стилей:
 *  - `getFieldsetStyles` — габариты, отступы и рамка
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledFieldset = styled.fieldset.withConfig({
  shouldForwardProp: (prop) => !FIELDSET_PROP_NAMES.has(prop),
})<FieldsetStyleProps>`
  display: grid;
  grid-auto-rows: min-content;
  gap: ${getSpacingValue(8)};
  align-content: start;
  ${(props) => getFieldsetStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
