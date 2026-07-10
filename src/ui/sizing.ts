/**
 * Файл: `src/ui/sizing.ts`
 * Этот файл содержит утилиты для работы с размерами.
 * Он определяет, какие CSS-свойства для размеров доступны в проекте,
 * как они задаются через пропсы компонентов, и как превращать эти
 * пропсы в реальные CSS-стили.
 *
 * Основные задачи:
 * 1. Типизировать sizing-пропы (`SizingProps`)
 * 2. Связать пропсы с CSS-свойствами через `SIZING_PROPERTIES`
 * 3. Генерировать CSS через `getSizingStyles`
 *
 * Потребители: `@ui/layout`, корневые `Styled*` kit-модулей (размеры через layout-пропы).
 */

/**
 * SizingProps — тип пропсов для управления размерами элемента.
 * Значения — произвольные CSS-строки (`100%`, `max-content`, `min(360px, 50vh)`).
 * В отличие от `@ui/spacing`, размеры не ограничены фиксированной шкалой.
 *
 * @property inlineSize — ширина (горизонтальный размер)
 * @property minInlineSize — минимальная ширина
 * @property maxInlineSize — максимальная ширина
 * @property blockSize — высота (вертикальный размер)
 * @property minBlockSize — минимальная высота
 * @property maxBlockSize — максимальная высота
 *
 * Названия соответствуют логическим CSS-свойствам и зависят от направления письма.
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
 * SIZING_PROPERTIES — объект, связывающий имена пропсов с реальными CSS-свойствами.
 * Необходим для динамической генерации CSS-стилей для каждого переданного пропса.
 *
 * Например:
 *  - Пропс `inlineSize` → CSS-свойство `inline-size`
 *  - Пропс `blockSize` → CSS-свойство `block-size`
 *
 * Конструкция `as const satisfies Record<keyof SizingProps, string>` гарантирует,
 * что объект содержит все ключи из `SizingProps` и только их, а `TypeScript`
 * будет проверять соответствие структуры типу.
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
 * SIZING_PROPERTY_NAMES — множество всех имён пропсов из `SIZING_PROPERTIES`.
 * Эти пропсы не импортируются напрямую в компонентах, а входят в состав
 * `LAYOUT_PROP_NAMES` (из `@ui/layout`) вместе с `@ui/spacing` и `@ui/positioning`.
 *
 * Назначение: sizing-пропсы не являются DOM-атрибутами, поэтому `styled-components`
 * не должен передавать их на HTML-узел.
 * `shouldForwardProp` в корневом `Styled*` использует `LAYOUT_PROP_NAMES`,
 * а `splitLayoutProps` по этому же набору отделяет layout-пропсы от остальных.
 *
 * Создаётся из `Object.keys(SIZING_PROPERTIES)`, чтобы при добавлении нового пропса
 * в карту не требовалось обновлять список вручную.
 */
export const SIZING_PROPERTY_NAMES = new Set<string>(Object.keys(SIZING_PROPERTIES));

/**
 * getSizingStyles — превращает объект `SizingProps` в готовую строку CSS-стилей.
 *
 * Как она работает:
 * 1. Проходит по всем записям (ключ-значение) из `SIZING_PROPERTIES`.
 *    Ключ — это имя пропса (например, `inlineSize`), значение — соответствующее CSS-свойство (`inline-size`);
 * 2. Для каждого пропса проверяется, передан ли он в объекте props.
 *    Если значение передано, берёт его (например, `100%`),
 *    и формирует строку вида `inline-size: 100%;`.
 * 3. Все такие строки собираются в массив и склеиваются через перенос строки.
 *
 * Результат — строка, которую можно вставить в атрибут `style` или в CSS-in-JS.
 *
 * @param props — объект с sizing-пропсами, например, `{ inlineSize: '100%', blockSize: '100%' }`
 * @returns строка с CSS-правилами, каждая с новой строки
 */
export function getSizingStyles(props: SizingProps): string {
  const rules: string[] = [];

  for (const [prop, property] of Object.entries(SIZING_PROPERTIES)) {
    const value = props[prop as keyof SizingProps];

    if (value !== undefined) {
      rules.push(`${property}: ${value};`);
    }
  }

  return rules.join('\n');
}
