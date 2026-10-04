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
 *  - тон заголовка через проп `titleTone`
 *  - размер заголовка через проп `titleSize`
 *  - курсив заголовка через проп `titleItalic`
 *  - выравнивание заголовка через проп `titleAlign`
 *  - уровень заголовка через проп `titleLevel`
 *  - подзаголовок через проп `subtitle`
 *  - тон подзаголовка через проп `subtitleTone`
 *  - размер подзаголовка через проп `subtitleSize`
 *  - курсив подзаголовка через проп `subtitleItalic`
 *  - выравнивание подзаголовка через проп `subtitleAlign`
 *  - id заголовка для `aria-labelledby` через проп `titleId`
 *  - ряд действий в шапке через проп `headerActions`
 *  - рамку действий шапки через проп `showActionBorder`
 *  - тень действий шапки через проп `showActionShadow`
 *  - переопределение корневого элемента через проп `as`
 *
 * Основные задачи:
 * 1. Экспортировать полиморфный компонент Card
 * 2. Типизировать пропсы через `CardProps`
 * 3. Реэкспортировать публичное API стилей: `CARD_HEADER_ACTION_SIZE_PRESET`
 * 4. Связывать имя области с заголовком через `aria-labelledby`, когда у корня есть роль
 *
 * Потребители:
 *  - `src/ui/modal/index.tsx` — рендерит Card внутри модального диалога
 *  - `src/ui/sidebar/index.tsx` — рендерит Card внутри выезжающей панели
 *  - страницы и виджеты приложения, например ProfileMenu — показывают карточки с шапкой и действиями
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  createElement,
  useId,
  type ComponentProps,
  type ComponentPropsWithRef,
} from 'react';

import { resolveBorderProps, type ShowActionBorderProps } from '@ui/border';
import { IconButtonRow, type IconButtonRowAction } from '@ui/icon-button-row';
import { resolvePaddingEdge } from '@ui/spacing';
import {
  Text,
  type TextNodeProps,
  type TextSizePreset,
  type TextTonePreset,
} from '@ui/text';

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
 * DEFAULT_CARD_TITLE_LEVEL — задаёт уровень заголовка по умолчанию.
 * Используется, когда вызывающий код не передал проп `titleLevel`.
 */
const DEFAULT_CARD_TITLE_LEVEL = 'h2' as const;

/**
 * DEFAULT_CARD_TITLE_SIZE_PRESET — задаёт размер заголовка по умолчанию.
 * Используется, когда вызывающий код не передал проп `titleSize`.
 */
const DEFAULT_CARD_TITLE_SIZE_PRESET: TextSizePreset = 'bold';

/**
 * DEFAULT_CARD_SUBTITLE_TONE — задаёт тон подзаголовка по умолчанию.
 * Подзаголовок — вторичный текст, поэтому `muted`.
 */
const DEFAULT_CARD_SUBTITLE_TONE: TextTonePreset = 'muted';

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
 * @property as — переопределяет корневой HTML-тег, например `<article>`, `<div>`, `<section>`
 * @property headerActions — ряд действий в правом верхнем углу
 * @property titleId — id заголовка для `aria-labelledby` у внешнего узла
 */
type CardProps<T extends CardHtmlTag = 'div'> = {
  as?: T;
  headerActions?: IconButtonRowAction[];
  titleId?: string;
} & ShowActionBorderProps &
  TextNodeProps<'title'> &
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
  as,
  children,
  headerActions = DEFAULT_CARD_HEADER_ACTIONS,
  showActionBorder,
  showActionShadow,
  subtitle,
  subtitleAlign,
  subtitleItalic,
  subtitleSize,
  subtitleTone = DEFAULT_CARD_SUBTITLE_TONE,
  title,
  titleAlign,
  titleId,
  titleItalic,
  titleLevel = DEFAULT_CARD_TITLE_LEVEL,
  titleSize = DEFAULT_CARD_TITLE_SIZE_PRESET,
  titleTone,
  ...rest
}: CardProps<T>) {
  const fallbackTitleId = useId();
  const hasHeader = Boolean(title || subtitle);
  const headingId = titleId ?? fallbackTitleId;
  const hasRootRole = as === 'article' || as === 'section';
  const labelledBy = title && hasRootRole ? headingId : undefined;
  const actionBorderProps = resolveBorderProps(
    showActionBorder ?? false,
    undefined,
    showActionShadow
  );

  // Подзаголовок остаётся абзацем и уровня не получает: он поясняет карточку
  // целиком, а не открывает часть содержимого. Попав в оглавление, обещал бы
  // раздел, которого нет.
  const subtitleNode = Boolean(subtitle) && (
    <Text
      align={subtitleAlign}
      as="p"
      italic={subtitleItalic}
      size={subtitleSize}
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
            as={titleLevel}
            id={headingId}
            italic={titleItalic}
            size={titleSize}
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
      insetBlockStart={resolvePaddingEdge(rest, 'blockStart', CARD_PADDING)}
      insetInlineEnd={resolvePaddingEdge(rest, 'inlineEnd', CARD_PADDING)}
      position="absolute"
      size={CARD_HEADER_ACTION_SIZE_PRESET}
      {...actionBorderProps}
      zIndex={1}
    />,
    Boolean(children) && <StyledCardBody>{children}</StyledCardBody>
  );
}

export { CARD_HEADER_ACTION_SIZE_PRESET, Card };
