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
 *  - тон подписи через проп `textTone`
 *  - размер подписи через проп `textSize`
 *  - курсив подписи через проп `textItalic`
 *  - резерв высоты под подпись через проп `reserveTextSpace`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Spinner
 * 2. Типизировать пропсы через `SpinnerProps`
 * 3. Выставлять `role="status"` и `aria-label` для скринридеров
 * 4. Реэкспортировать мост размера текста `getSpinnerTextSize`
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают состояние загрузки
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Text, getTextLineHeight, type TextSizePreset, type TextTone } from '@ui/text';

import {
  StyledSpinner,
  StyledSpinnerRoot,
  getSpinnerTextSize,
  splitLayoutProps,
  type SpinnerStyleProps,
} from './spinner.styles';

/**
 * DEFAULT_SPINNER_ARIA_LABEL — задаёт EN-дефолт для `aria-label`.
 * Используется, когда вызывающий код не передал проп `ariaLabel`.
 */
const DEFAULT_SPINNER_ARIA_LABEL = 'Loading';

/**
 * DEFAULT_SPINNER_TEXT_TONE — задаёт тон подписи по умолчанию.
 * Подпись контрола — вторичный текст, поэтому `muted`.
 */
const DEFAULT_SPINNER_TEXT_TONE: TextTone = 'muted';

/**
 * SpinnerProps — представляет пропсы компонента Spinner.
 *
 * @property ariaLabel — доступное имя для скринридера
 * @property children — подпись под индикатором
 * @property reserveTextSpace — включает резерв высоты под подпись, чтобы появление текста не сдвигало соседей
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 */
type SpinnerProps = SpinnerStyleProps & {
  ariaLabel?: string;
  children?: ReactNode;
  reserveTextSpace?: boolean;
  textItalic?: boolean;
  textSize?: TextSizePreset;
  textTone?: TextTone;
} & Omit<
    ComponentPropsWithRef<'div'>,
    keyof SpinnerStyleProps | 'children' | 'className' | 'style'
  >;

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
  reserveTextSpace = false,
  sizePreset,
  textItalic,
  textSize,
  textTone = DEFAULT_SPINNER_TEXT_TONE,
  tone,
  ...rest
}: SpinnerProps) {
  const { layout, rest: indicatorRest } = splitLayoutProps(rest);
  const resolvedTextSize = textSize ?? getSpinnerTextSize(sizePreset);
  const hasText = Boolean(typeof children === 'string' ? children.trim() : children);
  const showText = hasText || reserveTextSpace;

  return (
    <StyledSpinnerRoot {...layout}>
      <StyledSpinner
        aria-label={ariaLabel}
        role="status"
        sizePreset={sizePreset}
        tone={tone}
        {...indicatorRest}
      />
      {showText && (
        <Text
          align="center"
          italic={textItalic}
          minBlockSize={
            reserveTextSpace && !hasText
              ? getTextLineHeight(resolvedTextSize)
              : undefined
          }
          sizePreset={resolvedTextSize}
          tone={textTone}
        >
          {hasText ? children : null}
        </Text>
      )}
    </StyledSpinnerRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { Spinner, getSpinnerTextSize };
