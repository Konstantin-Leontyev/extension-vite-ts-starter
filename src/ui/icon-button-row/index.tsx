/**
 * Файл: `src/ui/icon-button-row/index.tsx`
 * Предоставляет компонент IconButtonRow для отображения ряда иконочных кнопок-действий.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`
 *  - ряд действий через проп `actions`. Пустой ряд не рендерит компонент
 *  - roving focus через проп `rovingFocus`
 *
 * Основные задачи:
 * 1. Экспортировать компонент IconButtonRow
 * 2. Типизировать пропсы через `IconButtonRowProps`
 * 3. Экспортировать тип `IconButtonRowAction`
 * 4. При включённом `rovingFocus` вести одну Tab-остановку и перемещать фокус
 *    между действиями из обхода стрелками, Home и End
 *
 * Потребители:
 *  - `@ui/card` — рендерит ряд действий шапки
 *  - `@ui/sidebar` — типизирует действия шапки через `IconButtonRowAction`
 *  - `@ui/toolbar` — рендерит ряд действий панели инструментов
 */

import {
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { Icon, type IconShapePreset, type IconSizePreset } from '@ui/icon';
import { type SpacingValue } from '@ui/spacing';

import {
  StyledIconButtonRow,
  type IconButtonRowStyleProps,
} from './icon-button-row.styles';

/**
 * IconButtonRowAction — представляет одно действие ряда иконочных кнопок.
 *
 * @property ariaControls — id элемента, которым управляет кнопка
 * @property ariaExpanded — раскрытое состояние управляемого элемента
 * @property ariaLabel — доступное имя кнопки. Без имени кнопка скрыта от вспомогательных технологий
 * @property disabled — включает недоступное состояние
 * @property icon — svg-глиф действия
 * @property iconPadding — отступ окна Icon
 * @property onClick — обработчик клика по действию
 * @property title — текст нативного tooltip. Из `ariaLabel` не выводится
 */
type IconButtonRowAction = {
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  icon: ReactNode;
  iconPadding?: SpacingValue;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  title?: string;
};

/**
 * DEFAULT_ICON_BUTTON_ROW_SHAPE — задаёт форму окна действия по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape`.
 */
const DEFAULT_ICON_BUTTON_ROW_SHAPE: IconShapePreset = 'round';

/**
 * DEFAULT_ICON_BUTTON_ROW_ROVING_FOCUS — задаёт roving focus по умолчанию.
 * Используется, когда вызывающий код не передал проп `rovingFocus`.
 */
const DEFAULT_ICON_BUTTON_ROW_ROVING_FOCUS = false;

/**
 * IconButtonRowProps — представляет пропсы компонента IconButtonRow.
 *
 * @property actions — ряд действий
 * @property rovingFocus — включает roving focus
 * @property shape — форма окна действия
 * @property size — размер окна действия
 */
type IconButtonRowProps = {
  actions: IconButtonRowAction[];
  rovingFocus?: boolean;
  shape?: IconShapePreset;
  size?: IconSizePreset;
} & IconButtonRowStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'style' | keyof IconButtonRowStyleProps
  >;

/**
 * handleActionClick — останавливает всплытие клика и вызывает обработчик действия.
 *
 * @param action действие ряда
 * @param event событие клика по кнопке
 */
function handleActionClick(
  action: IconButtonRowAction,
  event: MouseEvent<HTMLButtonElement>
) {
  event.stopPropagation();
  action.onClick?.(event);
}

/**
 * isActionNavigable — возвращает признак участия действия в обходе roving focus.
 *
 * @param action действие ряда или `undefined` при индексе вне ряда
 * @returns `true` у действия без `disabled` и с доступным именем
 */
function isActionNavigable(action?: IconButtonRowAction): boolean {
  return Boolean(action && !action.disabled && action.ariaLabel);
}

/**
 * resolveFirstNavigableIndex — возвращает индекс первого действия из обхода.
 *
 * @param actions ряд действий
 * @returns индекс первого действия из обхода, иначе `0`
 */
function resolveFirstNavigableIndex(actions: IconButtonRowAction[]): number {
  const index = actions.findIndex(isActionNavigable);

  return index === -1 ? 0 : index;
}

/**
 * resolveNavigableNeighborIndex — возвращает индекс ближайшего соседа из обхода по кругу.
 *
 * @param actions ряд действий
 * @param fromIndex текущий индекс
 * @param direction направление обхода: `-1` влево, `1` вправо
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
 * @returns индекс первого или последнего действия из обхода, иначе `0`
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

  return 0;
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
 */
function IconButtonRow({
  actions,
  rovingFocus = DEFAULT_ICON_BUTTON_ROW_ROVING_FOCUS,
  shape = DEFAULT_ICON_BUTTON_ROW_SHAPE,
  size,
  ...rest
}: IconButtonRowProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(() =>
    resolveFirstNavigableIndex(actions)
  );

  if (rovingFocus && !isActionNavigable(actions[currentIndex])) {
    const nextIndex = resolveFirstNavigableIndex(actions);

    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
    }
  }

  if (actions.length === 0) {
    return null;
  }

  const handleActionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowLeft': {
        nextIndex = resolveNavigableNeighborIndex(actions, index, -1);
        break;
      }
      case 'ArrowRight': {
        nextIndex = resolveNavigableNeighborIndex(actions, index, 1);
        break;
      }
      case 'End': {
        nextIndex = resolveNavigableEdgeIndex(actions, 'end');
        break;
      }
      case 'Home': {
        nextIndex = resolveNavigableEdgeIndex(actions, 'start');
        break;
      }
      default: {
        return;
      }
    }

    event.preventDefault();

    if (nextIndex === index) {
      return;
    }

    setCurrentIndex(nextIndex);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <StyledIconButtonRow {...rest}>
      {actions.map((action, index) => (
        <Icon
          aria-controls={action.ariaControls}
          aria-expanded={action.ariaExpanded}
          aria-hidden={action.ariaLabel ? undefined : true}
          aria-label={action.ariaLabel}
          as="button"
          disabled={action.disabled}
          key={index}
          padding={action.iconPadding}
          ref={(element: HTMLButtonElement | null) => {
            buttonRefs.current[index] = element;
          }}
          shape={shape}
          size={size}
          tabIndex={resolveActionTabIndex(
            rovingFocus,
            index === currentIndex,
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
      ))}
    </StyledIconButtonRow>
  );
}

export { IconButtonRow, type IconButtonRowAction };
