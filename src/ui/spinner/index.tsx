/**
 * Файл: `src/ui/spinner/index.tsx`
 * Предоставляет компонент Spinner для отображения индикатора загрузки.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - доступное имя для скринридера через проп `label`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Spinner
 * 2. Типизировать пропсы через `SpinnerProps`
 * 3. Выставлять `role="status"` и `aria-label` для скринридеров
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают состояние загрузки
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { StyledSpinner, type SpinnerStyleProps } from './spinner.styles';

/**
 * DEFAULT_SPINNER_LABEL — задаёт EN-дефолт для `aria-label`.
 * Используется, когда вызывающий код не передал проп `label`.
 */
const DEFAULT_SPINNER_LABEL = 'Loading';

/**
 * SpinnerProps — представляет пропсы компонента Spinner.
 *
 * @property label — доступное имя для скринридера
 */
type SpinnerProps = SpinnerStyleProps & {
  label?: string;
} & Omit<ComponentPropsWithRef<'div'>, keyof SpinnerStyleProps | 'className' | 'style'>;

/**
 * Spinner — отображает индикатор неопределённой загрузки.
 *
 * @example
 * <Spinner />
 * <Spinner sizePreset="large" tone="primary" />
 */
export function Spinner({ label = DEFAULT_SPINNER_LABEL, ...props }: SpinnerProps) {
  return <StyledSpinner aria-label={label} role="status" {...props} />;
}
