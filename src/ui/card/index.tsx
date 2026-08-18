/**
 * Файл: `src/ui/card/index.tsx`
 * Предоставляет компонент Card для отображения поверхности с шапкой и телом.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - заливку через проп `background`
 *  - рамку через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - тело карточки через `children`
 *  - заголовок через проп `title`
 *  - уровень заголовка через проп `titleAs`
 *  - подзаголовок через проп `subtitle`
 *  - тон заголовка через проп `titleTone`
 *  - размер заголовка через проп `titleSizePreset`
 *  - курсив заголовка через проп `titleItalic`
 *  - выравнивание заголовка через проп `titleAlign`
 *  - тон подзаголовка через проп `subtitleTone`
 *  - размер подзаголовка через проп `subtitleSizePreset`
 *  - курсив подзаголовка через проп `subtitleItalic`
 *  - выравнивание подзаголовка через проп `subtitleAlign`
 *  - id заголовка для `aria-labelledby` через проп `titleId`
 *  - ряд действий в шапке через проп `headerActions`
 *  - форму окна действия шапки через проп `actionShape`. Без `actionShape`
 *    форма остаётся дефолтом ряда
 *  - переопределение корневого элемента через проп `as`
 *
 * Основные задачи:
 * 1. Экспортировать полиморфный компонент Card
 * 2. Типизировать пропсы через `CardProps`
 * 3. Реэкспортировать публичное API стилей: `CARD_HEADER_ACTION_SIZE_PRESET`
 * 4. Экспортировать тип `CardTitleProps` — `TextNodeProps` заголовка с `titleAs` и `titleId`
 * 5. Связывать имя области с заголовком через `aria-labelledby`, когда у корня есть роль
 *
 * Потребители:
 *  - `src/ui/modal/index.tsx` — собирает модальный диалог на Card
 *  - `src/ui/sidebar/index.tsx` — собирает выезжающую панель на Card
 *  - страницы и виджеты приложения, например ProfileMenu — показывают карточки с шапкой и действиями
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  createElement,
  useId,
  type ComponentProps,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';

import { type IconShapePreset } from '@ui/icon';
import { IconButtonRow, type IconButtonRowAction } from '@ui/icon-button-row';
import { Text, type TextNodeProps, type TextSizePreset, type TextTone } from '@ui/text';

import {
  CARD_HEADER_ACTION_SIZE_PRESET,
  CARD_PADDING,
  StyledCard,
  StyledCardBody,
  StyledCardHeader,
  StyledCardHeaderFirstLine,
  type CardStyleProps,
} from './card.styles';

/**
 * CardHtmlTag — представляет допустимые корневые HTML-теги компонента Card.
 */
type CardHtmlTag = 'article' | 'div' | 'section';

/**
 * DEFAULT_CARD_TITLE_AS — задаёт уровень заголовка по умолчанию.
 * Используется, когда вызывающий код не передал проп `titleAs`.
 */
const DEFAULT_CARD_TITLE_AS = 'h2';

/**
 * DEFAULT_CARD_TITLE_SIZE_PRESET — задаёт размер заголовка по умолчанию.
 * Используется, когда вызывающий код не передал проп `titleSizePreset`.
 */
const DEFAULT_CARD_TITLE_SIZE_PRESET: TextSizePreset = 'bold';

/**
 * DEFAULT_CARD_SUBTITLE_TONE — задаёт тон подзаголовка по умолчанию.
 * Подзаголовок — вторичный текст, поэтому `muted`.
 */
const DEFAULT_CARD_SUBTITLE_TONE: TextTone = 'muted';

/**
 * DEFAULT_CARD_HEADER_ACTIONS — задаёт пустой ряд действий по умолчанию.
 * Используется, когда вызывающий код не передал проп `headerActions`.
 */
const DEFAULT_CARD_HEADER_ACTIONS: IconButtonRowAction[] = [];

/**
 * ROLELESS_CARD_HTML_TAG — задаёт единственный корневой тег без роли области.
 * Остальные теги роль несут: `aria-labelledby` на корне имеет смысл только с ней.
 * Дефолтный корень тега не получает вовсе, поэтому отсутствие `as` проверяется
 * отдельно: сравнение с этой константой такой корень не отсеивает.
 */
const ROLELESS_CARD_HTML_TAG: CardHtmlTag = 'div';

/**
 * CardTitleProps — представляет пропсы заголовка Card.
 * Пакет `TextNodeProps` с дополнительным `titleAs`.
 *
 * @property title — заголовок
 * @property titleAlign — выравнивание заголовка
 * @property titleItalic — включает курсив заголовка
 * @property titleSizePreset — размер заголовка
 * @property titleTone — тон заголовка
 * @property titleAs — уровень заголовка
 */
type CardTitleProps = TextNodeProps<
  'title',
  {
    titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  }
>;

/**
 * CardProps — представляет пропсы компонента Card.
 *
 * @template T тип корневого элемента, по умолчанию `div`
 *
 * @property actionShape — форма окна действия шапки. Без пропа остаётся дефолтом ряда
 * @property as — переопределяет корневой HTML-тег, например `<article>`, `<div>`, `<section>`
 * @property children — содержимое тела карточки
 * @property headerActions — ряд действий в правом верхнем углу
 * @property titleId — id заголовка для `aria-labelledby` у внешнего узла
 */
type CardProps<T extends CardHtmlTag = 'div'> = {
  actionShape?: IconShapePreset;
  as?: T;
  children?: ReactNode;
  headerActions?: IconButtonRowAction[];
  titleId?: string;
} & CardTitleProps &
  TextNodeProps<'subtitle'> &
  Omit<CardStyleProps, 'hasHeader'> &
  Omit<ComponentPropsWithRef<T>, 'className' | 'style' | 'title' | keyof CardStyleProps>;

/**
 * Card — отображает поверхность с опциональной шапкой, рядом действий и телом.
 *
 * @example
 * <Card title="Settings" subtitle="Profile preferences">
 *   Content
 * </Card>
 */
function Card<T extends CardHtmlTag = 'div'>({
  actionShape,
  as,
  children,
  headerActions = DEFAULT_CARD_HEADER_ACTIONS,
  subtitle,
  subtitleAlign,
  subtitleItalic,
  subtitleSizePreset,
  subtitleTone = DEFAULT_CARD_SUBTITLE_TONE,
  title,
  titleAlign,
  titleAs = DEFAULT_CARD_TITLE_AS,
  titleId,
  titleItalic,
  titleSizePreset = DEFAULT_CARD_TITLE_SIZE_PRESET,
  titleTone,
  ...rest
}: CardProps<T>) {
  const fallbackTitleId = useId();
  const hasHeader = Boolean(title || subtitle);
  const headingId = titleId ?? fallbackTitleId;
  const hasRootRole = as !== undefined && as !== ROLELESS_CARD_HTML_TAG;
  const labelledBy = title && hasRootRole ? headingId : undefined;

  // Подзаголовок остаётся абзацем и уровня не получает: он поясняет карточку
  // целиком, а не открывает часть содержимого. Попав в оглавление, обещал бы
  // раздел, которого нет.
  const subtitleNode = Boolean(subtitle) && (
    <Text
      align={subtitleAlign}
      as="p"
      italic={subtitleItalic}
      sizePreset={subtitleSizePreset}
      tone={subtitleTone}
    >
      {subtitle}
    </Text>
  );

  const header = hasHeader && (
    <StyledCardHeader>
      <StyledCardHeaderFirstLine>
        {Boolean(title) && (
          <Text
            align={titleAlign}
            as={titleAs}
            id={headingId}
            italic={titleItalic}
            sizePreset={titleSizePreset}
            tone={titleTone}
          >
            {title}
          </Text>
        )}
        {!title && subtitleNode}
      </StyledCardHeaderFirstLine>
      {Boolean(title) && subtitleNode}
    </StyledCardHeader>
  );

  return createElement(
    StyledCard,
    {
      as,
      'aria-labelledby': labelledBy,
      hasHeader,
      ...(rest as Omit<ComponentProps<typeof StyledCard>, 'as' | 'hasHeader'>),
    },
    header,
    <IconButtonRow
      actions={headerActions}
      insetBlockStart={CARD_PADDING}
      insetInlineEnd={CARD_PADDING}
      position="absolute"
      shape={actionShape}
      sizePreset={CARD_HEADER_ACTION_SIZE_PRESET}
      zIndex={1}
    />,
    Boolean(children) && <StyledCardBody>{children}</StyledCardBody>
  );
}

export { CARD_HEADER_ACTION_SIZE_PRESET, Card, type CardTitleProps };
