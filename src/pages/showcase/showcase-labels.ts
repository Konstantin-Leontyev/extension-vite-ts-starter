/**
 * Файл: `src/pages/showcase/showcase-labels.ts`
 * Содержит хелперы подписей сателлитов-групп витрины дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Основные задачи:
 * 1. Предоставить функции `resolveGroupFieldLabel`, `resolveGroupContentLabel`
 *    и `resolveGroupFlagLabel`
 *
 * Потребители:
 *  - сателлиты-группы витрины — собирают подписи контролов через
 *    `resolveGroupFieldLabel`, `resolveGroupContentLabel` и `resolveGroupFlagLabel`:
 *     - `src/pages/showcase/text-group/index.tsx`
 *     - `src/pages/showcase/icon-group/index.tsx`
 *     - `src/pages/showcase/icon-row-group/index.tsx`
 */

/**
 * resolveGroupFieldLabel — возвращает подпись контрола группы из префикса и имени поля.
 * С префиксом — `Text size:`, `Icon tone:`. Без префикса слово поля
 * начинает подпись с заглавной буквы — `Size:`, `Tone:`.
 *
 * @param labelPrefix префикс подписей контролов
 * @param field имя поля в нижнем регистре, например `size`
 * @returns подпись контрола с двоеточием
 */
export function resolveGroupFieldLabel(
  labelPrefix: string | undefined,
  field: string
): string {
  if (labelPrefix === undefined) {
    return `${field.charAt(0).toUpperCase()}${field.slice(1)}:`;
  }

  return `${labelPrefix} ${field}:`;
}

/**
 * resolveGroupContentLabel — возвращает подпись инпута содержимого из префикса и сущности.
 * С префиксом — `Text:`, `Icon A:`. Без префикса — `{entity}:`.
 *
 * @param labelPrefix префикс подписей контролов
 * @param entity имя сущности с заглавной буквы, например `Text` или `Icon`
 * @returns подпись содержимого с двоеточием
 */
export function resolveGroupContentLabel(
  labelPrefix: string | undefined,
  entity: string
): string {
  if (labelPrefix === undefined) {
    return `${entity}:`;
  }

  return `${labelPrefix}:`;
}

/**
 * resolveGroupFlagLabel — возвращает подпись чекбокса флага из глагола, префикса
 * и сущности.
 * Без префикса — `{verb} {entity}`, например `Show text`, `Disable action`.
 * С префиксом — глагол и префикс с пониженной только первой буквой — `Show legend`,
 * `Disable action 1`, `Set title`.
 *
 * @param labelPrefix префикс подписей контролов
 * @param entity имя сущности с заглавной буквы, например `Text` или `Icon`
 * @param verb глагол флага: показ булева пропа, отметка необязательного содержимого
 *   или отключение
 * @returns подпись чекбокса флага
 */
export function resolveGroupFlagLabel(
  labelPrefix: string | undefined,
  entity: string,
  verb: 'Disable' | 'Set' | 'Show'
): string {
  const noun =
    labelPrefix === undefined
      ? entity.toLowerCase()
      : `${labelPrefix.charAt(0).toLowerCase()}${labelPrefix.slice(1)}`;

  return `${verb} ${noun}`;
}
