/**
 * Файл: `src/ui/spinner/index.tsx`
 * Предоставляет компонент Spinner для отображения индикатора загрузки.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - доступное имя для скринридера через проп `label`
 *  - подпись под индикатором через проп `text`
 *  - тон подписи через проп `textTone`
 *  - размер подписи через проп `textSize`
 *  - курсив подписи через проп `textItalic`
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

import { type ComponentPropsWithRef } from 'react';

import { Text, getTextLineHeight, type TextSizePreset, type TextTone } from '@ui/text';

import {
  StyledSpinner,
  StyledSpinnerRoot,
  getSpinnerTextSize,
  splitLayoutProps,
  type SpinnerStyleProps,
} from './spinner.styles';

/**
 * DEFAULT_SPINNER_LABEL — задаёт EN-дефолт для `aria-label`.
 * Используется, когда вызывающий код не передал проп `label`.
 */
const DEFAULT_SPINNER_LABEL = 'Loading';

/**
 * DEFAULT_SPINNER_TEXT_TONE — задаёт тон подписи по умолчанию.
 * Подпись контрола — вторичный текст, поэтому `muted`.
 */
const DEFAULT_SPINNER_TEXT_TONE: TextTone = 'muted';

/**
 * SpinnerProps — представляет пропсы компонента Spinner.
 *
 * @property label — доступное имя для скринридера
 * @property reserveTextSpace — включает резерв высоты под подпись, чтобы появление текста не сдвигало соседей
 * @property text — подпись под индикатором
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 */
type SpinnerProps = SpinnerStyleProps & {
  label?: string;
  reserveTextSpace?: boolean;
  text?: string;
  textItalic?: boolean;
  textSize?: TextSizePreset;
  textTone?: TextTone;
} & Omit<ComponentPropsWithRef<'div'>, keyof SpinnerStyleProps | 'className' | 'style'>;

/**
 * Spinner — отображает индикатор неопределённой загрузки.
 *
 * @example
 * <Spinner />
 * <Spinner sizePreset="large" tone="primary" reserveTextSpace text="Загрузка…" />
 */
function Spinner({
  label = DEFAULT_SPINNER_LABEL,
  reserveTextSpace = false,
  sizePreset,
  text,
  textItalic,
  textSize,
  textTone = DEFAULT_SPINNER_TEXT_TONE,
  tone,
  ...rest
}: SpinnerProps) {
  const { layout, rest: indicatorRest } = splitLayoutProps(rest);
  const resolvedTextSize = textSize ?? getSpinnerTextSize(sizePreset);
  const hasText = Boolean(text?.trim());
  const showText = hasText || reserveTextSpace;

  return (
    <StyledSpinnerRoot {...layout}>
      <StyledSpinner
        aria-label={label}
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
          {hasText ? text : null}
        </Text>
      )}
    </StyledSpinnerRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { Spinner, getSpinnerTextSize };
