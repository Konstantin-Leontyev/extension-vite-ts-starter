/**
 * Файл: `src/components/profile-menu/profile-stub.ts`
 * Содержит заглушку данных профиля до возврата данных из входа через Google.
 *
 * Основные задачи:
 * 1. Предоставить объект `PROFILE_STUB`
 *
 * Потребители:
 *  - `src/components/profile-menu/index.tsx` — читает имя и email для меню профиля
 */

/**
 * PROFILE_STUB — представляет заглушку данных профиля.
 * Содержит отображаемое имя и email.
 * Используется в ProfileMenu до возврата данных из входа через Google.
 */
export const PROFILE_STUB = {
  displayEmail: 'user@example.com',
  displayName: 'User',
} as const;
