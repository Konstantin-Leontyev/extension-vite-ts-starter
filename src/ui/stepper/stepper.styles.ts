/**
 * Файл: `src/ui/stepper/stepper.styles.ts`
 * Определяет внешний вид компонента Stepper.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `StepperStyleProps`
 * 2. Предоставить styled-узлы `StyledStepperFieldRoot`, `StyledStepperRoot`,
 *    `StyledStepperValue`, `StyledStepperInput`, `StyledStepperSpin` и `StyledStepperButton`
 * 3. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/stepper/index.tsx` — собирает компонент Stepper
 */
import styled from 'styled-components';

import { getBorderStyles } from '@ui/border';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getOutlineStyles } from '@ui/outline';
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
import { getTextProperties, type TextAlignPreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * StepperRootStyleProps — представляет пропсы стилизации корневого поля Stepper.
 *
 * @property borderTone — тон рамки
 * @property shape — форма поля
 * @property size — размер компонента
 */
type StepperRootStyleProps = {
  borderTone?: TonePreset;
  shape?: ShapePreset;
  size?: SizePreset;
};

/**
 * StepperStyleProps — представляет пропсы стилизации Stepper и layout-пропсы.
 */
export type StepperStyleProps = LayoutProps & StepperRootStyleProps;

/**
 * StyledStepperFieldRoot — задаёт корневой узел компонента Stepper.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Встроенные стили:
 *  - `display: grid` — вертикальный поток подписи и поля
 *  - `gap` — отступ между подписью и полем
 *  - `inline-size: 100%` — занимает ширину родителя
 *  - `min-inline-size: 0` — предотвращает переполнение
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledStepperFieldRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: grid;
  gap: ${getSpacingValue(8)};
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * STEPPER_ROOT_PROP_NAMES — хранит имена пропсов стилизации поля Stepper.
 */
const STEPPER_ROOT_PROP_NAMES = new Set<string>(['borderTone', 'shape', 'size']);

/**
 * getStepperRootStyles — возвращает CSS-правила для узла `StyledStepperRoot`: габариты,
 * рамку с тенью через `getBorderStyles`, скругление, фон и `outline` фокуса.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape` и `size`
 * 2. Собирает `min-block-size`, `border-radius` через `resolveBlockRadius`,
 *    заливку `surface` и рамку с тенью через `getBorderStyles`
 * 3. Акцент фокуса даёт `outline` на узле при `&:has(:focus-visible)`
 *
 * @param props пропсы стилизации поля и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperRootStyles(
  props: StepperRootStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { borderTone, shape = DEFAULT_SHAPE_PRESET, size = DEFAULT_SIZE_PRESET } = props;
  const minBlockSize = getMinBlockSize(size);

  return `
    min-block-size: ${minBlockSize};
    border-radius: ${resolveBlockRadius(shape, minBlockSize)};
    background-color: ${theme.colors.surface};
    ${getBorderStyles(theme, undefined, undefined, borderTone)}

    &:has(:focus-visible) {
      ${getOutlineStyles(theme.colors.focusOutline)}
    }
  `;
}

/**
 * StyledStepperRoot — задаёт узел поля компонента Stepper.
 * Базируется на `<div>` и поддерживает пропсы из `StepperRootStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` и `grid-template-columns: minmax(0, 1fr) auto` — ячейка значения
 *    и область стрелок в одном ряду
 *  - `overflow: hidden` — обрезает содержимое по скруглению корня
 *
 * Генерация стилей:
 *  - `getStepperRootStyles` — габариты, рамка с тенью через `getBorderStyles`,
 *    скругление, фон и `outline` фокуса
 *
 * Атрибут `data-disabled` на корне включает приглушение рамки, фона, значения, суффикса
 * и стрелок через контракт `@ui/reset`, без локального disabled-стиля.
 */
export const StyledStepperRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !STEPPER_ROOT_PROP_NAMES.has(prop),
})<StepperRootStyleProps>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  ${(props) => getStepperRootStyles(props)}
`;

/**
 * StepperValueStyleProps — представляет пропсы стилизации ячейки значения.
 *
 * @property size — размер компонента
 */
type StepperValueStyleProps = {
  size?: SizePreset;
};

/**
 * STEPPER_VALUE_PROP_NAMES — хранит имена пропсов стилизации ячейки значения.
 */
const STEPPER_VALUE_PROP_NAMES = new Set<string>(['size']);

/**
 * STEPPER_TEXT_ALIGN — задаёт выравнивание пары «значение + суффикс».
 * Пара остаётся по центру через `justify-content` ячейки.
 */
const STEPPER_TEXT_ALIGN: TextAlignPreset = 'center';

/**
 * getStepperValueStyles — возвращает CSS-правила для узла `StyledStepperValue`: внутренние
 * отступы по размеру и позицию пары «значение + суффикс».
 * Поле ввода сжато по содержимому через `field-sizing: content`, поэтому выравнивание
 * живёт в `justify-content` ячейки и двигает пару целиком —
 * суффикс не отрывается от значения.
 *
 * Как работает:
 * 1. Подставляет дефолт `size`
 * 2. Собирает `padding-inline` через `getPaddingInline` и `justify-content` из
 *    `STEPPER_TEXT_ALIGN`
 *
 * @param props пропсы стилизации ячейки значения
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperValueStyles(props: StepperValueStyleProps): string {
  const { size = DEFAULT_SIZE_PRESET } = props;

  return `
    padding-inline: ${getPaddingInline(size)};
    justify-content: ${STEPPER_TEXT_ALIGN};
  `;
}

/**
 * StyledStepperValue — задаёт ячейку значения компонента Stepper.
 * Базируется на `<div>`, принимает проп `size`,
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
 * @property size — размер компонента
 */
type StepperInputStyleProps = {
  size?: SizePreset;
};

/**
 * STEPPER_INPUT_PROP_NAMES — хранит имена пропсов стилизации нативного поля ввода.
 */
const STEPPER_INPUT_PROP_NAMES = new Set<string>(['size']);

/**
 * getStepperInputStyles — возвращает CSS-правила для узла `StyledStepperInput`: типографику
 * значения.
 *
 * Как работает:
 * 1. Подставляет дефолт `size`
 * 2. Кладёт типографику через `getTextProperties` по `getTextSize`
 *
 * @param props пропсы стилизации нативного поля ввода
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperInputStyles(props: StepperInputStyleProps): string {
  const { size = DEFAULT_SIZE_PRESET } = props;

  return getTextProperties(getTextSize(size));
}

/**
 * StyledStepperInput — задаёт нативное поле ввода компонента Stepper.
 * Базируется на `<input>` и поддерживает все пропсы из `StepperInputStyleProps`.
 *
 * Встроенные стили:
 *  - `field-sizing: content` — ширина поля следует за набранным значением,
 *    суффикс в ячейке встаёт вплотную к значению
 *  - `min-inline-size: 0` — при нехватке места в ячейке сжимается поле, не суффикс
 *  - `background-color: transparent` и `border: none` — рамку и `outline` фокуса несёт корень
 *  - `outline: none` на `:focus-visible` — `outline` фокуса показывает корень через `&:has(:focus-visible)`
 *
 * Генерация стилей:
 *  - `getStepperInputStyles` — типографика значения
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
 * @property size — размер компонента
 */
type StepperSpinStyleProps = {
  size?: SizePreset;
};

/**
 * STEPPER_SPIN_PROP_NAMES — хранит имена пропсов стилизации области стрелок.
 */
const STEPPER_SPIN_PROP_NAMES = new Set<string>(['size']);

/**
 * getStepperSpinStyles — возвращает CSS-правила для узла `StyledStepperSpin`: ширину области
 * стрелок и разделитель.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `size`
 * 2. Собирает ширину области через `getMinBlockSize` и разделитель
 *    `border-inline-start` цветом `border` из темы
 *
 * @param props пропсы стилизации области стрелок и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperSpinStyles(
  props: StepperSpinStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { size = DEFAULT_SIZE_PRESET } = props;

  return `
    inline-size: ${getMinBlockSize(size)};
    border-inline-start: 1px solid ${theme.colors.border};
  `;
}

/**
 * StyledStepperSpin — задаёт область стрелок компонента Stepper.
 * Базируется на `<div>` и принимает проп `size`.
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
 * @property size — размер компонента
 */
type StepperButtonStyleProps = {
  size?: SizePreset;
};

/**
 * STEPPER_BUTTON_PROP_NAMES — хранит имена пропсов стилизации половины области стрелок.
 */
const STEPPER_BUTTON_PROP_NAMES = new Set<string>(['size']);

/**
 * getStepperButtonStyles — возвращает CSS-правила для узла `StyledStepperButton`: габарит
 * половинки, цвет, разделитель между половинками и подсветку наведения.
 * Высота задаётся как половина `minBlockSize`, чтобы заданная высота строки не позволяла
 * `<svg>` раздуть авто-строку грида. Окно шеврона создаёт `Icon` в JSX: заполнение
 * половинки с отступом `2` даёт окна `12`, `16` или `20` px при половинках `16`, `20` или `24` px.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `size`
 * 2. Собирает ширину `100%`, высоту как половину `getMinBlockSize` и цвет `muted`
 * 3. У первой половинки кладёт разделитель `border-block-end`
 * 4. На наведении и `:focus-visible` без `disabled` красит фон `veil`
 *
 * @param props пропсы стилизации половины области стрелок и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getStepperButtonStyles(
  props: StepperButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { size = DEFAULT_SIZE_PRESET } = props;

  return `
    inline-size: 100%;
    block-size: calc(${getMinBlockSize(size)} / 2);
    color: ${theme.colors.muted};

    &:first-of-type {
      border-block-end: 1px solid ${theme.colors.border};
    }

    &:not(:disabled):hover,
    &:focus-visible {
      background-color: ${theme.colors.veil};
    }
  `;
}

/**
 * StyledStepperButton — задаёт половину области стрелок компонента Stepper.
 * Базируется на `<button>` и принимает проп `size`. Окно шеврона создаёт `Icon` в JSX.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта, Icon заполняет половинку
 *  - `grid-template: 100% / 100%` — definite-ячейка под Icon-заполнитель: половинка
 *    не квадратная, в авто-строке процент высоты Icon цикличен и отбрасывается —
 *    svg надувает строку по ширине
 *  - `outline: none` на `:focus-visible` — `outline` фокуса показывает корень через `&:has(:focus-visible)`
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
