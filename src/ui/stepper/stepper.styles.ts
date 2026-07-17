/**
 * Файл: `src/ui/stepper/stepper.styles.ts`
 * Определяет внешний вид компонента Stepper.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `StepperStyleProps`, `StepperRootStyleProps`, `StepperInputStyleProps`,
 *    `StepperSuffixStyleProps`, `StepperSpinStyleProps`, `StepperValueStyleProps`
 *    и `StepperButtonStyleProps`
 * 2. Предоставить функции `getStepperValueStyles`, `getStepperInputStyles`, `getStepperSuffixStyles`,
 *    `getStepperSpinStyles`, `getStepperButtonStyles` и `getStepperRootStyles`
 * 3. Предоставить styled-узлы `StyledStepperRoot`, `StyledStepperValue`, `StyledStepperInput`,
 *    `StyledStepperSuffix`, `StyledStepperSpin` и `StyledStepperButton`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/stepper/index.tsx` — собирает компонент Stepper
 */
import { type CSSProperties } from 'react';
import styled from 'styled-components';

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
import { getSpacingValue } from '@ui/spacing';
import { getTextProperties } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * StepperStyleProps — представляет пропсы стилизации Stepper и layout-пропсы.
 *
 * @property valueAlign — горизонтальное выравнивание значения
 */
export type StepperStyleProps = LayoutProps &
  StepperRootStyleProps & {
    valueAlign?: CSSProperties['textAlign'];
  };

/**
 * StepperRootStyleProps — представляет пропсы стилизации корневого поля Stepper.
 *
 * @property shape — форма поля
 * @property sizePreset — размер компонента
 */
type StepperRootStyleProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * StepperButtonStyleProps — представляет пропсы стилизации половины области стрелок.
 *
 * @property sizePreset — размер компонента
 */
type StepperButtonStyleProps = {
  sizePreset?: SizePreset;
};

/**
 * StepperInputStyleProps — представляет пропсы стилизации нативного поля ввода.
 *
 * @property sizePreset — размер компонента
 * @property valueAlign — горизонтальное выравнивание значения
 */
type StepperInputStyleProps = {
  sizePreset?: SizePreset;
  valueAlign?: CSSProperties['textAlign'];
};

/**
 * StepperSpinStyleProps — представляет пропсы стилизации области стрелок.
 *
 * @property sizePreset — размер компонента
 */
type StepperSpinStyleProps = {
  sizePreset?: SizePreset;
};

/**
 * StepperSuffixStyleProps — представляет пропсы стилизации суффикса единицы.
 *
 * @property sizePreset — размер компонента
 */
type StepperSuffixStyleProps = {
  sizePreset?: SizePreset;
};

/**
 * StepperValueStyleProps — представляет пропсы стилизации ячейки значения.
 *
 * @property sizePreset — размер компонента
 */
type StepperValueStyleProps = {
  sizePreset?: SizePreset;
};

/**
 * STEPPER_ROOT_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Stepper.
 */
const STEPPER_ROOT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'shape',
  'sizePreset',
]);
/**
 * STEPPER_BUTTON_PROP_NAMES — хранит имена пропсов стилизации половины области стрелок.
 */
const STEPPER_BUTTON_PROP_NAMES = new Set<string>(['sizePreset']);
/**
 * STEPPER_INPUT_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const STEPPER_INPUT_PROP_NAMES = new Set<string>(['sizePreset', 'valueAlign']);
/**
 * STEPPER_SPIN_PROP_NAMES — хранит имена пропсов стилизации области стрелок.
 */
const STEPPER_SPIN_PROP_NAMES = new Set<string>(['sizePreset']);
/**
 * STEPPER_SUFFIX_PROP_NAMES — хранит имена пропсов стилизации суффикса единицы.
 */
const STEPPER_SUFFIX_PROP_NAMES = new Set<string>(['sizePreset']);
/**
 * STEPPER_VALUE_PROP_NAMES — хранит имена пропсов стилизации ячейки значения.
 */
const STEPPER_VALUE_PROP_NAMES = new Set<string>(['sizePreset']);
/**
 * getStepperRootStyles — возвращает CSS-правила для корня `StyledStepperRoot`: габариты,
 * рамку, скругление, фон, тень и кольцо фокуса.
 *
 * @param props пропсы стилизации корневого поля и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperRootStyles(
  props: StepperRootStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;
  const square = getMinBlockSize(sizePreset);

  const styles = [
    `min-block-size: ${square};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${resolveBlockRadius(shape, square)};`,
    `background-color: ${theme.colors.surface};`,
    `box-shadow: ${theme.shadow.surface};`,
    '&:focus-within {',
    `outline: 2px solid ${theme.colors.focusRing};`,
    'outline-offset: 2px;',
    '}',
  ];

  return styles.join('\n');
}

/**
 * getStepperButtonStyles — возвращает CSS-правила для узла `StyledStepperButton`: габарит
 * половинки, цвет, разделитель между половинками и подсветку наведения.
 * Высота задаётся как половина `minBlockSize`, чтобы заданная высота строки не позволяла
 * `<svg>` раздуть авто-строку грида. Окно шеврона создаёт `Icon` в JSX: заполнение
 * половинки с отступом 2 даёт окна 12, 16 или 20 px при половинках 16, 20 или 24 px.
 *
 * @param props пропсы стилизации половины области стрелок и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperButtonStyles(
  props: StepperButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    'inline-size: 100%;',
    `block-size: calc(${getMinBlockSize(sizePreset)} / 2);`,
    `color: ${theme.colors.muted};`,
    '&:first-of-type {',
    `border-block-end: 1px solid ${theme.colors.border};`,
    '}',
    '&:not(:disabled):hover,',
    '&:focus-visible {',
    `color: ${theme.colors.default};`,
    `background-color: ${theme.colors.hoverSurface};`,
    '}',
  ];

  return styles.join('\n');
}

/**
 * getStepperInputStyles — возвращает CSS-правила для узла `StyledStepperInput`: типографику
 * и выравнивание значения.
 *
 * @param props пропсы стилизации нативного поля ввода и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperInputStyles(
  props: StepperInputStyleProps & { theme: AppTheme }
): string {
  const { sizePreset = DEFAULT_SIZE_PRESET, valueAlign } = props;

  const styles = [getTextProperties(getTextSize(sizePreset))];

  if (valueAlign !== undefined) {
    styles.push(`text-align: ${valueAlign};`);
  }

  return styles.join('\n');
}

/**
 * getStepperSpinStyles — возвращает CSS-правила для узла `StyledStepperSpin`: ширину области
 * стрелок и разделитель.
 *
 * @param props пропсы стилизации области стрелок и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperSpinStyles(
  props: StepperSpinStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    `inline-size: ${getMinBlockSize(sizePreset)};`,
    `border-inline-start: 1px solid ${theme.colors.border};`,
  ];

  return styles.join('\n');
}

/**
 * getStepperSuffixStyles — возвращает CSS-правила для узла `StyledStepperSuffix`: цвет,
 * типографику и запрет сжатия.
 *
 * @param props пропсы стилизации суффикса единицы и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperSuffixStyles(
  props: StepperSuffixStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    'flex-shrink: 0;',
    `color: ${theme.colors.muted};`,
    getTextProperties(getTextSize(sizePreset)),
  ];

  return styles.join('\n');
}

/**
 * getStepperValueStyles — возвращает CSS-правила для узла `StyledStepperValue`: внутренние
 * отступы по размеру.
 *
 * @param props пропсы стилизации ячейки значения и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperValueStyles(
  props: StepperValueStyleProps & { theme: AppTheme }
): string {
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [`padding-inline: ${getPaddingInline(sizePreset)};`];

  return styles.join('\n');
}

/**
 * StyledStepperRoot — задаёт корневой узел компонента Stepper.
 * Базируется на `<div>` и поддерживает все пропсы из `StepperRootStyleProps` и `LayoutProps`.
 *
 * Встроенные стили:
 *  - `display: grid` и `grid-template-columns: minmax(0, 1fr) auto` — ячейка значения
 *    и область стрелок в одном ряду
 *  - `overflow: hidden` — обрезает содержимое по скруглению корня
 *
 * Генерация стилей:
 *  - `getStepperRootStyles` — габариты, рамка, скругление, фон, тень и кольцо фокуса
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledStepperRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !STEPPER_ROOT_PROP_NAMES.has(prop),
})<StepperRootStyleProps & LayoutProps>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: stretch;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  ${(props) => getStepperRootStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
/**
 * StyledStepperButton — задаёт половину области стрелок компонента Stepper.
 * Базируется на `<button>` и принимает проп `sizePreset`; окно шеврона создаёт `Icon` в JSX.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта, Icon заполняет половинку
 *  - `grid-template: 100% / 100%` — definite-ячейка под Icon-заполнитель: половинка
 *    не квадратная, в авто-строке процент высоты Icon цикличен и отбрасывается —
 *    svg надувает строку по ширине
 *  - `outline: none` на `:focus-visible` — кольцо фокуса показывает корень через `:focus-within`
 *
 * Генерация стилей:
 *  - `getStepperButtonStyles` — габарит половинки, цвет, разделитель между половинками
 *    и подсветка наведения
 */
export const StyledStepperButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !STEPPER_BUTTON_PROP_NAMES.has(prop),
})<StepperButtonStyleProps>`
  display: grid;
  grid-template: 100% / 100%;

  &:focus-visible {
    outline: none;
  }

  ${(props) => getStepperButtonStyles(props)}
`;
/**
 * StyledStepperInput — задаёт нативное поле ввода компонента Stepper.
 * Базируется на `<input>` и поддерживает все пропсы из `StepperInputStyleProps`.
 *
 * Встроенные стили:
 *  - `flex: 1 1 auto` — поле занимает оставшееся место в ячейке значения
 *  - `background-color: transparent` и `border: none` — рамку и кольцо фокуса несёт корень
 *  - `outline: none` на `:focus-visible` — кольцо фокуса показывает корень через `:focus-within`
 *
 * Генерация стилей:
 *  - `getStepperInputStyles` — типографика и выравнивание значения
 */
export const StyledStepperInput = styled.input.withConfig({
  shouldForwardProp: (prop) => !STEPPER_INPUT_PROP_NAMES.has(prop),
})<StepperInputStyleProps>`
  flex: 1 1 auto;
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0;
  color: inherit;
  background-color: transparent;
  border: none;

  &:focus-visible {
    outline: none;
  }

  ${(props) => getStepperInputStyles(props)}
`;
/**
 * StyledStepperSpin — задаёт область стрелок компонента Stepper.
 * Базируется на `<div>` и принимает проп `sizePreset`.
 *
 * Встроенные стили:
 *  - `display: grid` и `grid-template-rows: 1fr 1fr` — делит область пополам на стрелки вверх и вниз
 *
 * Генерация стилей:
 *  - `getStepperSpinStyles` — ширина области и разделитель
 */
export const StyledStepperSpin = styled.div.withConfig({
  shouldForwardProp: (prop) => !STEPPER_SPIN_PROP_NAMES.has(prop),
})<StepperSpinStyleProps>`
  display: grid;
  grid-template-rows: 1fr 1fr;
  ${(props) => getStepperSpinStyles(props)}
`;
/**
 * StyledStepperSuffix — задаёт суффикс единицы компонента Stepper.
 * Базируется на `<span>` и принимает проп `sizePreset`.
 *
 * Генерация стилей:
 *  - `getStepperSuffixStyles` — цвет, типографика, запрет сжатия и переноса по символам
 */
export const StyledStepperSuffix = styled.span.withConfig({
  shouldForwardProp: (prop) => !STEPPER_SUFFIX_PROP_NAMES.has(prop),
})<StepperSuffixStyleProps>`
  ${(props) => getStepperSuffixStyles(props)}
`;
/**
 * StyledStepperValue — задаёт ячейку значения компонента Stepper.
 * Базируется на `<div>` и принимает проп `sizePreset`.
 *
 * Встроенные стили:
 *  - `display: flex` — оправданное исключение из grid по умолчанию: условный суффикс
 *    единицы — сосед в потоке, без фиксированного grid-трека
 *  - `gap` — отступ между полем и суффиксом
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getStepperValueStyles` — внутренние отступы по размеру
 */
export const StyledStepperValue = styled.div.withConfig({
  shouldForwardProp: (prop) => !STEPPER_VALUE_PROP_NAMES.has(prop),
})<StepperValueStyleProps>`
  display: flex;
  gap: ${getSpacingValue(4)};
  align-items: center;
  min-inline-size: 0;
  white-space: nowrap;
  ${(props) => getStepperValueStyles(props)}
`;
