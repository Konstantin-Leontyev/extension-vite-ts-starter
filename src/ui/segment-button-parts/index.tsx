/**
 * Файл: `src/ui/segment-button-parts/index.tsx`
 * Предоставляет компонент SegmentButtonParts для отображения сегментного ряда
 * без оболочки: слоты, разделители и кнопки сегментов.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму ряда через проп `shape`
 *  - левый сегмент через проп `left`
 *  - средний сегмент через проп `center`. Без `center` ряд из двух сегментов
 *  - правый сегмент через проп `right`
 *  - тон заливки сегмента через поле `tone` действия. Публичного `iconTone`
 *    у сегмента нет
 *  - размер текста сегмента через проп `textSize`
 *  - курсив текста сегмента через проп `textItalic`
 *
 * Основные задачи:
 * 1. Экспортировать компонент SegmentButtonParts
 * 2. Типизировать пропсы через `SegmentButtonPartsProps`
 * 3. Реэкспортировать `SegmentButtonPartsDivider` и `SEGMENT_BUTTON_PARTS_FLUSH_SHAPE`
 * 4. Экспортировать тип `SegmentButtonPartsActionIconProps`
 *
 * Потребители:
 *  - `@ui/segment-button` — собирает SegmentButton поверх ряда
 *  - `@ui/date-range-input` — рендерит сегменты выбора дат без оболочки SegmentButton
 *    и ставит разделитель перед кнопкой сброса в ряду-триггере
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { Fragment, type KeyboardEvent, type ReactNode, type RefObject } from 'react';

import { useLongPress } from '@hooks/use-long-press';
import { DEFAULT_ICON_POSITION, Icon, type IconPosition } from '@ui/icon';
import { type SizePreset } from '@ui/presets';
import { Text, type TextSizePreset, type TextTonePreset } from '@ui/text';
import { DEFAULT_TONE, getToneColorKey, type TonePreset } from '@ui/tones';

import {
  StyledSegmentButtonPartsDivider,
  StyledSegmentButtonPartsPart,
  StyledSegmentButtonPartsRoot,
  type SegmentButtonPartsShape,
  type SegmentButtonPartsStyleProps,
} from './segment-button-parts.styles';

/**
 * SEGMENT_BUTTON_PARTS_ACTIVE_TEXT_TONE — задаёт тон текста активного сегмента.
 * Активный сегмент без явного `textTone` и без цветного `tone` подсвечивается `primary`.
 * На цветной заливке текст без `textTone` наследует `color: inverse` от сегмента.
 */
const SEGMENT_BUTTON_PARTS_ACTIVE_TEXT_TONE: TextTonePreset = 'primary';

/**
 * SegmentButtonPartsActionIconProps — представляет пропсы иконки действия сегмента.
 * Поля иконки допустимы только вместе с `icon`.
 *
 * @property icon — svg иконки сегмента
 * @property iconFill — тон глифа иконки
 * @property iconPosition — позиция иконки относительно текста
 */
export type SegmentButtonPartsActionIconProps =
  | {
      icon: ReactNode;
      iconFill?: TonePreset;
      iconPosition?: IconPosition;
    }
  | {
      icon?: never;
      iconFill?: never;
      iconPosition?: never;
    };

/**
 * SegmentButtonPartsAction — представляет действие одного сегмента ряда.
 *
 * @property active — включает активное состояние сегмента
 * @property ariaControls — id панели, которой управляет сегмент
 * @property ariaExpanded — включает раскрытое состояние связанной панели
 * @property ariaHaspopup — тип всплывающей панели сегмента
 * @property dataAction — значение `data-action` на кнопке сегмента
 * @property disabled — включает недоступное состояние
 * @property label — текст сегмента
 * @property onClick — обработчик клика по сегменту
 * @property onDoubleClick — обработчик двойного клика по сегменту
 * @property onFocus — обработчик фокуса на сегменте
 * @property onKeyDown — обработчик нажатия клавиши на сегменте
 * @property onLongPress — обработчик долгого нажатия по сегменту
 * @property ref — ссылка на DOM-узел кнопки сегмента
 * @property tabIndex — индекс табуляции кнопки сегмента
 * @property textTone — тон текста сегмента
 * @property title — подсказка нативного `title`
 * @property tone — тон заливки сегмента
 */
type SegmentButtonPartsAction = {
  active?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaHaspopup?: 'dialog' | 'listbox';
  dataAction?: string;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onLongPress?: () => void;
  ref?: RefObject<HTMLButtonElement | null>;
  tabIndex?: number;
  textTone?: TextTonePreset;
  title?: string;
  tone?: TonePreset;
} & SegmentButtonPartsActionIconProps;

/**
 * SegmentButtonPartsSegments — представляет варианты среднего и правого сегментов.
 * Ряд требует минимум два сегмента: `left` всегда есть, `center` опционален.
 *
 * @property center — средний сегмент ряда
 * @property right — правый сегмент ряда
 */
type SegmentButtonPartsSegments =
  | { center: SegmentButtonPartsAction; right: SegmentButtonPartsAction }
  | { center: SegmentButtonPartsAction; right?: undefined }
  | { center?: undefined; right: SegmentButtonPartsAction };

/**
 * SegmentButtonPartsProps — представляет пропсы компонента SegmentButtonParts.
 *
 * @property left — левый сегмент ряда
 * @property shape — форма ряда для скругления крайних сегментов
 * @property textItalic — включает курсив текста сегмента
 * @property textSize — размер текста сегмента
 */
export type SegmentButtonPartsProps = {
  left: SegmentButtonPartsAction;
  shape?: SegmentButtonPartsShape;
  textItalic?: boolean;
  textSize: TextSizePreset;
} & SegmentButtonPartsSegments &
  Omit<SegmentButtonPartsStyleProps, 'left' | 'right'>;

/**
 * SegmentButtonPartsPart — возвращает кнопку одного сегмента.
 *
 * Как работает:
 * 1. Берёт действие сегмента и подставляет дефолт `iconPosition`
 * 2. Подключает `useLongPress`: указательные события и подавление клика после
 *    долгого нажатия
 * 3. Через `getToneColorKey` проверяет, есть ли у `tone` цвет в теме: явный
 *    `textTone`, иначе наследование на цветном `tone`, иначе `primary` у
 *    активного сегмента
 * 4. Собирает иконку в `Icon` и текст в `Text`. Без иконки центрирует строку
 *    через `align`, чтобы текст сегмента оставался на всю ширину
 *
 * @param action действие сегмента
 * @param shape форма ряда
 * @param size размер сегмента
 * @param textItalic включает курсив текста
 * @param textSize размер текста сегмента
 * @returns кнопка сегмента
 */
function SegmentButtonPartsPart({
  action,
  shape,
  size,
  textItalic,
  textSize,
}: {
  action: SegmentButtonPartsAction;
  shape?: SegmentButtonPartsShape;
  size?: SizePreset;
  textItalic?: boolean;
  textSize: TextSizePreset;
}) {
  const {
    active,
    ariaControls,
    ariaExpanded,
    ariaHaspopup,
    dataAction,
    disabled,
    icon,
    iconFill,
    iconPosition = DEFAULT_ICON_POSITION,
    label,
    onClick,
    onDoubleClick,
    onFocus,
    onKeyDown,
    onLongPress,
    ref,
    tabIndex,
    textTone,
    title,
    tone,
  } = action;

  const { pointerProps, suppressNextClick } = useLongPress({ disabled, onLongPress });

  function handleClick(): void {
    if (suppressNextClick()) {
      return;
    }

    onClick?.();
  }

  const isColoredTone = getToneColorKey(tone ?? DEFAULT_TONE) != null;
  const resolvedTextTone =
    textTone ??
    (isColoredTone
      ? undefined
      : active
        ? SEGMENT_BUTTON_PARTS_ACTIVE_TEXT_TONE
        : undefined);

  const hasIcon = Boolean(icon);
  const iconNode = hasIcon && (
    <Icon iconFill={iconFill} iconTone={tone} interactive showHover={false} size={size}>
      {icon}
    </Icon>
  );

  return (
    <StyledSegmentButtonPartsPart
      active={active}
      aria-controls={ariaControls}
      aria-current={active ? 'true' : undefined}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      data-action={dataAction}
      disabled={disabled}
      hasIcon={hasIcon}
      ref={ref}
      shape={shape}
      size={size}
      tabIndex={tabIndex}
      title={title}
      tone={tone}
      type="button"
      onClick={onClick || onLongPress ? handleClick : undefined}
      onDoubleClick={onDoubleClick}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      {...(pointerProps ?? {})}
    >
      {iconPosition === 'start' && iconNode}
      <Text
        align={hasIcon ? undefined : 'center'}
        ellipsis
        italic={textItalic}
        size={textSize}
        tone={resolvedTextTone}
      >
        {label}
      </Text>
      {iconPosition === 'end' && iconNode}
    </StyledSegmentButtonPartsPart>
  );
}

/**
 * SegmentButtonParts — отображает сегментный ряд без оболочки.
 *
 * @example
 * <SegmentButtonParts
 *   left={{ label: 'From', onClick: openFrom }}
 *   right={{ label: 'To', onClick: openTo }}
 *   textSize="normal"
 * />
 */
export function SegmentButtonParts({
  center,
  left,
  right,
  shape,
  size,
  textItalic,
  textSize,
  ...rest
}: SegmentButtonPartsProps) {
  const segmentSlots: Array<{ action: SegmentButtonPartsAction; key: string }> = [
    { action: left, key: 'left' },
    ...(center != null ? [{ action: center, key: 'center' }] : []),
    ...(right != null ? [{ action: right, key: 'right' }] : []),
  ];

  if (segmentSlots.length < 2) {
    throw new Error(
      'SegmentButtonParts requires at least two segments. Use a button for a single action.'
    );
  }

  return (
    <StyledSegmentButtonPartsRoot
      data-segments={segmentSlots.length}
      size={size}
      {...rest}
    >
      {segmentSlots.map((slot, index) => (
        <Fragment key={slot.key}>
          {index > 0 && (
            <StyledSegmentButtonPartsDivider aria-hidden="true" size={size} />
          )}
          <SegmentButtonPartsPart
            action={slot.action}
            shape={shape}
            size={size}
            textItalic={textItalic}
            textSize={textSize}
          />
        </Fragment>
      ))}
    </StyledSegmentButtonPartsRoot>
  );
}

export {
  SEGMENT_BUTTON_PARTS_FLUSH_SHAPE,
  StyledSegmentButtonPartsDivider as SegmentButtonPartsDivider,
} from './segment-button-parts.styles';
