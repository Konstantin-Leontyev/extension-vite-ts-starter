/**
 * Файл: `src/ui/button/button.styles.ts`
 * Определяет внешний вид компонента Button.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ButtonStyleProps`
 * 2. Предоставить функцию `getButtonTextSize`
 * 3. Предоставить styled-узел `StyledButton`
 *
 * Потребители:
 *  - `src/ui/button/index.tsx` — собирает компонент Button и реэкспортирует публичное API
 */

import styled from 'styled-components';

import {
  ICON_SETTING_PROP_NAMES,
  getIconSectionSeamStyles,
  resolveIconStateBackground,
} from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPaddingInline,
  getTextSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  BORDER_SURFACE_MIX_PERCENT,
  DEFAULT_TONE,
  VARIANT_SURFACE_MIX_PERCENT,
  getToneColorKey,
  resolveColorMix,
  resolveVeilBackground,
  type TonePreset,
} from '@ui/tones';

/**
 * getButtonTextSize — возвращает размер лейбла по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер кнопки
 * @returns метка размера текста из `TextSizePreset` для лейбла кнопки
 */
export function getButtonTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * ButtonSurface — представляет заливки и цвет текста кнопки.
 *
 * @property activeBackground — заливка в состоянии `active`
 * @property backgroundColor — заливка в покое
 * @property color — цвет текста
 * @property hoverBackground — заливка при наведении
 */
type ButtonSurface = {
  activeBackground: string;
  backgroundColor: string;
  color: string;
  hoverBackground: string;
};

/**
 * resolveButtonSurface — возвращает заливки и цвет текста кнопки по `tone`.
 * Для нейтрального тона основа `surface`, наведение — вуаль поверх неё,
 * `active` — смесь `border` с `surface` через `BORDER_SURFACE_MIX_PERCENT`.
 * Для цветного — цвет из темы со сдвигом состояний к `shade`.
 *
 * @param theme текущая тема
 * @param tone семантический тон кнопки
 * @returns заливки и цвет текста для корня и секции лейбла
 */
function resolveButtonSurface(theme: AppTheme, tone: TonePreset): ButtonSurface {
  const colorKey = getToneColorKey(tone);

  if (!colorKey) {
    return {
      activeBackground: resolveColorMix(
        theme.colors.border,
        theme.colors.surface,
        BORDER_SURFACE_MIX_PERCENT
      ),
      backgroundColor: theme.colors.surface,
      color: theme.colors.default,
      hoverBackground: resolveVeilBackground(theme, theme.colors.surface),
    };
  }

  const color = theme.colors[colorKey];

  return {
    activeBackground: resolveColorMix(color, theme.colors.shade),
    backgroundColor: color,
    color: theme.colors.inverse,
    hoverBackground: resolveColorMix(color, theme.colors.shade),
  };
}

/**
 * ButtonStyleProps — представляет пропсы стилизации Button и layout-пропсы.
 *
 * @property active — включает зафиксированное нажатое состояние
 * @property iconTone — тон секции иконки
 * @property shape — форма кнопки
 * @property sizePreset — размер компонента
 * @property tone — семантический тон
 */
export type ButtonStyleProps = LayoutProps & {
  active?: boolean;
  iconTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * ButtonStyledProps — представляет пропсы стилизации корня `StyledButton`.
 *
 * @property hasIcon — включает split-раскладку с секцией иконки. Выключенный —
 *   корень рисуется solid-заливкой
 */
type ButtonStyledProps = ButtonStyleProps & { hasIcon: boolean };

/**
 * BUTTON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Button.
 */
const BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...ICON_SETTING_PROP_NAMES,
  'active',
  'hasIcon',
  'shape',
  'sizePreset',
  'tone',
]);

/**
 * DEFAULT_BUTTON_ACTIVE — задаёт зафиксированное нажатое состояние по умолчанию.
 * Используется, когда вызывающий код не передал проп `active`.
 */
const DEFAULT_BUTTON_ACTIVE = false;

/**
 * getButtonSplitStyles — возвращает CSS-правила для корня `StyledButton`:
 * отступ лейбла, шов и канал состояний секции иконки. Статику секции красит
 * внутренний Icon своими пропсами, фон лейбла — собственная заливка корня.
 *
 * Как работает:
 * 1. Переносит `padding-inline` с корня на слот лейбла — секция иконки прижата к краю
 * 2. Добавляет шов, только когда тон кнопки и тон секции нейтральны — иначе
 *    контраста цвета секций достаточно
 * 3. При цветном `iconTone` на наведении выставляет `--icon-state-background`
 *    сдвигом тона к `shade`; нейтральная секция подсвечивается заливкой корня
 * 4. При `active` фиксирует значение канала: для нейтральной секции — смесь
 *    `primary` с `surface` через `VARIANT_SURFACE_MIX_PERCENT`
 *
 * @param props пропсы стилизации корня и текущая тема
 * @returns CSS-правила, каждое с новой строки
 */
function getButtonSplitStyles(props: ButtonStyledProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    active = DEFAULT_BUTTON_ACTIVE,
    iconTone = DEFAULT_TONE,
    sizePreset = DEFAULT_SIZE_PRESET,
  } = props;
  const iconColorKey = getToneColorKey(iconTone);
  const hoverStateBackground = resolveIconStateBackground(theme, iconTone, 'none');

  const styles = [
    `[data-slot='label'] {`,
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    `}`,
    getIconSectionSeamStyles({ borderColor: theme.colors.border }),
  ];

  if (hoverStateBackground) {
    styles.push(
      `&:not(:disabled):hover {`,
      `--icon-state-background: ${hoverStateBackground};`,
      `}`
    );
  }

  if (active) {
    styles.push(
      `&:not(:disabled) {`,
      `--icon-state-background: ${
        iconColorKey
          ? resolveColorMix(theme.colors[iconColorKey], theme.colors.shade)
          : resolveColorMix(
              theme.colors.primary,
              theme.colors.surface,
              VARIANT_SURFACE_MIX_PERCENT
            )
      };`,
      `}`
    );
  }

  return styles.join('\n');
}

/**
 * getButtonStyles — возвращает CSS-правила для корня `StyledButton`: размер, рамка,
 * радиус, тень, цвет текста, заливку с состояниями и раскладку слота лейбла.
 *
 * Как работает:
 * 1. Собирает общие правила корня: размер, рамка, радиус, тень, цвет и заливка —
 *    фон лейбла всегда фон корня, наведение и `active` меняют его целиком
 * 2. Задаёт раскладку слота лейбла на корне: Text остаётся контентом без
 *    layout-пропсов
 * 3. При `hasIcon` делегирует шов и канал секции иконки в `getButtonSplitStyles`
 * 4. Без иконки кладёт `padding-inline` на корень
 *
 * @param props пропсы стилизации корня и текущая тема
 * @returns CSS-правила, каждое с новой строки
 */
function getButtonStyles(props: ButtonStyledProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    active = DEFAULT_BUTTON_ACTIVE,
    hasIcon,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
    tone = DEFAULT_TONE,
  } = props;
  const surface = resolveButtonSurface(theme, tone);
  const minBlockSize = getMinBlockSize(sizePreset);

  const styles = [
    `min-block-size: ${minBlockSize};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${resolveBlockRadius(shape, minBlockSize)};`,
    `box-shadow: ${theme.shadow.surface};`,
    `color: ${surface.color};`,
    `background-color: ${surface.backgroundColor};`,
    `&:not(:disabled):hover { background: ${surface.hoverBackground}; }`,
    `[data-slot='label'] {`,
    `flex: 1 1 auto;`,
    `align-content: center;`,
    `min-inline-size: 0;`,
    `}`,
  ];

  if (active) {
    styles.push(`&:not(:disabled) { background: ${surface.activeBackground}; }`);
  }

  if (hasIcon) {
    styles.push(getButtonSplitStyles(props));
  } else {
    styles.push(`padding-inline: ${getPaddingInline(sizePreset)};`);
  }

  return styles.join('\n');
}

/**
 * StyledButton — задаёт корневой узел компонента Button.
 * Базируется на `<button>` и поддерживает все пропсы из `ButtonStyledProps`.
 *
 * Встроенные стили:
 *  - `display: flex` — оправданное исключение из grid по умолчанию: ряд
 *    иконка-лейбл без динамических шаблонов колонок под наличие и позицию иконки
 *  - `inline-size: 100%` — кнопка занимает ширину контейнера
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнере
 *  - `overflow: hidden` — обрезает квадратное окно Icon по радиусу корня:
 *    скругление секций — обрезка корнем, не радиусы на детях
 *
 * Генерация стилей:
 *  - `getButtonStyles` — размер, рамка, радиус, тень, цвет, заливка и слот лейбла
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 *
 * Слоты: раскладку лейбла, шов и канал состояний секции иконки задаёт корень
 * по `[data-slot]`; статику секции красит внутренний Icon.
 */
export const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !BUTTON_PROP_NAMES.has(prop),
})<ButtonStyledProps>`
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  ${(props) => getButtonStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
