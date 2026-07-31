/**
 * Файл: `src/ui/segment-button-parts/index.tsx`
 * Предоставляет компонент SegmentButtonParts для отображения сегментного ряда
 * без оболочки: слоты, разделители и кнопки сегментов.
 *
 * Поддерживает:
 *  - размерный ряд через проп `sizePreset`
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
 *
 * Потребители:
 *  - `@ui/segment-button` — собирает SegmentButton поверх ряда
 *  - `@ui/date-range-input` — рендерит сегменты выбора дат без оболочки SegmentButton
 */

import { Fragment, type ReactNode, type RefObject } from 'react';

import { useLongPress } from '@hooks/use-long-press';
import { DEFAULT_ICON_POSITION, Icon, type IconPosition } from '@ui/icon';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { Text, type TextSizePreset, type TextTone } from '@ui/text';
import { DEFAULT_TONE, getToneColorKey, type TonePreset } from '@ui/tones';

import {
  StyledSegmentButtonPartsDivider,
  StyledSegmentButtonPartsPart,
  StyledSegmentButtonPartsRoot,
} from './segment-button-parts.styles';

/**
 * SEGMENT_BUTTON_PARTS_ACTIVE_TEXT_TONE — задаёт тон текста активного сегмента.
 * Активный сегмент без явного `textTone` и без цветного `tone` подсвечивается `primary`.
 * На цветной заливке текст без `textTone` наследует `color: inverse` от сегмента.
 */
const SEGMENT_BUTTON_PARTS_ACTIVE_TEXT_TONE: TextTone = 'primary';

/**
 * SegmentButtonPartsAction — представляет действие одного сегмента ряда.
 *
 * @property active — включает активное состояние сегмента
 * @property ariaControls — id панели, которой управляет сегмент
 * @property ariaExpanded — включает раскрытое состояние связанной панели
 * @property ariaHaspopup — тип всплывающей панели сегмента
 * @property disabled — включает недоступное состояние
 * @property icon — svg иконки сегмента
 * @property iconFill — тон глифа иконки
 * @property iconPosition — позиция иконки относительно текста
 * @property onClick — обработчик клика по сегменту
 * @property onDoubleClick — обработчик двойного клика по сегменту
 * @property onLongPress — обработчик долгого нажатия по сегменту
 * @property ref — ссылка на DOM-узел кнопки сегмента
 * @property text — текст сегмента
 * @property textTone — тон текста сегмента
 * @property title — подсказка нативного `title`
 * @property tone — тон заливки сегмента
 */
type SegmentButtonPartsAction = {
  active?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaHaspopup?: 'dialog' | 'listbox';
  disabled?: boolean;
  icon?: ReactNode;
  iconFill?: TonePreset;
  iconPosition?: IconPosition;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onLongPress?: () => void;
  ref?: RefObject<HTMLButtonElement | null>;
  text: string;
  textTone?: TextTone;
  title?: string;
  tone?: TonePreset;
};

/**
 * SegmentButtonPartsSegments — представляет варианты среднего и правого сегментов.
 * Ряд требует минимум два сегмента: `left` всегда есть, `center` опционален.
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
 * @property sizePreset — размер ряда
 * @property textItalic — включает курсив текста сегмента
 * @property textSize — размер текста сегмента
 */
export type SegmentButtonPartsProps = {
  left: SegmentButtonPartsAction;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
  textItalic?: boolean;
  textSize: TextSizePreset;
} & SegmentButtonPartsSegments;

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
 *    через `align`, чтобы лейбл оставался на всю ширину
 *
 * @param action действие сегмента
 * @param shape форма ряда
 * @param sizePreset размер сегмента
 * @param textItalic включает курсив текста
 * @param textSize размер текста сегмента
 * @returns кнопка сегмента
 */
function SegmentButtonPartsPart({
  action,
  shape,
  sizePreset,
  textItalic,
  textSize,
}: {
  action: SegmentButtonPartsAction;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
  textItalic?: boolean;
  textSize: TextSizePreset;
}) {
  const {
    active,
    ariaControls,
    ariaExpanded,
    ariaHaspopup,
    disabled,
    icon,
    iconFill,
    iconPosition = DEFAULT_ICON_POSITION,
    onClick,
    onDoubleClick,
    onLongPress,
    ref,
    text,
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
    <Icon
      data-slot="icon"
      iconFill={iconFill}
      iconTone={tone}
      interactive
      showHover={false}
      sizePreset={sizePreset}
    >
      {icon}
    </Icon>
  );

  return (
    <StyledSegmentButtonPartsPart
      aria-controls={ariaControls}
      aria-current={active ? 'true' : undefined}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
      disabled={disabled}
      hasIcon={hasIcon}
      ref={ref}
      shape={shape}
      sizePreset={sizePreset}
      title={title}
      tone={tone}
      type="button"
      onClick={onClick || onLongPress ? handleClick : undefined}
      onDoubleClick={onDoubleClick}
      {...(pointerProps ?? {})}
    >
      {iconPosition === 'start' && iconNode}
      <Text
        align={hasIcon ? undefined : 'center'}
        data-slot="label"
        ellipsis
        italic={textItalic}
        minInlineSize="0"
        sizePreset={textSize}
        tone={resolvedTextTone}
      >
        {text}
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
 *   left={{ text: 'From', onClick: openFrom }}
 *   right={{ text: 'To', onClick: openTo }}
 *   textSize="normal"
 * />
 */
export function SegmentButtonParts({
  center,
  left,
  right,
  shape,
  sizePreset,
  textItalic,
  textSize,
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
      sizePreset={sizePreset}
    >
      {segmentSlots.map((slot, index) => (
        <Fragment key={slot.key}>
          {index > 0 && (
            <StyledSegmentButtonPartsDivider
              aria-hidden="true"
              sizePreset={sizePreset}
            />
          )}
          <SegmentButtonPartsPart
            action={slot.action}
            shape={shape}
            sizePreset={sizePreset}
            textItalic={textItalic}
            textSize={textSize}
          />
        </Fragment>
      ))}
    </StyledSegmentButtonPartsRoot>
  );
}
