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
 *  - подзаголовок через проп `subtitle`
 *  - размер заголовка через проп `titleSizePreset`
 *  - выравнивание заголовка через проп `titleAlign`
 *  - тон заголовка через проп `titleTone`
 *  - размер подзаголовка через проп `subtitleSizePreset`
 *  - выравнивание подзаголовка через проп `subtitleAlign`
 *  - тон подзаголовка через проп `subtitleTone`
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
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают карточки с шапкой и действиями
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  createElement,
  type CSSProperties,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';

import { type IconShapePreset } from '@ui/icon';
import { IconButtonRow, type IconButtonRowAction } from '@ui/icon-button-row';
import { Text, type TextSizePreset, type TextTone } from '@ui/text';

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
 * CardProps — представляет пропсы компонента Card.
 *
 * @template T тип корневого элемента, по умолчанию `div`
 *
 * @property actionShape — форма окна действия шапки. Без пропа остаётся дефолтом ряда
 * @property as — переопределяет корневой HTML-тег, например `<article>`, `<section>`
 * @property children — содержимое тела карточки
 * @property headerActions — ряд действий в правом верхнем углу
 * @property subtitle — подзаголовок под заголовком
 * @property subtitleAlign — выравнивание подзаголовка
 * @property subtitleSizePreset — размер подзаголовка
 * @property subtitleTone — тон подзаголовка
 * @property title — заголовок
 * @property titleAlign — выравнивание заголовка
 * @property titleId — id заголовка для `aria-labelledby`
 * @property titleSizePreset — размер заголовка
 * @property titleTone — тон заголовка
 */
type CardProps<T extends CardHtmlTag = 'div'> = {
  actionShape?: IconShapePreset;
  as?: T;
  children?: ReactNode;
  headerActions?: IconButtonRowAction[];
  subtitle?: string;
  subtitleAlign?: CSSProperties['textAlign'];
  subtitleSizePreset?: TextSizePreset;
  subtitleTone?: TextTone;
  title?: string;
  titleAlign?: CSSProperties['textAlign'];
  titleId?: string;
  titleSizePreset?: TextSizePreset;
  titleTone?: TextTone;
} & Omit<CardStyleProps, 'hasHeader'> &
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
  subtitleSizePreset,
  subtitleTone = DEFAULT_CARD_SUBTITLE_TONE,
  title,
  titleAlign,
  titleId,
  titleSizePreset = DEFAULT_CARD_TITLE_SIZE_PRESET,
  titleTone,
  ...rest
}: CardProps<T>) {
  const hasHeader = Boolean(title || subtitle);

  const subtitleNode = Boolean(subtitle) && (
    <Text
      align={subtitleAlign}
      as="p"
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
            as="h2"
            id={titleId}
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
    { as, hasHeader, ...rest },
    <IconButtonRow
      actions={headerActions}
      insetBlockStart={CARD_PADDING}
      insetInlineEnd={CARD_PADDING}
      position="absolute"
      shape={actionShape}
      sizePreset={CARD_HEADER_ACTION_SIZE_PRESET}
      zIndex={1}
    />,
    header,
    <StyledCardBody>{children}</StyledCardBody>
  );
}

export { CARD_HEADER_ACTION_SIZE_PRESET, Card };
