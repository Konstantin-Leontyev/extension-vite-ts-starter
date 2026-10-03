/**
 * Файл: `src/ui/button/index.tsx`
 * Предоставляет компонент Button для отображения кнопки с лейблом и опциональной иконкой.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - семантический тон через проп `tone`
 *  - форму через проп `shape`
 *  - тон рамки через проп `borderTone`
 *  - содержимое лейбла через `children`
 *  - тон лейбла через проп `textTone`
 *  - подпись над кнопкой через проп `label`
 *  - иконку через проп `icon`
 *  - позицию иконки через проп `iconPosition`
 *  - тон секции иконки через проп `iconTone`
 *  - тон глифа иконки через проп `iconFill`
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
} from '@ui/icon';
import { getTextSize } from '@ui/presets';
import { Text, type TextTonePreset } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import {
  StyledButton,
  StyledButtonLabel,
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
 * @property iconTone — тон секции иконки
 */
type ButtonIconProps =
  | {
      icon: ReactNode;
      iconFill?: TonePreset;
      iconPosition?: IconPosition;
      iconTone?: TonePreset;
    }
  | {
      icon?: never;
      iconFill?: never;
      iconPosition?: never;
      iconTone?: never;
    };

/**
 * ButtonProps — представляет пропсы компонента Button.
 *
 * @property children — содержимое лейбла
 * @property label — подпись над кнопкой
 * @property textTone — тон лейбла
 */
type ButtonProps = {
  children: ReactNode;
  label?: string;
  textTone?: TextTonePreset;
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
 *   size="small"
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
  iconTone,
  id,
  label,
  shape,
  size,
  textTone,
  tone,
  type = DEFAULT_BUTTON_TYPE,
  ...rest
}: ButtonProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const fallbackId = useId();
  const buttonId = id ?? fallbackId;
  const hasIcon = Boolean(icon);
  const iconShape = resolveIconShape(shape);

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
      size={size}
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
        size={size}
        tone={tone}
        type={type}
        {...restProps}
      >
        {iconPosition === 'start' && iconNode}
        {hasIcon ? (
          <StyledButtonLabel
            align="center"
            controlSize={size}
            ellipsis
            size={getTextSize(size)}
            tone={textTone}
          >
            {children}
          </StyledButtonLabel>
        ) : (
          <Text align="center" ellipsis size={getTextSize(size)} tone={textTone}>
            {children}
          </Text>
        )}
        {iconPosition === 'end' && iconNode}
      </StyledButton>
    </StyledButtonRoot>
  );
}

export { type ButtonIconProps };
