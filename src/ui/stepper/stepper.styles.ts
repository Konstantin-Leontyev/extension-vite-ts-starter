/**
 * Файл: `src/ui/stepper/stepper.styles.ts`
 * Определяет внешний вид компонента Stepper.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `StepperStyleProps`
 * 2. Предоставить функцию `getStepperTextSize`
 * 3. Предоставить styled-узлы `StyledStepperRoot`, `StyledStepperValue`, `StyledStepperInput`,
 *    `StyledStepperSpin` и `StyledStepperButton`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/stepper/index.tsx` — собирает компонент Stepper и реэкспортирует публичное API
 */
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
import {
  getTextProperties,
  getTextToneColor,
  type TextAlignPreset,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * getStepperTextSize — возвращает размер значения и суффикса по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер компонента
 * @returns метка размера текста из `TextSizePreset` для значения и суффикса единицы
 */
export function getStepperTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * StepperStyleProps — представляет пропсы стилизации Stepper и layout-пропсы.
 *
 * @property textAlign — горизонтальное выравнивание пары «значение + суффикс»
 * @property textItalic — включает курсив значения и суффикса
 * @property textSize — размер значения и суффикса
 * @property textTone — тон значения и суффикса
 */
export type StepperStyleProps = LayoutProps &
  StepperRootStyleProps & {
    textAlign?: TextAlignPreset;
    textItalic?: boolean;
    textSize?: TextSizePreset;
    textTone?: TextTone;
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
 * STEPPER_ROOT_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Stepper.
 */
const STEPPER_ROOT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'shape',
  'sizePreset',
]);

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
  const minBlockSize = getMinBlockSize(sizePreset);

  const styles = [
    `min-block-size: ${minBlockSize};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${resolveBlockRadius(shape, minBlockSize)};`,
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
 *
 * При блокировке `src/ui/stepper/index.tsx` ставит на корень атрибут `data-disabled` —
 * контракт `[data-disabled]` из `@ui/reset` приглушает рамку, фон, значение, суффикс
 * и стрелки, без локального disabled-стиля.
 */
export const StyledStepperRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !STEPPER_ROOT_PROP_NAMES.has(prop),
})<StepperRootStyleProps & LayoutProps>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  ${(props) => getStepperRootStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StepperValueStyleProps — представляет пропсы стилизации ячейки значения.
 *
 * @property sizePreset — размер компонента
 * @property textAlign — горизонтальное выравнивание пары «значение + суффикс»
 */
type StepperValueStyleProps = {
  sizePreset?: SizePreset;
  textAlign?: TextAlignPreset;
};

/**
 * STEPPER_VALUE_PROP_NAMES — хранит имена пропсов стилизации ячейки значения.
 */
const STEPPER_VALUE_PROP_NAMES = new Set<string>(['sizePreset', 'textAlign']);

/**
 * getStepperValueStyles — возвращает CSS-правила для узла `StyledStepperValue`: внутренние
 * отступы по размеру и позицию пары «значение + суффикс».
 * Поле ввода сжато по содержимому через `field-sizing: content`, поэтому `textAlign`
 * транслируется в `justify-content` ячейки и двигает пару целиком —
 * суффикс не отрывается от значения.
 *
 * @param props пропсы стилизации ячейки значения и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperValueStyles(
  props: StepperValueStyleProps & { theme: AppTheme }
): string {
  const { sizePreset = DEFAULT_SIZE_PRESET, textAlign } = props;

  const styles = [`padding-inline: ${getPaddingInline(sizePreset)};`];

  if (textAlign !== undefined) {
    styles.push(`justify-content: ${textAlign};`);
  }

  return styles.join('\n');
}

/**
 * StyledStepperValue — задаёт ячейку значения компонента Stepper.
 * Базируется на `<div>`, принимает пропсы `sizePreset` и `textAlign`,
 * содержит нативное поле ввода и суффикс единицы во внутреннем Text.
 *
 * Встроенные стили:
 *  - `display: flex` — оправданное исключение из grid по умолчанию: условный суффикс
 *    единицы — сосед в потоке, без фиксированного grid-трека
 *  - `gap` — отступ между полем и суффиксом
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *  - `flex-shrink: 0` на `> :not(:first-child)` — при нехватке места сжимается
 *    поле ввода, не суффикс
 *
 * Генерация стилей:
 *  - `getStepperValueStyles` — внутренние отступы по размеру и позиция пары
 *    «значение + суффикс»
 */
export const StyledStepperValue = styled.div.withConfig({
  shouldForwardProp: (prop) => !STEPPER_VALUE_PROP_NAMES.has(prop),
})<StepperValueStyleProps>`
  display: flex;
  gap: ${getSpacingValue(4)};
  align-items: center;
  min-inline-size: 0;
  white-space: nowrap;

  > :not(:first-child) {
    flex-shrink: 0;
  }

  ${(props) => getStepperValueStyles(props)}
`;

/**
 * StepperInputStyleProps — представляет пропсы стилизации нативного поля ввода.
 *
 * @property textItalic — включает курсив значения
 * @property textSize — размер значения
 * @property textTone — тон значения
 */
type StepperInputStyleProps = {
  textItalic?: boolean;
  textSize: TextSizePreset;
  textTone?: TextTone;
};

/**
 * STEPPER_INPUT_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const STEPPER_INPUT_PROP_NAMES = new Set<string>(['textItalic', 'textSize', 'textTone']);

/**
 * getStepperInputStyles — возвращает CSS-правила для узла `StyledStepperInput`: типографику,
 * курсив и тон значения.
 * Типографику даёт `getTextProperties` по уже вычисленному `textSize`,
 * цвет тона — `getTextToneColor`. Для тона по умолчанию правило `color`
 * не добавляется — наследование цвета обеспечивает reset для `input`.
 *
 * @param props пропсы стилизации нативного поля ввода и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperInputStyles(
  props: StepperInputStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { textItalic, textSize, textTone } = props;

  const styles = [getTextProperties(textSize)];

  if (textItalic === true) {
    styles.push('font-style: italic;');
  }

  const textColor =
    textTone !== undefined ? getTextToneColor(theme, textTone) : undefined;

  if (textColor !== undefined) {
    styles.push(`color: ${textColor};`);
  }

  return styles.join('\n');
}

/**
 * StyledStepperInput — задаёт нативное поле ввода компонента Stepper.
 * Базируется на `<input>` и поддерживает все пропсы из `StepperInputStyleProps`.
 *
 * Встроенные стили:
 *  - `field-sizing: content` — ширина поля следует за набранным значением,
 *    суффикс в ячейке встаёт вплотную к значению
 *  - `min-inline-size: 0` — при нехватке места в ячейке сжимается поле, не суффикс
 *  - `background-color: transparent` и `border: none` — рамку и кольцо фокуса несёт корень
 *  - `outline: none` на `:focus-visible` — кольцо фокуса показывает корень через `:focus-within`
 *
 * Генерация стилей:
 *  - `getStepperInputStyles` — типографика, курсив и тон значения
 */
export const StyledStepperInput = styled.input.withConfig({
  shouldForwardProp: (prop) => !STEPPER_INPUT_PROP_NAMES.has(prop),
})<StepperInputStyleProps>`
  field-sizing: content;
  min-inline-size: 0;
  padding: 0;
  background-color: transparent;
  border: none;

  &:focus-visible {
    outline: none;
  }

  ${(props) => getStepperInputStyles(props)}
`;

/**
 * StepperSpinStyleProps — представляет пропсы стилизации области стрелок.
 *
 * @property sizePreset — размер компонента
 */
type StepperSpinStyleProps = {
  sizePreset?: SizePreset;
};

/**
 * STEPPER_SPIN_PROP_NAMES — хранит имена пропсов стилизации области стрелок.
 */
const STEPPER_SPIN_PROP_NAMES = new Set<string>(['sizePreset']);

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
 * StepperButtonStyleProps — представляет пропсы стилизации половины области стрелок.
 *
 * @property sizePreset — размер компонента
 */
type StepperButtonStyleProps = {
  sizePreset?: SizePreset;
};

/**
 * STEPPER_BUTTON_PROP_NAMES — хранит имена пропсов стилизации половины области стрелок.
 */
const STEPPER_BUTTON_PROP_NAMES = new Set<string>(['sizePreset']);

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
    `background-color: ${theme.colors.veil};`,
    '}',
  ];

  return styles.join('\n');
}

/**
 * StyledStepperButton — задаёт половину области стрелок компонента Stepper.
 * Базируется на `<button>` и принимает проп `sizePreset`. Окно шеврона создаёт `Icon` в JSX.
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
