/**
 * Файл: `src/icons/optical-frame.ts`
 * Задаёт единый оптический кадр глифа в viewBox 24×24.
 *
 * Основные задачи:
 * 1. Предоставить константы `ICON_OPTICAL_INSET`, `ICON_OPTICAL_SIZE` и `ICON_OPTICAL_MAX`
 *
 * Потребители:
 *  - файлы иконок из `src/icons` — ориентируются на кадр при разметке глифа
 */

/**
 * ICON_OPTICAL_INSET — задаёт отступ оптического кадра от края viewBox.
 * Значение выведено по крупнейшим историческим иконкам набора: шестерёнка и контраст.
 */
export const ICON_OPTICAL_INSET = 2;

/**
 * ICON_OPTICAL_SIZE — задаёт сторону оптического кадра внутри viewBox.
 * Сложные иконки укладывают штрихи в этот квадрат. Простые полноразмерные глифы,
 * например add, check, chevron и close, остаются на диапазоне 5–19: диагонали и
 * перекладины во весь кадр читаются крупнее, меньший габарит выравнивает их оптически.
 */
export const ICON_OPTICAL_SIZE = 20;

/**
 * ICON_OPTICAL_MAX — задаёт дальнюю границу оптического кадра в координатах viewBox.
 */
export const ICON_OPTICAL_MAX = ICON_OPTICAL_INSET + ICON_OPTICAL_SIZE;
