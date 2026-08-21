/**
 * Файл: `src/ui/icon-button-row/index.tsx`
 * Предоставляет компонент IconButtonRow для отображения ряда иконочных кнопок-действий.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`
 *  - рамку действий через проп `showBorder`
 *  - тень действий через проп `showShadow`
 *  - ряд действий через проп `actions`. Элемент — иконочное действие или слот
 *    `control`. Пустой ряд не рендерит компонент. Слот получает размер, форму,
 *    рамку и тень ряда через пропы `size`, `shape`, `showBorder` и `showShadow`
 *  - roving focus через проп `rovingFocus`
 *
 * Основные задачи:
 * 1. Экспортировать компонент IconButtonRow
 * 2. Типизировать пропсы через `IconButtonRowProps`
 * 3. Экспортировать тип `IconButtonRowAction`
 * 4. При включённом `rovingFocus` вести одну Tab-остановку и перемещать фокус
 *    между действиями стрелками, Home и End. Пока панель списка в слоте
 *    `control` открыта, стрелки остаются у списка. Цель фокуса слота — первая
 *    кнопка внутри: слот рассчитан на вид `icon` с одной кнопкой-триггером.
 *    Тип ряда не ограничивает число слотов и их место; превью ставит один слот
 *    первым
 *
 * Потребители:
 *  - `@ui/card` — рендерит ряд действий шапки
 *  - `@ui/sidebar` — типизирует действия шапки через `IconButtonRowAction`
 *  - `@ui/toolbar` — рендерит ряд действий панели инструментов
 *  - `src/pages/showcase/icon-row-group/icon-row-group.ts` — собирает действия
 *    превью через `IconButtonRowAction`
 *  - `src/pages/showcase/index.tsx` — собирает ряд Toolbar со слотом LocalePicker
 */

import {
  Fragment,
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { resolveBorderProps, type ShowBorderProps } from '@ui/border';
import { Icon, type IconShapePreset, type IconSizePreset } from '@ui/icon';
import { type ShapePreset } from '@ui/presets';
import { type SpacingValue } from '@ui/spacing';
import { type DistributiveOmit } from '@ui/type-utils';

import {
  StyledIconButtonRow,
  StyledIconButtonRowSlot,
  StyledIconButtonRowSlotReserve,
  type IconButtonRowStyleProps,
} from './icon-button-row.styles';

/**
 * IconButtonRowAction — представляет одно действие ряда иконочных кнопок.
 *
 * @property active — включает зафиксированное нажатое состояние
 * @property ariaControls — id элемента, которым управляет кнопка
 * @property ariaExpanded — раскрытое состояние управляемого элемента
 * @property ariaLabel — доступное имя кнопки. Без имени кнопка скрыта от вспомогательных технологий
 * @property control — слот контрола вместо иконочного действия
 * @property disabled — включает недоступное состояние
 * @property icon — svg-глиф действия
 * @property iconPadding — отступ окна Icon
 * @property onClick — обработчик клика по действию
 * @property title — текст нативного tooltip. Из `ariaLabel` не выводится
 */
type IconButtonRowAction =
  | {
      active?: boolean;
      ariaControls?: string;
      ariaExpanded?: boolean;
      ariaLabel?: string;
      control?: never;
      disabled?: boolean;
      icon: ReactNode;
      iconPadding?: SpacingValue;
      onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
      title?: string;
    }
  | {
      active?: never;
      ariaControls?: never;
      ariaExpanded?: never;
      ariaLabel?: never;
      control: ReactNode;
      disabled?: never;
      icon?: never;
      iconPadding?: never;
      onClick?: never;
      title?: never;
    };

/**
 * DEFAULT_ICON_BUTTON_ROW_SHAPE — задаёт форму окна действия по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape`.
 */
const DEFAULT_ICON_BUTTON_ROW_SHAPE: IconShapePreset = 'round';

/**
 * DEFAULT_ICON_BUTTON_ROW_ROVING_FOCUS — задаёт режим `rovingFocus` по умолчанию.
 * Используется, когда вызывающий код не передал проп `rovingFocus`.
 */
const DEFAULT_ICON_BUTTON_ROW_ROVING_FOCUS = false;

/**
 * DEFAULT_ICON_BUTTON_ROW_SHOW_BORDER — задаёт режим рамки действий по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 */
const DEFAULT_ICON_BUTTON_ROW_SHOW_BORDER = false;

/**
 * IconButtonRowProps — представляет пропсы компонента IconButtonRow.
 *
 * @property actions — ряд действий. Элемент — иконочная кнопка или слот `control`
 * @property rovingFocus — включает roving focus
 * @property shape — форма окна действия
 * @property size — размер окна действия
 */
type IconButtonRowProps = {
  actions: IconButtonRowAction[];
  rovingFocus?: boolean;
  shape?: IconShapePreset;
  size?: IconSizePreset;
} & DistributiveOmit<ShowBorderProps, 'borderTone'> &
  IconButtonRowStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'style' | keyof IconButtonRowStyleProps
  >;

/**
 * handleActionClick — останавливает всплытие клика и вызывает обработчик действия.
 * Для слота `control` выходит без обработки.
 *
 * @param action действие ряда
 * @param event событие клика по кнопке
 */
function handleActionClick(
  action: IconButtonRowAction,
  event: MouseEvent<HTMLButtonElement>
) {
  if (isControlAction(action)) {
    return;
  }

  event.stopPropagation();
  action.onClick?.(event);
}

/**
 * isControlAction — возвращает признак слота `control` вместо иконочного действия.
 *
 * @param action действие ряда
 * @returns `true`, когда в действии есть слот `control`
 */
function isControlAction(action: IconButtonRowAction): action is { control: ReactNode } {
  return 'control' in action;
}

/**
 * isActionNavigable — возвращает признак участия действия в обходе roving focus.
 *
 * @param action действие ряда или `undefined` при индексе вне ряда
 * @returns `true` у слота `control` и у действия без `disabled` и с доступным именем
 */
function isActionNavigable(action?: IconButtonRowAction): boolean {
  if (!action) {
    return false;
  }

  if (isControlAction(action)) {
    return true;
  }

  return Boolean(!action.disabled && action.ariaLabel);
}

/**
 * resolveControlShape — принимает форму окна действия и возвращает форму контрола в слоте.
 * `round` даёт `pill`, иначе `rounded`. Обратный мост к `resolveIconShape`: слот
 * получает ту же форму, что хозяин ряда отдал действиям.
 *
 * @param shape форма окна действия
 * @returns форма контрола в слоте `control`
 */
function resolveControlShape(shape: IconShapePreset): ShapePreset {
  return shape === 'round' ? 'pill' : 'rounded';
}

/**
 * resolveActionFocusTarget — возвращает узел фокуса действия.
 * В слоте `control` берёт первую кнопку: это триггер вида `icon`. Кнопка сброса
 * вида `field` в слот не кладётся.
 *
 * @param action действие ряда или `undefined`
 * @param host узел кнопки действия или обёртки слота
 * @returns кнопка внутри слота `control` или сам узел иконочного действия
 */
function resolveActionFocusTarget(
  action: IconButtonRowAction | undefined,
  host: HTMLElement | null
): HTMLElement | null {
  if (!action || !host) {
    return null;
  }

  if (isControlAction(action)) {
    return host.querySelector('button');
  }

  return host;
}

/**
 * resolveRovingNextIndex — возвращает индекс следующего действия обхода по клавише.
 *
 * @param event событие клавиатуры
 * @param actions ряд действий
 * @param index текущий индекс
 * @returns индекс цели или `undefined`, если клавиша не из обхода
 */
function resolveRovingNextIndex(
  event: KeyboardEvent<HTMLElement>,
  actions: IconButtonRowAction[],
  index: number
): number | undefined {
  const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl';
  const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
  const previousKey = isRtl ? 'ArrowRight' : 'ArrowLeft';

  switch (event.key) {
    case 'ArrowUp':
    case previousKey: {
      return resolveNavigableNeighborIndex(actions, index, -1);
    }
    case 'ArrowDown':
    case nextKey: {
      return resolveNavigableNeighborIndex(actions, index, 1);
    }
    case 'End': {
      return resolveNavigableEdgeIndex(actions, 'end');
    }
    case 'Home': {
      return resolveNavigableEdgeIndex(actions, 'start');
    }
    default: {
      return undefined;
    }
  }
}

/**
 * resolveFirstNavigableIndex — возвращает индекс первого действия из обхода.
 *
 * @param actions ряд действий
 * @returns индекс первого действия из обхода, иначе `-1`
 */
function resolveFirstNavigableIndex(actions: IconButtonRowAction[]): number {
  return actions.findIndex(isActionNavigable);
}

/**
 * resolveNavigableNeighborIndex — возвращает индекс ближайшего соседа из обхода по кругу.
 *
 * @param actions ряд действий
 * @param fromIndex текущий индекс
 * @param direction направление обхода: `-1` к предыдущему, `1` к следующему
 * @returns индекс соседа из обхода или `fromIndex`, если таких нет
 */
function resolveNavigableNeighborIndex(
  actions: IconButtonRowAction[],
  fromIndex: number,
  direction: -1 | 1
): number {
  const { length } = actions;
  let index = fromIndex;

  for (let step = 0; step < length; step += 1) {
    index = (index + direction + length) % length;

    if (isActionNavigable(actions[index])) {
      return index;
    }
  }

  return fromIndex;
}

/**
 * resolveNavigableEdgeIndex — возвращает индекс крайнего действия из обхода.
 *
 * @param actions ряд действий
 * @param edge край ряда: `start` или `end`
 * @returns индекс первого или последнего действия из обхода, иначе `-1`
 */
function resolveNavigableEdgeIndex(
  actions: IconButtonRowAction[],
  edge: 'end' | 'start'
): number {
  if (edge === 'start') {
    return resolveFirstNavigableIndex(actions);
  }

  for (let index = actions.length - 1; index >= 0; index -= 1) {
    if (isActionNavigable(actions[index])) {
      return index;
    }
  }

  return -1;
}

/**
 * resolveActionTabIndex — возвращает `tabIndex` кнопки действия.
 *
 * @param rovingFocus включён ли roving focus
 * @param isCurrent является ли действие текущим в roving
 * @param hasAriaLabel есть ли у действия доступное имя
 * @returns при roving focus — `0` у текущего действия с именем и `-1` у остальных,
 *   иначе `-1` без имени и `undefined` с именем
 */
function resolveActionTabIndex(
  rovingFocus: boolean,
  isCurrent: boolean,
  hasAriaLabel: boolean
): number | undefined {
  if (rovingFocus) {
    return isCurrent && hasAriaLabel ? 0 : -1;
  }

  return hasAriaLabel ? undefined : -1;
}

/**
 * IconButtonRow — отображает ряд иконочных кнопок-действий.
 *
 * @example
 * <IconButtonRow
 *   actions={[{ ariaLabel: 'Close', icon: <CloseIcon />, onClick: handleClose }]}
 *   position="absolute"
 *   insetBlockStart={16}
 *   insetInlineEnd={16}
 * />
 * <IconButtonRow
 *   actions={[{ control: <LocalePicker appearance="icon" /> }]}
 *   rovingFocus
 * />
 */
function IconButtonRow({
  actions,
  rovingFocus = DEFAULT_ICON_BUTTON_ROW_ROVING_FOCUS,
  shape = DEFAULT_ICON_BUTTON_ROW_SHAPE,
  showBorder = DEFAULT_ICON_BUTTON_ROW_SHOW_BORDER,
  showShadow,
  size,
  ...rest
}: IconButtonRowProps) {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(() =>
    resolveFirstNavigableIndex(actions)
  );

  if (rovingFocus && !isActionNavigable(actions[currentIndex])) {
    const nextIndex = resolveFirstNavigableIndex(actions);

    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
    }
  }

  /**
   * Выставляет `tabIndex` на кнопку внутри слота `control`.
   * Держит одну Tab-остановку ряда при `rovingFocus`.
   */
  useLayoutEffect(() => {
    if (!rovingFocus) {
      return;
    }

    actions.forEach((action, index) => {
      if (!isControlAction(action)) {
        return;
      }

      const button = resolveActionFocusTarget(action, itemRefs.current[index]);

      if (!button) {
        return;
      }

      const tabIndex = resolveActionTabIndex(
        rovingFocus,
        index === currentIndex && isActionNavigable(action),
        true
      );

      if (tabIndex !== undefined) {
        button.tabIndex = tabIndex;
      }
    });
  }, [actions, currentIndex, rovingFocus]);

  if (actions.length === 0) {
    return null;
  }

  const actionBorderProps: ShowBorderProps = resolveBorderProps(
    showBorder,
    undefined,
    showShadow
  );
  const controlSlotProps = {
    shape: resolveControlShape(shape),
    size,
    ...actionBorderProps,
  };

  const focusAction = (index: number) => {
    resolveActionFocusTarget(actions[index], itemRefs.current[index])?.focus();
  };

  const moveRovingFocus = (
    event: KeyboardEvent<HTMLElement>,
    index: number,
    shouldStopPropagation: boolean
  ) => {
    const nextIndex = resolveRovingNextIndex(event, actions, index);

    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();

    if (shouldStopPropagation) {
      event.stopPropagation();
    }

    if (nextIndex === index) {
      return;
    }

    setCurrentIndex(nextIndex);
    focusAction(nextIndex);
  };

  const handleActionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    moveRovingFocus(event, index, false);
  };

  const handleSlotKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    const trigger = resolveActionFocusTarget(actions[index], itemRefs.current[index]);

    if (!trigger || !(event.target instanceof Node) || !trigger.contains(event.target)) {
      return;
    }

    if (trigger.getAttribute('aria-expanded') === 'true') {
      return;
    }

    moveRovingFocus(event, index, true);
  };

  return (
    <StyledIconButtonRow {...rest}>
      {actions.map((action, index) =>
        isControlAction(action) ? (
          <Fragment key={index}>
            <StyledIconButtonRowSlot
              ref={(element: HTMLDivElement | null) => {
                itemRefs.current[index] = element;
              }}
              onFocus={rovingFocus ? () => setCurrentIndex(index) : undefined}
              onKeyDownCapture={
                rovingFocus ? (event) => handleSlotKeyDown(event, index) : undefined
              }
            >
              {isValidElement(action.control)
                ? cloneElement(action.control, controlSlotProps)
                : action.control}
            </StyledIconButtonRowSlot>
            <StyledIconButtonRowSlotReserve aria-hidden size={size} />
          </Fragment>
        ) : (
          <Icon
            active={action.active}
            aria-controls={action.ariaControls}
            aria-expanded={action.ariaExpanded}
            aria-hidden={action.ariaLabel ? undefined : true}
            aria-label={action.ariaLabel}
            as="button"
            disabled={action.disabled}
            key={index}
            padding={action.iconPadding}
            ref={(element: HTMLButtonElement | null) => {
              itemRefs.current[index] = element;
            }}
            shape={shape}
            size={size}
            {...actionBorderProps}
            tabIndex={resolveActionTabIndex(
              rovingFocus,
              index === currentIndex && isActionNavigable(action),
              Boolean(action.ariaLabel)
            )}
            title={action.title}
            onClick={(event) => handleActionClick(action, event)}
            onFocus={rovingFocus ? () => setCurrentIndex(index) : undefined}
            onKeyDown={
              rovingFocus ? (event) => handleActionKeyDown(event, index) : undefined
            }
          >
            {action.icon}
          </Icon>
        )
      )}
    </StyledIconButtonRow>
  );
}

export { IconButtonRow, type IconButtonRowAction };
