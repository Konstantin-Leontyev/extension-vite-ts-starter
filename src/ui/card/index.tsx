/**
 * Файл: `src/ui/card/index.tsx`
 * Предоставляет компонент Card для отображения поверхности с шапкой и телом.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - заливку через проп `background`
 *  - тело карточки через `children`
 *  - заголовок и подзаголовок через пропы `title` и `subtitle`
 *  - размер, выравнивание и тон заголовка и подзаголовка
 *  - id заголовка для `aria-labelledby` через проп `titleId`
 *  - ряд действий в шапке через проп `headerActions`
 *  - переопределение корневого элемента через проп `as`
 *
 * Основные задачи:
 * 1. Экспортировать полиморфный компонент Card и тип `CardHeaderAction`
 * 2. Типизировать пропсы через `CardProps`
 * 3. Реэкспортировать публичное API стилей: `CARD_BACKGROUND_KEYS`, `CardBackground`
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают карточки с шапкой и действиями
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import {
  createElement,
  type CSSProperties,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from 'react';

import {
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  RoundButton,
  type RoundButtonSizePreset,
} from '@ui/round-button';
import { Text, type TextSizePreset, type TextTone } from '@ui/text';

import {
  CARD_BACKGROUND_KEYS,
  StyledCard,
  StyledCardBody,
  StyledCardHeader,
  StyledCardHeaderActions,
  StyledCardHeaderFirstLine,
  resolveLargestHeaderActionSizePreset,
  type CardBackground,
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
 * DEFAULT_CARD_SUBTITLE_SIZE_PRESET — задаёт размер подзаголовка по умолчанию.
 * Используется, когда вызывающий код не передал проп `subtitleSizePreset`.
 */
const DEFAULT_CARD_SUBTITLE_SIZE_PRESET: TextSizePreset = 'medium';

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
 * CardHeaderAction — представляет кнопку-действие в шапке карточки, например copy,
 * settings и close, со своим обработчиком.
 *
 * @property ariaControls — id управляемой панели для `aria-controls`
 * @property ariaExpanded — состояние раскрытия для `aria-expanded`
 * @property ariaLabel — доступное имя кнопки
 * @property disabled — включает недоступное состояние
 * @property icon — иконка действия
 * @property onClick — обработчик клика
 * @property sizePreset — размер RoundButton
 */
type CardHeaderAction = {
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  icon: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  sizePreset?: RoundButtonSizePreset;
};

/**
 * CardProps — представляет пропсы компонента Card.
 *
 * @template T — тип корневого элемента, по умолчанию `div`
 *
 * @property as — переопределяет корневой HTML-тег, например `<article>`, `<section>`
 * @property children — содержимое тела карточки
 * @property headerActions — ряд действий в правом верхнем углу
 * @property subtitle — подзаголовок под заголовком
 * @property subtitleAlign — выравнивание подзаголовка
 * @property subtitleSizePreset — размер подзаголовка
 * @property subtitleTone — тон подзаголовка
 * @property title — заголовок в `<h2>`
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
  Omit<ComponentPropsWithRef<T>, keyof CardStyleProps | 'className' | 'style' | 'title'>;

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
  subtitleSizePreset = DEFAULT_CARD_SUBTITLE_SIZE_PRESET,
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
  const actionSizePresets = headerActions.map(
    (action) => action.sizePreset ?? DEFAULT_ROUND_BUTTON_SIZE_PRESET
  );
  const actionsSizePreset = resolveLargestHeaderActionSizePreset(actionSizePresets);

  const actionsRow = hasActions && (
    <StyledCardHeaderActions>
      {headerActions.map((action, index) => (
        <RoundButton
          key={index}
          aria-controls={action.ariaControls}
          aria-expanded={action.ariaExpanded}
          aria-hidden={action.ariaLabel ? undefined : true}
          aria-label={action.ariaLabel}
          bordered={false}
          disabled={action.disabled}
          sizePreset={action.sizePreset ?? DEFAULT_ROUND_BUTTON_SIZE_PRESET}
          tabIndex={action.ariaLabel ? undefined : -1}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            action.onClick?.(event);
          }}
        >
          {action.icon}
        </RoundButton>
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
      <StyledCardHeaderFirstLine
        actionsSizePreset={actionsSizePreset}
        hasActions={hasActions}
      >
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

export { CARD_BACKGROUND_KEYS, Card, type CardBackground, type CardHeaderAction };
