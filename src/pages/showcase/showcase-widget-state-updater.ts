/**
 * Файл: `src/pages/showcase/showcase-widget-state-updater.ts`
 * Предоставляет фабрику `createWidgetStateUpdater` для записи одного ключа состояния виджета витрины.
 *
 * Основные задачи:
 * 1. Предоставить функцию `createWidgetStateUpdater`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — записывает поле состояния виджета из панели настроек
 */

import { type Dispatch, type SetStateAction } from 'react';

/**
 * createWidgetStateUpdater — принимает установщик состояния и возвращает запись одного ключа.
 *
 * @param setState установщик состояния виджета витрины
 * @returns функция записи поля состояния
 */
export function createWidgetStateUpdater<State extends object>(
  setState: Dispatch<SetStateAction<State>>
): <Key extends keyof State>(key: Key, value: State[Key]) => void {
  return (key, value) => {
    setState((current) => ({
      ...current,
      [key]: value,
    }));
  };
}
