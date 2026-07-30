/**
 * Файл: `src/hooks/use-anchored-open.ts`
 * Предоставляет open-state и ссылку на панель для anchored-контролов.
 * Оставляет позиционирование, закрытие и удержание фокуса зоне `@ui/anchored-portal`.
 *
 * Основные задачи:
 * 1. Предоставить хук `useAnchoredOpen`
 *
 * Потребители:
 *  - anchored-контролы — держат open-state и ссылку на панель:
 *     - `src/ui/listbox/index.tsx`
 *     - `src/ui/combobox/index.tsx`
 *     - `src/ui/range-input/index.tsx`
 *     - `src/ui/date-range-input/index.tsx`
 */

import { useRef, useState, type RefObject } from 'react';

/**
 * useAnchoredOpen — возвращает open-state, обработчики и ссылку на панель anchored-контрола.
 * Обработчики `handleOpen`, `handleClose` и `handleToggle` не содержат побочной логики контрола.
 *
 * @template T тип DOM-узла панели, например `HTMLDivElement` или `HTMLUListElement`
 * @returns open-state, обработчики и ссылка на панель
 */
export function useAnchoredOpen<T extends HTMLElement = HTMLElement>(): {
  handleClose: () => void;
  handleOpen: () => void;
  handleToggle: () => void;
  isOpen: boolean;
  panelRef: RefObject<null | T>;
} {
  const panelRef = useRef<null | T>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen(): void {
    setIsOpen(true);
  }

  function handleClose(): void {
    setIsOpen(false);
  }

  function handleToggle(): void {
    setIsOpen((isOpen) => !isOpen);
  }

  return { handleClose, handleOpen, handleToggle, isOpen, panelRef };
}
