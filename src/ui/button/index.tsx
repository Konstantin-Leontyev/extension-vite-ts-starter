/**
 * Файл: `src/ui/button/index.tsx`
 * Предоставляет компонент Button для отображения кнопки с лейблом и опциональной иконкой.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - форму через проп `shape`
 *  - содержимое через `children`
 *  - тон лейбла через проп `textTone`
 *  - размер лейбла через проп `textSize`
 *  - курсив лейбла через проп `textItalic`
 *  - иконку через проп `icon`
 *  - позицию иконки через проп `iconPosition`
 *  - тон секции иконки через проп `iconTone`
 *  - тон глифа иконки через проп `iconFill`
 *  - зафиксированное нажатое состояние через проп `active`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Button
 * 2. Типизировать пропсы через `ButtonProps`
 * 3. Реэкспортировать мост размера текста `getButtonTextSize`
 *
 * Потребители:
 *  - контролы, например RangeInput — рендерят кнопки действий внутри себя
 *  - страницы и виджеты приложения, например ModelDownloadGate — рендерят действия
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Icon } from '@ui/icon';
import { Text, type TextSizePreset, type TextTone } from '@ui/text';

import { StyledButton, getButtonTextSize, type ButtonStyleProps } from './button.styles';

/**
 * DEFAULT_BUTTON_TYPE — задаёт тип кнопки по умолчанию.
 * Используется, когда вызывающий код не передал проп `type`.
 */
const DEFAULT_BUTTON_TYPE = 'button';

/**
 * ButtonProps — представляет пропсы компонента Button.
 *
 * @property children — содержимое лейбла
 * @property icon — svg иконки действия. Окно под svg создаёт `Icon` по `sizePreset`
 * @property textItalic — включает курсив лейбла
 * @property textSize — размер лейбла
 * @property textTone — тон лейбла
 */
type ButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  textItalic?: boolean;
  textSize?: TextSizePreset;
  textTone?: TextTone;
} & ButtonStyleProps &
  Omit<ComponentPropsWithRef<'button'>, 'className' | 'style' | keyof ButtonStyleProps>;

/**
 * Button — отображает кнопку с лейблом и опциональной иконкой.
 *
 * @example
 * <Button tone="primary" onClick={() => setIsModalOpen(true)}>
 *   Open modal
 * </Button>
 * <Button sizePreset="small" tone="danger" onClick={handleBulkDelete}>
 *   Delete
 * </Button>
 */
export function Button({
  children,
  icon,
  iconPosition,
  sizePreset,
  textItalic,
  textSize,
  textTone,
  tone,
  type = DEFAULT_BUTTON_TYPE,
  ...rest
}: ButtonProps) {
  const hasIcon = Boolean(icon);

  const iconNode = hasIcon && (
    <Icon data-slot="icon" sizePreset={sizePreset}>
      {icon}
    </Icon>
  );

  return (
    <StyledButton
      hasIcon={hasIcon}
      iconPosition={iconPosition}
      sizePreset={sizePreset}
      tone={tone}
      type={type}
      {...rest}
    >
      {iconPosition === 'start' && iconNode}
      <Text
        align="center"
        data-slot="label"
        italic={textItalic}
        showEllipsis
        sizePreset={textSize ?? getButtonTextSize(sizePreset)}
        tone={textTone}
      >
        {children}
      </Text>
      {iconPosition !== 'start' && iconNode}
    </StyledButton>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { getButtonTextSize };
