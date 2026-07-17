/**
 * Файл: `src/ui/scroll-port/index.tsx`
 * Предоставляет компонент ScrollPort для отображения прокручиваемой области с кросс-системным
 * скроллбаром и градиентными вуалями на краях.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - отступ inline-end через проп `paddingInlineEnd`
 *  - градиентные вуали на краях через проп `showVeil`
 *  - отступ сверху перед контентом через проп `scrollbarInsetBlockStart`
 *  - отступ снизу перед контентом через проп `scrollbarInsetBlockEnd`
 *  - прокручиваемое содержимое через `children`
 *  - ссылку на DOM-узел вьюпорта прокрутки через проп `ref`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ScrollPort
 * 2. Типизировать пропсы через `ScrollPortProps`
 *
 * Потребители:
 *  - `@ui/table` — оборачивает таблицу в прокручиваемый контейнер
 *  - `@ui/combobox` — прокручивает список опций
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */
import { type ComponentPropsWithRef, type ReactNode } from 'react';

import {
  StyledScrollPortContainer,
  StyledScrollPortRoot,
  StyledScrollPortViewport,
  type ScrollPortStyleProps,
} from './scroll-port.styles';

/**
 * ScrollPortProps — представляет пропсы компонента ScrollPort.
 *
 * @property children — прокручиваемое содержимое
 */
type ScrollPortProps = ScrollPortStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    'children' | 'className' | 'style' | keyof ScrollPortStyleProps
  > & {
    children: ReactNode;
  };

/**
 * ScrollPort — отображает прокручиваемую область с кросс-системным скроллбаром.
 *
 * @example
 * <ScrollPort>
 *   <LongContent />
 * </ScrollPort>
 * <ScrollPort paddingInlineEnd={8} showVeil={false}>
 *   <OptionsList />
 * </ScrollPort>
 * <ScrollPort ref={viewportRef} {...layout}>
 *   <StyledTableClip>{table}</StyledTableClip>
 * </ScrollPort>
 */
export function ScrollPort({
  children,
  paddingInlineEnd,
  ref,
  scrollbarInsetBlockEnd,
  scrollbarInsetBlockStart,
  showVeil,
  ...rest
}: ScrollPortProps) {
  return (
    <StyledScrollPortRoot
      paddingInlineEnd={paddingInlineEnd}
      showVeil={showVeil}
      {...rest}
    >
      <StyledScrollPortContainer>
        <StyledScrollPortViewport
          paddingInlineEnd={paddingInlineEnd}
          ref={ref}
          scrollbarInsetBlockEnd={scrollbarInsetBlockEnd}
          scrollbarInsetBlockStart={scrollbarInsetBlockStart}
        >
          {children}
        </StyledScrollPortViewport>
      </StyledScrollPortContainer>
    </StyledScrollPortRoot>
  );
}
