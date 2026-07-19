/**
 * Файл: `src/ui/icon/icon.styles.ts`
 * Определяет внешний вид компонента Icon.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `IconStyleProps`
 * 2. Хранить локальный ряд отступов в `iconPadding`
 * 3. Предоставить styled-узел `StyledIcon`
 *
 * Потребители:
 *  - `src/ui/icon/index.tsx` — собирает компонент Icon и реэкспортирует
 *    публичное API
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, getMinBlockSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';

/**
 * iconPadding — хранит внутренний отступ окна иконки для каждого размера ряда.
 * Вместе с квадратом из `getMinBlockSize` задаёт окно под svg: 24/32/32
 * для small/medium/large — значения подобраны зрительно.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 */
const iconPadding = {
  small: 4,
  medium: 4,
  large: 8,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getIconPadding — возвращает CSS-значение внутреннего отступа окна иконки.
 *
 * @param sizePreset размер из ряда контролов
 * @returns отступ в rem
 */
function getIconPadding(sizePreset: SizePreset): string {
  return getSpacingValue(iconPadding[sizePreset]);
}

/**
 * IconStyleProps — представляет пропсы стилизации Icon и layout-пропсы.
 *
 * @property sizePreset — размер окна иконки
 */
export type IconStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
};

/**
 * ICON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Icon.
 */
const ICON_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'sizePreset']);

/**
 * getIconStyles — возвращает CSS-правила для корня `StyledIcon`: габарит
 * и внутренний отступ.
 *
 * @param props пропсы стилизации Icon
 * @returns CSS-правила, каждое с новой строки
 */
function getIconStyles(props: IconStyleProps): string {
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;
  const size = getMinBlockSize(sizePreset);

  const styles = [
    `inline-size: ${size};`,
    `block-size: ${size};`,
    `padding: ${getIconPadding(sizePreset)};`,
  ];

  return styles.join('\n');
}

/**
 * StyledIcon — задаёт корневой узел компонента Icon.
 * Базируется на `<span>` и поддерживает все пропсы из `IconStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `place-items: center` — центрирует svg в окне
 *  - `flex-shrink: 0` — окно не сжимается во flex-рядах
 *  - `max-block-size: 100%` на `& svg` — вертикальный зажим svg; reset зажимает
 *    только `max-inline-size`
 *
 * Генерация стилей:
 *  - `getIconStyles` — габарит и внутренний отступ
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 *
 * Единственный узел проекта, создающий условия рендера svg: центрирующий бокс
 * и зажим svg по обеим осям.
 */
export const StyledIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => !ICON_PROP_NAMES.has(prop),
})<IconStyleProps>`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  ${(props) => getIconStyles(props)}
  ${(props) => getLayoutStyles(props)}

  & svg {
    max-block-size: 100%;
  }
`;
