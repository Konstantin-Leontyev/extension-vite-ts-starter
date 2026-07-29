/**
 * Файл: `src/ui/sizing.ts`
 * Содержит утилиты для работы с размерами.
 * Определяет, какие CSS-свойства размеров доступны в проекте, как они задаются
 * через пропсы компонентов и как эти пропсы преобразуются в CSS-стили.
 *
 * Основные задачи:
 * 1. Типизировать sizing-пропсы через `SizingProps`
 * 2. Связать пропсы с CSS-свойствами через `SIZING_PROPERTIES`
 * 3. Генерировать CSS-правила через `getSizingStyles`
 * 4. Предоставить перечень имён пропсов через `SIZING_PROPERTY_NAMES`
 *
 * Потребители:
 *  - `@ui/layout` — включает sizing-пропсы в `LayoutProps` и вызывает `getSizingStyles`
 *  - корневые `Styled*` компонентов — принимают размеры через layout-пропсы
 */

/**
 * SizingProps — представляет пропсы размеров элемента.
 * Значения — произвольные CSS-значения, например `100%`, `max-content`, `min(360px, 50vh)`.
 * В отличие от `@ui/spacing`, размеры не ограничены фиксированной шкалой.
 * Названия соответствуют логическим CSS-свойствам и зависят от направления письма.
 *
 * @property blockSize — высота
 * @property inlineSize — ширина
 * @property maxBlockSize — максимальная высота
 * @property maxInlineSize — максимальная ширина
 * @property minBlockSize — минимальная высота
 * @property minInlineSize — минимальная ширина
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
 * SIZING_PROPERTIES — связывает имена пропсов с CSS-свойствами.
 * Необходим для динамической генерации CSS-стилей для каждого переданного пропса.
 *
 * Например:
 *  - Пропс `inlineSize` → CSS-свойство `inline-size`
 *  - Пропс `blockSize` → CSS-свойство `block-size`
 *
 * Соответствие приватно для модуля, доступ к именам пропсов — только через `SIZING_PROPERTY_NAMES`.
 */
const SIZING_PROPERTIES = {
  inlineSize: 'inline-size',
  minInlineSize: 'min-inline-size',
  maxInlineSize: 'max-inline-size',
  blockSize: 'block-size',
  minBlockSize: 'min-block-size',
  maxBlockSize: 'max-block-size',
} as const satisfies Record<keyof SizingProps, string>;

/**
 * SIZING_PROPERTY_NAMES — хранит имена всех пропсов из `SIZING_PROPERTIES`.
 * Эти пропсы не импортируются напрямую в компонентах, а входят в состав
 * `LAYOUT_PROP_NAMES` из `@ui/layout` вместе с именами из `@ui/spacing` и `@ui/positioning`.
 *
 * Назначение: sizing-пропсы не являются DOM-атрибутами, поэтому styled-components
 * не должен передавать их на HTML-узел.
 * `shouldForwardProp` в корневом `Styled*` использует `LAYOUT_PROP_NAMES`,
 * а `splitLayoutProps` по этому же набору отделяет layout-пропсы от остальных.
 */
export const SIZING_PROPERTY_NAMES = new Set<string>(Object.keys(SIZING_PROPERTIES));

/**
 * getSizingStyles — преобразует sizing-пропсы в готовые CSS-правила.
 *
 * Как работает:
 * 1. Проходит по всем записям `SIZING_PROPERTIES`, где ключ — имя пропса,
 *    а значение — CSS-свойство
 * 2. Для каждого пропса проверяет, передан ли он в `props`. Переданное значение,
 *    например `100%`, подставляет как есть и формирует CSS-правило вида
 *    `inline-size: 100%;`
 * 3. Собирает такие правила в массив и склеивает через перенос строки
 * 4. Отдаёт результат для подстановки в CSS-шаблон styled-компонента
 *
 * @param props объект с sizing-пропсами, например `{ inlineSize: '100%', blockSize: '100%' }`
 * @returns CSS-правила, каждое с новой строки
 */
export function getSizingStyles(props: SizingProps): string {
  const styles: string[] = [];

  for (const [prop, property] of Object.entries(SIZING_PROPERTIES)) {
    const value = props[prop as keyof SizingProps];

    if (value !== undefined) {
      styles.push(`${property}: ${value};`);
    }
  }

  return styles.join('\n');
}
