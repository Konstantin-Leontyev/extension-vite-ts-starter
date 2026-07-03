/**
 * Единый оптический кадр глифа в viewBox 24×24 — по крупнейшим историческим
 * иконкам набора (шестерёнка, контраст): отступ 2 px со всех сторон.
 * Сложные иконки укладывают штрихи в этот прямоугольник. Простые полноразмерные
 * глифы (close, plus, check, chevron) остаются на 5–19: диагонали и перекладины
 * во весь кадр читаются крупнее, меньший габарит выравнивает их оптически.
 */
export const ICON_OPTICAL_INSET = 2;
export const ICON_OPTICAL_SIZE = 20;
export const ICON_OPTICAL_MAX = ICON_OPTICAL_INSET + ICON_OPTICAL_SIZE;
