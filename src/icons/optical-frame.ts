/**
 * Единый оптический кадр глифа в viewBox 24×24.
 * Сложные иконки укладывают штрихи в этот прямоугольник (отступ 4 px со всех сторон).
 * Простые полноразмерные глифы (close, plus, chevron) остаются на 5–19: диагонали и
 * перекладины во весь кадр читаются крупнее, меньший габарит выравнивает их оптически.
 */
export const ICON_OPTICAL_INSET = 4;
export const ICON_OPTICAL_SIZE = 16;
export const ICON_OPTICAL_MAX = ICON_OPTICAL_INSET + ICON_OPTICAL_SIZE;
