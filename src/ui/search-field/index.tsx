/**
 * Файл: `src/ui/search-field/index.tsx`
 * Предоставляет компонент SearchField для отображения управляемого поля поиска
 * с секцией иконки и кнопкой сброса.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму строки-поля через проп `shape`
 *  - рамку контрола через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - иконку через проп `icon`
 *  - позицию иконки через проп `iconPosition`
 *  - тон секции иконки через проп `iconTone`
 *  - тон глифа иконки через проп `iconFill`
 *  - секцию иконки через проп `showIcon`
 *  - подпись над полем через проп `label`
 *  - контролируемое значение через проп `value`
 *  - обработчик изменения значения через проп `onChange`
 *  - кнопку сброса через проп `showClearButton`. Дефолт — сброс есть; кнопка
 *    появляется при непустом значении
 *  - обработчик сброса значения через проп `onClear`
 *
 * Основные задачи:
 * 1. Экспортировать компонент SearchField
 * 2. Типизировать пропсы через `SearchFieldProps`
 * 3. Экспортировать тип `SearchFieldShowIconProps`
 * 4. Связывать подпись и поле для доступности
 * 5. Выставлять `aria-label` кнопки сброса через `resolveClearAriaLabel`
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

import { SearchIcon } from '@icons';
import { resolveClearAriaLabel } from '@ui/a11y';
import { FieldClear } from '@ui/field-clear';
import { FieldLabel } from '@ui/field-label';
import { Icon, resolveIconShape, type IconPosition } from '@ui/icon';
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
 * DEFAULT_SEARCH_FIELD_SHOW_CLEAR_BUTTON — задаёт показ кнопки сброса по умолчанию.
 * Используется, когда вызывающий код не передал проп `showClearButton`.
 */
const DEFAULT_SEARCH_FIELD_SHOW_CLEAR_BUTTON = true;

/**
 * CLEAR_SEARCH_ARIA_LABEL — задаёт запасной `aria-label` кнопки сброса поиска.
 * Передаётся вторым аргументом в `resolveClearAriaLabel`, когда подпись пуста.
 */
const CLEAR_SEARCH_ARIA_LABEL = 'Clear search';

/**
 * SearchFieldShowIconProps — представляет пропсы секции иконки SearchField.
 * Поля секции допустимы, пока `showIcon` не выключен: дефолт флага — иконка есть.
 *
 * @property icon — svg секции иконки
 * @property iconPosition — позиция иконки относительно поля
 * @property showIcon — включает секцию иконки
 */
type SearchFieldShowIconProps =
  | {
      icon?: never;
      iconPosition?: never;
      showIcon: false;
    }
  | {
      icon?: ReactNode;
      iconPosition?: IconPosition;
      showIcon?: true;
    };

/**
 * SearchFieldProps — представляет пропсы компонента SearchField.
 *
 * @property iconFill — тон глифа иконки при нейтральном `iconTone`
 * @property iconTone — тон секции иконки
 * @property label — подпись над полем
 * @property onChange — обработчик изменения значения
 * @property onClear — обработчик сброса значения
 * @property showClearButton — включает кнопку сброса
 * @property value — контролируемое значение
 */
type SearchFieldProps = {
  iconFill?: TonePreset;
  iconTone?: TonePreset;
  label?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  showClearButton?: boolean;
  value: string;
} & SearchFieldShowIconProps &
  SearchFieldStyleProps &
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
function SearchField({
  borderTone,
  icon = DEFAULT_SEARCH_FIELD_ICON,
  iconFill,
  iconPosition = DEFAULT_SEARCH_FIELD_ICON_POSITION,
  iconTone,
  label,
  onChange,
  onClear,
  shape,
  showBorder,
  showClearButton = DEFAULT_SEARCH_FIELD_SHOW_CLEAR_BUTTON,
  showIcon = DEFAULT_SEARCH_FIELD_SHOW_ICON,
  showShadow,
  size,
  value,
  ...rest
}: SearchFieldProps) {
  const iconShape = resolveIconShape(shape);
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const { disabled, id: idProp, ref, ...inputProps } = restProps;
  const fallbackId = useId();
  const id = idProp ?? fallbackId;
  const inputRef = useRef<HTMLInputElement>(null);
  const hasClear = showClearButton && value.length > 0;
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
      size={size}
    >
      {icon}
    </Icon>
  );

  const clearNode = hasClear && (
    <FieldClear
      ariaLabel={resolveClearAriaLabel(label, CLEAR_SEARCH_ARIA_LABEL)}
      disabled={disabled}
      iconFill={iconFill}
      iconTone={iconTone}
      shape={iconShape}
      size={size}
      onClick={handleClear}
    />
  );

  return (
    <StyledSearchFieldRoot data-disabled={disabled ? true : undefined} {...layoutProps}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledSearchFieldRow
        borderTone={borderTone}
        data-has-clear={hasClear ? true : undefined}
        iconTone={iconTone}
        shape={shape}
        showBorder={showBorder}
        showShadow={showShadow}
        size={size}
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
          size={size}
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

export { SearchField, type SearchFieldShowIconProps };
