/**
 * Файл: `src/ui/field-clear/index.tsx`
 * Предоставляет компонент FieldClear для отображения кнопки сброса значения поля.
 *
 * Поддерживает:
 *  - размерный ряд через проп `sizePreset`
 *  - форму через проп `shape`
 *  - тон заливки окна через проп `iconTone`
 *  - тон глифа через проп `iconFill`
 *  - недоступное состояние через проп `disabled`
 *  - доступное имя через проп `ariaLabel`
 *  - обработчик клика через проп `onClick`
 *
 * Основные задачи:
 * 1. Экспортировать компонент FieldClear
 * 2. Типизировать пропсы через `FieldClearProps`
 *
 * Потребители:
 *  - контролы с полем ввода, например Input и SearchField — рендерят кнопку сброса
 */

import { CloseIcon } from '@icons';
import { Icon, type IconShapePreset, type IconSizePreset } from '@ui/icon';
import { type TonePreset } from '@ui/tones';

/**
 * INLINE_FIELD_CLEAR_PADDING — задаёт отступ окна кнопки сброса.
 * Значение не берётся из таблицы отступов по `sizePreset`.
 */
const INLINE_FIELD_CLEAR_PADDING = 12;

/**
 * FieldClearProps — представляет пропсы компонента FieldClear.
 *
 * @property ariaLabel — доступное имя кнопки сброса
 * @property disabled — включает недоступное состояние
 * @property iconFill — тон глифа
 * @property iconTone — тон заливки окна
 * @property onClick — обработчик клика
 * @property shape — форма кнопки сброса
 * @property sizePreset — размер кнопки сброса
 */
type FieldClearProps = {
  ariaLabel: string;
  disabled?: boolean;
  iconFill?: TonePreset;
  iconTone?: TonePreset;
  onClick: () => void;
  shape?: IconShapePreset;
  sizePreset?: IconSizePreset;
};

/**
 * FieldClear — отображает кнопку сброса значения поля.
 *
 * @example
 * <FieldClear
 *   ariaLabel={resolveClearAriaLabel(label)}
 *   disabled={disabled}
 *   shape={clearShape}
 *   sizePreset={sizePreset}
 *   onClick={handleClear}
 * />
 * <FieldClear
 *   ariaLabel={resolveClearAriaLabel(label, CLEAR_SEARCH_ARIA_LABEL)}
 *   disabled={disabled}
 *   iconFill={iconFill}
 *   iconTone={iconTone}
 *   shape={clearShape}
 *   sizePreset={sizePreset}
 *   onClick={handleClear}
 * />
 */
export function FieldClear({
  ariaLabel,
  disabled,
  iconFill,
  iconTone,
  onClick,
  shape,
  sizePreset,
}: FieldClearProps) {
  return (
    <Icon
      aria-label={ariaLabel}
      as="button"
      data-slot="clear"
      disabled={disabled}
      iconFill={iconFill}
      iconTone={iconTone}
      padding={INLINE_FIELD_CLEAR_PADDING}
      shape={shape}
      showBorder={false}
      showHover={false}
      sizePreset={sizePreset}
      onClick={onClick}
    >
      <CloseIcon />
    </Icon>
  );
}
