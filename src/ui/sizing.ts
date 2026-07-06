/**
 * Файл: sizing.ts
 * Этот файл содержит утилиты для работы с размерами (sizing).
 * Он определяет, какие CSS-свойства для размеров доступны в проекте,
 * как они задаются через пропсы компонентов, и как превращать эти
 * пропсы в реальные CSS-стили.
 */

/**
 * SizingProps — тип, описывающий пропсы для управления размерами элемента.
 * Значения передаются как произвольные CSS-строки (например, '100%',
 * 'max-content', 'min(360px, 50vh)'), потому что размеры не ограничены
 * фиксированной шкалой значений, в отличие от отступов (spacing).
 *
 * Доступные пропсы:
 * - inlineSize, minInlineSize, maxInlineSize — размеры по горизонтали
 * - blockSize, minBlockSize, maxBlockSize — размеры по вертикали
 *
 * Эти названия соответствуют логическим CSS-свойствам и зависят от
 * направления письма (writing-mode).
 */
export type SizingProps = {
  blockSize?: string;
  inlineSize?: string;
  maxBlockSize?: string;
  maxInlineSize?: string;
  minBlockSize?: string;
  minInlineSize?: string;
};

/**
 * SIZING_CSS — объект, который связывает имена пропсов с реальными CSS-свойствами.
 * Необходим для динамической генерации CSS-стилей для каждого переданного пропса.
 *
 * Например:
 *   - Пропс 'inlineSize' → CSS-свойство 'inline-size'
 *   - Пропс 'blockSize' → CSS-свойство 'block-size'
 *
 * Конструкция 'as const satisfies Record<keyof SizingProps, string>' гарантирует,
 * что объект содержит все ключи из SizingProps и только их, а TypeScript
 * будет проверять соответствие структуры типу.
 */
const SIZING_CSS = {
  inlineSize: 'inline-size',
  minInlineSize: 'min-inline-size',
  maxInlineSize: 'max-inline-size',
  blockSize: 'block-size',
  minBlockSize: 'min-block-size',
  maxBlockSize: 'max-block-size',
} as const satisfies Record<keyof SizingProps, string>;


/**
 * SIZING_PROP_NAMES — это множество (Set) всех имён пропсов из SIZING_CSS.
 * Эти пропсы не импортируются напрямую в компонентах, а входят в состав
 * LAYOUT_PROP_NAMES (из @ui/layout) вместе с spacing и positioning.
 *
 * Назначение: sizing-пропсы не являются DOM-атрибутами, поэтому styled-components
 * не должен передавать их на HTML-узел.
 * shouldForwardProp в корневом Styled* использует LAYOUT_PROP_NAMES,
 * а splitLayoutProps по этому же набору отделяет layout-свойства от остальных.
 *
 * Set создаётся из Object.keys(SIZING_CSS), чтобы при добавлении нового пропса
 * в карту не требовалось обновлять список вручную.
 */
export const SIZING_PROP_NAMES = new Set<string>(Object.keys(SIZING_CSS));

/**
 * getSizingStyles — главная функция, которая превращает объект пропсов
 * в готовую строку CSS-стилей.
 *
 * Как она работает:
 * 1. Проходит по всем записям (ключ-значение) из SIZING_CSS.
 *    Ключ — это имя пропса (например, 'inlineSize'), значение — CSS-свойство ('inline-size');
 * 2. Для каждого пропса смотрит, передан ли он в объекте props.
 *    Если передан (не undefined), берёт значение (например '100%'),
 *    и формирует строку вида "inline-size: 100%;".
 * 3. Все такие строки собираем в массив и склеиваем через перенос строки.
 *
 * Результат — строка, которую можно вставить в атрибут style или в CSS-in-JS.
 *
 * @param props — объект с sizing-пропсами например, { inlineSize: '100%', blockSize: '100%' }
 * @returns строка с CSS-правилами, каждая с новой строки
 */
export function getSizingStyles(props: SizingProps): string {
  const rules: string[] = [];

  for (const [prop, property] of Object.entries(SIZING_CSS)) {
    const value = props[prop as keyof SizingProps];

    if (value !== undefined) {
      rules.push(`${property}: ${value};`);
    }
  }

  return rules.join('\n');
}
