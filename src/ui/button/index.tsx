/**
 * Файл: `src/ui/button/index.tsx`
 * Предоставляет компонент Button для отображения кнопки с лейблом и опциональной иконкой.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - форму через проп `shape`
 *  - тон рамки через проп `borderTone`
 *  - содержимое через `children`
 *  - подпись над кнопкой через проп `label`
 *  - тон лейбла через проп `textTone`
 *  - размер лейбла через проп `textSize`
 *  - курсив лейбла через проп `textItalic`
 *  - иконку через проп `icon`
 *  - позицию иконки через проп `iconPosition`
 *  - тон секции иконки через проп `iconTone`
 *  - тон глифа иконки через проп `iconFill`
 *  - форму секции иконки через проп `iconShape`. Без `iconShape` форма
 *    выводится из `shape`
 *  - зафиксированное нажатое состояние через проп `active`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Button
 * 2. Типизировать пропсы через `ButtonProps`
 * 3. Экспортировать тип `ButtonIconProps`
 *
 * Потребители:
 *  - контролы, например RangeInput — рендерят кнопки действий внутри себя
 *  - страницы и виджеты приложения — рендерят действия
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';

import { FieldLabel } from '@ui/field-label';
import {
  DEFAULT_ICON_POSITION,
  Icon,
  resolveIconShape,
  type IconPosition,
  type IconShapePreset,
} from '@ui/icon';
import { getTextSize } from '@ui/presets';
import { Text, type TextSizePreset, type TextTone } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import {
  StyledButton,
  StyledButtonRoot,
  splitLayoutProps,
  type ButtonStyleProps,
} from './button.styles';

/**
 * DEFAULT_BUTTON_TYPE — задаёт тип кнопки по умолчанию.
 * Используется, когда вызывающий код не передал проп `type`.
 */
const DEFAULT_BUTTON_TYPE = 'button';

/**
 * ButtonIconProps — представляет пропсы иконки Button.
 * Поля иконки допустимы только вместе с `icon`.
 *
 * @property icon — svg иконки действия
 * @property iconFill — тон глифа иконки при нейтральном `iconTone`
 * @property iconPosition — позиция иконки относительно лейбла
 * @property iconShape — форма секции иконки
 * @property iconTone — тон секции иконки
 */
type ButtonIconProps =
  | {
      icon: ReactNode;
      iconFill?: TonePreset;
      iconPosition?: IconPosition;
      iconShape?: IconShapePreset;
      iconTone?: TonePreset;
    }
  | {
      icon?: never;
      iconFill?: never;
      iconPosition?: never;
      iconShape?: never;
      iconTone?: never;
    };

/**
 * ButtonProps — представляет пропсы компонента Button.
 *
 * @property children — содержимое лейбла
 * @property label — подпись над кнопкой
 * @property textItalic — включает курсив лейбла
 * @property textSize — размер лейбла
 * @property textTone — тон лейбла
 */
type ButtonProps = {
  children: ReactNode;
  label?: string;
  textItalic?: boolean;
  textSize?: TextSizePreset;
  textTone?: TextTone;
} & ButtonIconProps &
  Omit<ButtonStyleProps, 'iconTone'> &
  Omit<ComponentPropsWithRef<'button'>, 'className' | 'style' | keyof ButtonStyleProps>;

/**
 * Button — отображает кнопку с лейблом и опциональной иконкой.
 *
 * @example
 * <Button tone="primary" onClick={() => setIsModalOpen(true)}>
 *   Open modal
 * </Button>
 * <Button
 *   icon={<SettingsIcon />}
 *   iconPosition="start"
 *   sizePreset="small"
 *   tone="danger"
 *   onClick={handleBulkDelete}
 * >
 *   Delete
 * </Button>
 */
export function Button({
  children,
  icon,
  iconFill,
  iconPosition = DEFAULT_ICON_POSITION,
  iconShape: iconShapeProp,
  iconTone,
  id,
  label,
  shape,
  sizePreset,
  textItalic,
  textSize,
  textTone,
  tone,
  type = DEFAULT_BUTTON_TYPE,
  ...rest
}: ButtonProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const fallbackId = useId();
  const buttonId = id ?? fallbackId;
  const hasIcon = Boolean(icon);
  const iconShape = iconShapeProp ?? resolveIconShape(shape);

  const iconNode = hasIcon && (
    <Icon
      data-slot="icon"
      iconFill={iconFill}
      iconTone={iconTone}
      interactive
      shape={iconShape}
      showBorder
      showHover={false}
      showShadow={false}
      sizePreset={sizePreset}
    >
      {icon}
    </Icon>
  );

  return (
    <StyledButtonRoot {...layoutProps}>
      <FieldLabel htmlFor={buttonId}>{label}</FieldLabel>
      <StyledButton
        hasIcon={hasIcon}
        iconTone={iconTone}
        id={buttonId}
        shape={shape}
        sizePreset={sizePreset}
        tone={tone}
        type={type}
        {...restProps}
      >
        {iconPosition === 'start' && iconNode}
        <Text
          align="center"
          data-slot="label"
          ellipsis
          italic={textItalic}
          sizePreset={textSize ?? getTextSize(sizePreset)}
          tone={textTone}
        >
          {children}
        </Text>
        {iconPosition === 'end' && iconNode}
      </StyledButton>
    </StyledButtonRoot>
  );
}

export { type ButtonIconProps };
