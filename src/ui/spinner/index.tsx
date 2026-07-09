/**
 * Файл: index.tsx
 * Точка входа для компонента Spinner и его публичного API.
 * Предоставляет компонент индикатора неопределённой загрузки.
 *
 * Основные задачи:
 * 1. Экспортировать компонент Spinner для использования в приложении
 * 2. Обеспечить типизацию пропсов
 * 3. Предоставить ARIA-семантику для скринридеров (role="status" + aria-label)
 *
 * Потребители: страницы и виджеты приложения, витрина design-system.
 */

import { type ComponentPropsWithRef } from 'react';

import { StyledSpinner, type SpinnerStyleProps } from './spinner.styles';

/** EN-дефолт для aria-label (скринридер, не визуальный лейбл). */
const DEFAULT_SPINNER_LABEL = 'Loading';

/**
 * SpinnerProps — пропсы компонента Spinner.
 *
 * @property label — доступное имя для скринридера; EN-дефолт `Loading`
 *
 * Остальные оси — из `SpinnerStyleProps` и нативных атрибутов `div`.
 */
type SpinnerProps = SpinnerStyleProps & {
  label?: string;
} & Omit<ComponentPropsWithRef<'div'>, keyof SpinnerStyleProps | 'className' | 'style'>;

/**
 * Spinner — компонент индикатора неопределённой загрузки.
 *
 * @example
 * <Spinner />
 * <Spinner sizePreset="large" tone="primary" />
 */
export function Spinner({ label = DEFAULT_SPINNER_LABEL, ...props }: SpinnerProps) {
  return <StyledSpinner aria-label={label} role="status" {...props} />;
}
