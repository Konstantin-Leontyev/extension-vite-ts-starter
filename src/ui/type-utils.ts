/**
 * Файл: `src/ui/type-utils.ts`
 * Содержит утилиты типов для размеченных объединений пропсов.
 *
 * Основные задачи:
 * 1. Типизировать пакет «все ключи вместе либо ни одного» через `AllOrNone`
 * 2. Типизировать вычитание ключей без схлопывания веток через `DistributiveOmit`
 *
 * Потребители:
 *  - `@ui/text` — собирает `TextNodeProps` через `AllOrNone`
 *  - `@ui/modal` и `@ui/sidebar` — вычитают ключи из пропсов Card через `DistributiveOmit`
 */

/**
 * AllOrNone — представляет объект, у которого либо есть все ключи `T`, либо нет ни одного.
 * Ветка без ключей гасит каждый через `?: never`.
 */
export type AllOrNone<T extends object> = { [K in keyof T]?: never } | T;

/**
 * DistributiveOmit — представляет вычитание ключей `K` из каждой ветки объединения `T` отдельно.
 * Обычный `Omit` схлопывает размеченное объединение в одну ветку.
 */
export type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;
