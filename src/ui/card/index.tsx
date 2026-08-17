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
 * 4. Экспортировать типы `CardTitleProps` и `CardSubtitleProps`
 * 5. Предоставить функции `resolveCardTitleProps` и `resolveCardSubtitleProps`
 *
 * Потребители:
 *  - `src/ui/modal/index.tsx` — собирает модальный диалог на Card
 *  - `src/ui/sidebar/index.tsx` — собирает выезжающую панель на Card
 *  - страницы и виджеты приложения, например ProfileMenu — показывают карточки с шапкой и действиями
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  createElement,
  type CSSProperties,
  type ComponentProps,
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
 * CardTitleProps — представляет пропсы заголовка Card.
 * Поля заголовка допустимы только вместе с `title`.
 *
 * @property title — заголовок
 * @property titleAlign — выравнивание заголовка
 * @property titleId — id заголовка для `aria-labelledby`
 * @property titleItalic — включает курсив заголовка
 * @property titleSizePreset — размер заголовка
 * @property titleTone — тон заголовка
 */
type CardTitleProps =
  | {
      title: string;
      titleAlign?: CSSProperties['textAlign'];
      titleId?: string;
      titleItalic?: boolean;
      titleSizePreset?: TextSizePreset;
      titleTone?: TextTone;
    }
  | {
      title?: never;
      titleAlign?: never;
      titleId?: never;
      titleItalic?: never;
      titleSizePreset?: never;
      titleTone?: never;
    };

/**
 * CardSubtitleProps — представляет пропсы подзаголовка Card.
 * Поля подзаголовка допустимы только вместе с `subtitle`.
 *
 * @property subtitle — подзаголовок под заголовком
 * @property subtitleAlign — выравнивание подзаголовка
 * @property subtitleItalic — включает курсив подзаголовка
 * @property subtitleSizePreset — размер подзаголовка
 * @property subtitleTone — тон подзаголовка
 */
type CardSubtitleProps =
  | {
      subtitle: string;
      subtitleAlign?: CSSProperties['textAlign'];
      subtitleItalic?: boolean;
      subtitleSizePreset?: TextSizePreset;
      subtitleTone?: TextTone;
    }
  | {
      subtitle?: never;
      subtitleAlign?: never;
      subtitleItalic?: never;
      subtitleSizePreset?: never;
      subtitleTone?: never;
    };

function resolveCardTitleProps(
  title: string,
  titleAlign?: CSSProperties['textAlign'],
  titleItalic?: boolean,
  titleSizePreset?: TextSizePreset,
  titleTone?: TextTone
): CardTitleProps {
  return title.trim() !== ''
    ? {
        title,
        titleAlign,
        titleItalic,
        titleSizePreset,
        titleTone,
      }
    : {};
}

function resolveCardSubtitleProps(
  subtitle: string,
  subtitleAlign?: CSSProperties['textAlign'],
  subtitleItalic?: boolean,
  subtitleSizePreset?: TextSizePreset,
  subtitleTone?: TextTone
): CardSubtitleProps {
  return subtitle.trim() !== ''
    ? {
        subtitle,
        subtitleAlign,
        subtitleItalic,
        subtitleSizePreset,
        subtitleTone,
      }
    : {};
}

/**
 * CardProps — представляет пропсы компонента Card.
 *
 * @template T тип корневого элемента, по умолчанию `div`
 *
 * @property actionShape — форма окна действия шапки. Без пропа остаётся дефолтом ряда
 * @property as — переопределяет корневой HTML-тег, например `<article>`, `<section>`
 * @property children — содержимое тела карточки
 * @property headerActions — ряд действий в правом верхнем углу
 */
type CardProps<T extends CardHtmlTag = 'div'> = {
  actionShape?: IconShapePreset;
  as?: T;
  children?: ReactNode;
  headerActions?: IconButtonRowAction[];
} & CardTitleProps &
  CardSubtitleProps &
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
  titleId,
  titleItalic,
  titleSizePreset = DEFAULT_CARD_TITLE_SIZE_PRESET,
  titleTone,
  ...rest
}: CardProps<T>) {
  const hasHeader = Boolean(title || subtitle);

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
            as="h2"
            id={titleId}
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
      hasHeader,
      ...(rest as Omit<ComponentProps<typeof StyledCard>, 'as' | 'hasHeader'>),
    },
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

/* eslint-disable react-refresh/only-export-components -- реэкспорт резолверов заголовка и подзаголовка */
export {
  CARD_HEADER_ACTION_SIZE_PRESET,
  Card,
  resolveCardSubtitleProps,
  resolveCardTitleProps,
  type CardSubtitleProps,
  type CardTitleProps,
};
