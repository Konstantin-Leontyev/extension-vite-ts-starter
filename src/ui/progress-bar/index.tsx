/**
 * Файл: `src/ui/progress-bar/index.tsx`
 * Предоставляет компонент ProgressBar для отображения индикатора выполнения
 * с определённым прогрессом.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - долю заполнения через проп `value`
 *  - подпись с процентом через проп `showText`
 *  - тон подписи через проп `textTone`
 *  - размер подписи через проп `textSize`
 *  - курсив подписи через проп `textItalic`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ProgressBar
 * 2. Типизировать пропсы через `ProgressBarProps`
 * 3. Выставлять `role="progressbar"` и `aria-valuenow` для скринридеров
 * 4. Реэкспортировать мост размера текста `getProgressBarTextSize`
 *
 * Потребители:
 *  - страницы и виджеты приложения, например ModelDownloadGate — показывают ход
 *    выполнения операций
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { Text, type TextSizePreset, type TextTone } from '@ui/text';

import {
  StyledProgressBar,
  StyledProgressBarFill,
  StyledProgressBarRoot,
  clampProgressValue,
  getProgressBarTextSize,
  type ProgressBarStyleProps,
} from './progress-bar.styles';

/**
 * DEFAULT_PROGRESS_BAR_SHOW_TEXT — задаёт видимость подписи с процентом по умолчанию.
 * Используется, когда вызывающий код не передал проп `showText`.
 */
const DEFAULT_PROGRESS_BAR_SHOW_TEXT = false;

/**
 * DEFAULT_PROGRESS_BAR_TEXT_TONE — задаёт тон подписи по умолчанию.
 * Подпись контрола — вторичный текст, поэтому `muted`.
 */
const DEFAULT_PROGRESS_BAR_TEXT_TONE: TextTone = 'muted';

/**
 * ProgressBarProps — представляет пропсы компонента ProgressBar.
 *
 * @property showText — включает подпись с процентом выполнения рядом с полосой
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 */
type ProgressBarProps = ProgressBarStyleProps & {
  showText?: boolean;
  textItalic?: boolean;
  textSize?: TextSizePreset;
  textTone?: TextTone;
} & Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'style' | keyof ProgressBarStyleProps
  >;

/**
 * ProgressBar — отображает полосу прогресса с определённым значением заполнения.
 *
 * @example
 * <ProgressBar value={0.75} />
 * <ProgressBar value={0.5} showText tone="success" />
 */
function ProgressBar({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  showText = DEFAULT_PROGRESS_BAR_SHOW_TEXT,
  sizePreset,
  textItalic,
  textSize,
  textTone = DEFAULT_PROGRESS_BAR_TEXT_TONE,
  tone,
  value,
  ...rest
}: ProgressBarProps) {
  const clampedValue = clampProgressValue(value);
  const percent = Math.round(clampedValue * 100);

  return (
    <StyledProgressBarRoot {...rest}>
      <StyledProgressBar
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        role="progressbar"
        sizePreset={sizePreset}
      >
        <StyledProgressBarFill tone={tone} value={clampedValue} />
      </StyledProgressBar>
      {showText && (
        <Text
          aria-hidden={true}
          italic={textItalic}
          sizePreset={textSize ?? getProgressBarTextSize(sizePreset)}
          tone={textTone}
          whiteSpace="nowrap"
        >
          {percent}%
        </Text>
      )}
    </StyledProgressBarRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { ProgressBar, getProgressBarTextSize };
