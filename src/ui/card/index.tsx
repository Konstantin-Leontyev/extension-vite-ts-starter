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
 *  - переопределение корневого элемента через проп `as`
 *
 * Основные задачи:
 * 1. Экспортировать полиморфный компонент Card
 * 2. Типизировать пропсы через `CardProps`
 * 3. Экспортировать тип `CardHeaderAction`
 * 4. Реэкспортировать публичное API стилей: `CARD_BACKGROUND_KEYS`,
 *    `CARD_HEADER_ACTION_SIZE_PRESET`, `CardBackground`
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают карточки с шапкой и действиями
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  createElement,
  type CSSProperties,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { Icon } from '@ui/icon';
import { type SpacingValue } from '@ui/spacing';
import { Text, type TextSizePreset, type TextTone } from '@ui/text';

import {
  CARD_BACKGROUND_KEYS,
  CARD_HEADER_ACTION_SIZE_PRESET,
  StyledCard,
  StyledCardBody,
  StyledCardHeader,
  StyledCardHeaderActions,
  StyledCardHeaderFirstLine,
  type CardBackground,
  type CardStyleProps,
} from './card.styles';

/**
 * CardHtmlTag — представляет допустимые корневые HTML-теги компонента Card.
 */
type CardHtmlTag = 'article' | 'div' | 'section';

/**
 * CardHeaderAction — представляет кнопку-действие в шапке карточки, например copy,
 * settings и close, со своим обработчиком.
 *
 * @property ariaControls — id управляемой панели для `aria-controls`
 * @property ariaExpanded — состояние раскрытия для `aria-expanded`
 * @property ariaLabel — доступное имя кнопки
 * @property disabled — включает недоступное состояние
 * @property icon — svg-глиф действия
 * @property iconPadding — отступ окна Icon вместо отступа из размерного ряда.
 *   Область клика не меняет, увеличенный отступ зрительно уменьшает глиф,
 *   например close в Modal и ProfileMenu
 * @property onClick — обработчик клика
 */
type CardHeaderAction = {
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  icon: ReactNode;
  iconPadding?: SpacingValue;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

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
const DEFAULT_CARD_HEADER_ACTIONS: CardHeaderAction[] = [];

/**
 * handleHeaderActionClick — останавливает всплытие клика по действию шапки
 * и вызывает обработчик действия, если он задан.
 *
 * @param action действие шапки
 * @param event событие клика по кнопке действия
 */
function handleHeaderActionClick(
  action: CardHeaderAction,
  event: MouseEvent<HTMLButtonElement>
) {
  event.stopPropagation();
  action.onClick?.(event);
}

/**
 * CardProps — представляет пропсы компонента Card.
 *
 * @template T тип корневого элемента, по умолчанию `div`
 *
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
  as?: T;
  children?: ReactNode;
  headerActions?: CardHeaderAction[];
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
  const hasActions = headerActions.length > 0;

  const actionsRow = hasActions && (
    <StyledCardHeaderActions>
      {headerActions.map((action, index) => (
        <Icon
          aria-controls={action.ariaControls}
          aria-expanded={action.ariaExpanded}
          aria-hidden={action.ariaLabel ? undefined : true}
          aria-label={action.ariaLabel}
          as="button"
          disabled={action.disabled}
          key={index}
          padding={action.iconPadding}
          shape="round"
          sizePreset={CARD_HEADER_ACTION_SIZE_PRESET}
          tabIndex={action.ariaLabel ? undefined : -1}
          onClick={(event) => handleHeaderActionClick(action, event)}
        >
          {action.icon}
        </Icon>
      ))}
    </StyledCardHeaderActions>
  );

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
    actionsRow,
    header,
    <StyledCardBody>{children}</StyledCardBody>
  );
}

export {
  CARD_BACKGROUND_KEYS,
  CARD_HEADER_ACTION_SIZE_PRESET,
  Card,
  type CardBackground,
  type CardHeaderAction,
};
