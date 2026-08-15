/**
 * Файл: `src/ui/search-field/index.tsx`
 * Предоставляет компонент SearchField для отображения управляемого поля поиска
 * с секцией иконки и кнопкой сброса.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму строки-поля через проп `shape`
 *  - форму кнопки сброса через проп `clearShape`. Без `clearShape` форма
 *    выводится из `shape`
 *  - форму секции иконки через проп `iconShape`. Без `iconShape` форма
 *    выводится из `shape`
 *  - рамку контрола через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - горизонтальное выравнивание значения через проп `textAlign`
 *  - курсив значения через проп `textItalic`
 *  - иконку через проп `icon`
 *  - позицию иконки через проп `iconPosition`
 *  - тон секции иконки через проп `iconTone`
 *  - тон глифа иконки через проп `iconFill`
 *  - секцию иконки через проп `showIcon`
 *  - подпись над полем через проп `label`
 *  - контролируемое значение через проп `value`
 *  - обработчик изменения значения через проп `onChange`
 *  - обработчик сброса значения через проп `onClear`
 *
 * Основные задачи:
 * 1. Экспортировать компонент SearchField
 * 2. Типизировать пропсы через `SearchFieldProps`
 * 3. Связывать подпись и поле для доступности
 * 4. Выставлять `aria-label` кнопки сброса через `resolveClearAriaLabel`
 *
 * Потребители:
 *  - `@ui/combobox` — рендерит поле поиска в панели
 *  - страницы и виджеты приложения — собирают фильтры и поиск
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useId,
  useRef,
  type ChangeEventHandler,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';

import { CloseIcon, SearchIcon } from '@icons';
import { resolveClearAriaLabel } from '@ui/a11y';
import { FieldLabel } from '@ui/field-label';
import {
  Icon,
  resolveIconShape,
  type IconPosition,
  type IconShapePreset,
} from '@ui/icon';
import { assignRef } from '@ui/ref';
import { type TonePreset } from '@ui/tones';

import {
  StyledSearchFieldControl,
  StyledSearchFieldRoot,
  StyledSearchFieldRow,
  splitLayoutProps,
  type SearchFieldStyleProps,
} from './search-field.styles';

/**
 * DEFAULT_SEARCH_FIELD_ICON — задаёт иконку по умолчанию.
 * Используется, когда вызывающий код не передал проп `icon`.
 */
const DEFAULT_SEARCH_FIELD_ICON = <SearchIcon />;

/**
 * DEFAULT_SEARCH_FIELD_ICON_POSITION — задаёт позицию иконки по умолчанию.
 * Используется, когда вызывающий код не передал проп `iconPosition`.
 */
const DEFAULT_SEARCH_FIELD_ICON_POSITION: IconPosition = 'start';

/**
 * DEFAULT_SEARCH_FIELD_SHOW_ICON — задаёт показ секции иконки по умолчанию.
 * Используется, когда вызывающий код не передал проп `showIcon`.
 */
const DEFAULT_SEARCH_FIELD_SHOW_ICON = true;

/**
 * CLEAR_SEARCH_ARIA_LABEL — задаёт запасной `aria-label` кнопки сброса поиска.
 * Передаётся вторым аргументом в `resolveClearAriaLabel`, когда подпись пуста.
 */
const CLEAR_SEARCH_ARIA_LABEL = 'Clear search';

/**
 * SEARCH_FIELD_CLEAR_PADDING — задаёт фиксированный отступ кнопки сброса.
 * Значение `12` осознанно перенесено из Combobox до врезки SearchField и не
 * берётся из таблицы отступов по `sizePreset`. Используется как значение пропа
 * `padding` у Icon кнопки сброса.
 */
const SEARCH_FIELD_CLEAR_PADDING = 12;

/**
 * SearchFieldProps — представляет пропсы компонента SearchField.
 *
 * @property clearShape — форма кнопки сброса
 * @property icon — svg секции иконки
 * @property iconFill — тон глифа иконки при нейтральном `iconTone`
 * @property iconPosition — позиция иконки относительно поля
 * @property iconShape — форма секции иконки
 * @property iconTone — тон секции иконки
 * @property label — подпись над полем
 * @property onChange — обработчик изменения значения
 * @property onClear — обработчик сброса значения
 * @property showIcon — включает секцию иконки
 * @property value — контролируемое значение
 */
type SearchFieldProps = {
  clearShape?: IconShapePreset;
  icon?: ReactNode;
  iconFill?: TonePreset;
  iconPosition?: IconPosition;
  iconShape?: IconShapePreset;
  iconTone?: TonePreset;
  label?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  showIcon?: boolean;
  value: string;
} & SearchFieldStyleProps &
  Omit<
    ComponentPropsWithRef<'input'>,
    'className' | 'onChange' | 'style' | 'type' | 'value' | keyof SearchFieldStyleProps
  >;

/**
 * SearchField — отображает управляемое поле поиска с секцией иконки и кнопкой сброса.
 *
 * @example
 * <SearchField
 *   label="Label:"
 *   value={query}
 *   onChange={handleQueryChange}
 *   onClear={() => setQuery('')}
 * />
 * <SearchField
 *   showBorder={false}
 *   showIcon={false}
 *   value={query}
 *   onChange={handleQueryChange}
 *   onClear={() => setQuery('')}
 * />
 */
export function SearchField({
  borderTone,
  clearShape: clearShapeProp,
  icon = DEFAULT_SEARCH_FIELD_ICON,
  iconFill,
  iconPosition = DEFAULT_SEARCH_FIELD_ICON_POSITION,
  iconShape: iconShapeProp,
  iconTone,
  label,
  onChange,
  onClear,
  shape,
  showBorder,
  showIcon = DEFAULT_SEARCH_FIELD_SHOW_ICON,
  showShadow,
  sizePreset,
  textAlign,
  textItalic,
  value,
  ...rest
}: SearchFieldProps) {
  const resolvedIconShape = resolveIconShape(shape);
  const clearShape = clearShapeProp ?? resolvedIconShape;
  const iconShape = iconShapeProp ?? resolvedIconShape;
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const { disabled, id: idProp, ref, ...inputProps } = restProps;
  const fallbackId = useId();
  const id = idProp ?? fallbackId;
  const inputRef = useRef<HTMLInputElement>(null);
  const hasClear = value.length > 0;
  const isIconStart = iconPosition === 'start';

  function handleClear(): void {
    onClear();
    inputRef.current?.focus();
  }

  const iconNode = showIcon && (
    <Icon
      data-slot="icon"
      iconFill={iconFill}
      iconTone={iconTone}
      interactive
      shape={iconShape}
      showBorder={false}
      showHover={false}
      showShadow={false}
      sizePreset={sizePreset}
    >
      {icon}
    </Icon>
  );

  const clearNode = hasClear && (
    <Icon
      aria-label={resolveClearAriaLabel(label, CLEAR_SEARCH_ARIA_LABEL)}
      as="button"
      data-slot="clear"
      disabled={disabled}
      iconFill={iconFill}
      iconTone={iconTone}
      padding={SEARCH_FIELD_CLEAR_PADDING}
      shape={clearShape}
      showBorder={false}
      showHover={false}
      showShadow={false}
      sizePreset={sizePreset}
      onClick={handleClear}
    >
      <CloseIcon />
    </Icon>
  );

  return (
    <StyledSearchFieldRoot data-disabled={disabled ? '' : undefined} {...layoutProps}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledSearchFieldRow
        borderTone={borderTone}
        data-has-clear={hasClear ? '' : undefined}
        iconTone={iconTone}
        shape={shape}
        showBorder={showBorder}
        showShadow={showShadow}
        sizePreset={sizePreset}
      >
        {isIconStart && iconNode}
        <StyledSearchFieldControl
          {...inputProps}
          disabled={disabled}
          id={id}
          ref={(node) => {
            inputRef.current = node;
            assignRef(ref, node);
          }}
          sizePreset={sizePreset}
          textAlign={textAlign}
          textItalic={textItalic}
          type="search"
          value={value}
          onChange={onChange}
        />
        {!isIconStart && iconNode}
        {clearNode}
      </StyledSearchFieldRow>
    </StyledSearchFieldRoot>
  );
}
