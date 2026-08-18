/**
 * Файл: `src/ui/spinner/index.tsx`
 * Предоставляет компонент Spinner для отображения индикатора загрузки.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - доступное имя для скринридера через проп `ariaLabel`
 *  - подпись под индикатором через `children`
 *  - резерв высоты под подпись через проп `reserveTextSpace`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Spinner
 * 2. Типизировать пропсы через `SpinnerProps`
 * 3. Выставлять `role="status"` и `aria-label` для скринридеров
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают состояние загрузки
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { getTextSize } from '@ui/presets';
import { Text, getTextLineHeight } from '@ui/text';

import {
  StyledSpinner,
  StyledSpinnerRoot,
  splitLayoutProps,
  type SpinnerStyleProps,
} from './spinner.styles';

/**
 * DEFAULT_SPINNER_ARIA_LABEL — задаёт доступное имя для скринридера по умолчанию.
 * Используется, когда вызывающий код не передал проп `ariaLabel`.
 */
const DEFAULT_SPINNER_ARIA_LABEL = 'Loading';

/**
 * DEFAULT_SPINNER_RESERVE_TEXT_SPACE — задаёт резерв высоты под подпись по умолчанию.
 * Используется, когда вызывающий код не передал проп `reserveTextSpace`.
 */
const DEFAULT_SPINNER_RESERVE_TEXT_SPACE = false;

/**
 * SpinnerProps — представляет пропсы компонента Spinner.
 *
 * @property ariaLabel — доступное имя для скринридера
 * @property reserveTextSpace — включает резерв высоты под подпись, чтобы появление текста не сдвигало соседей
 */
type SpinnerProps = SpinnerStyleProps & {
  ariaLabel?: string;
  reserveTextSpace?: boolean;
} & Omit<ComponentPropsWithRef<'div'>, 'className' | 'style' | keyof SpinnerStyleProps>;

/**
 * Spinner — отображает индикатор неопределённой загрузки.
 *
 * @example
 * <Spinner />
 * <Spinner sizePreset="large" tone="primary" reserveTextSpace>Загрузка…</Spinner>
 */
function Spinner({
  ariaLabel = DEFAULT_SPINNER_ARIA_LABEL,
  children,
  reserveTextSpace = DEFAULT_SPINNER_RESERVE_TEXT_SPACE,
  sizePreset,
  tone,
  ...rest
}: SpinnerProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const textSizePreset = getTextSize(sizePreset);
  const hasText = Boolean(typeof children === 'string' ? children.trim() : children);
  const showText = hasText || reserveTextSpace;

  return (
    <StyledSpinnerRoot {...layoutProps}>
      <StyledSpinner
        aria-label={ariaLabel}
        role="status"
        sizePreset={sizePreset}
        tone={tone}
        {...restProps}
      />
      {showText && (
        <Text
          align="center"
          minBlockSize={
            reserveTextSpace && !hasText ? getTextLineHeight(textSizePreset) : undefined
          }
          sizePreset={textSizePreset}
        >
          {hasText ? children : null}
        </Text>
      )}
    </StyledSpinnerRoot>
  );
}

export { Spinner };
