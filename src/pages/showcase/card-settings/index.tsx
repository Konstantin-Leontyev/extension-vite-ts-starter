/**
 * Файл: `src/pages/showcase/card-settings/index.tsx`
 * Определяет панель настроек компонента Card в витрине дизайн-системы.
 * Содержит контролы для изменения фона, шапки, подзаголовка и действий
 * в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `CardWidgetState` и `CardHeaderActionState`
 * 2. Экспортировать компонент `CardSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Card
 */

import { Fragment, type ChangeEvent } from 'react';

import { Button } from '@ui/button';
import { CARD_HEADER_ACTION_SIZE_PRESET, type CardBackground } from '@ui/card';
import { Checkbox } from '@ui/checkbox';
import { Combobox } from '@ui/combobox';
import { getIconPadding } from '@ui/icon';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { type SpacingValue } from '@ui/spacing';
import { type TextAlignPreset, type TextSizePreset, type TextTone } from '@ui/text';

import { BackgroundListbox } from '../background-listbox';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TitleGroup } from '../title-group';

/**
 * DEFAULT_CARD_HEADER_ACTION_ICON_PADDING — задаёт отступ окна Icon действия шапки по умолчанию.
 * Берётся из `getIconPadding` для `CARD_HEADER_ACTION_SIZE_PRESET`.
 */
const DEFAULT_CARD_HEADER_ACTION_ICON_PADDING = getIconPadding(
  CARD_HEADER_ACTION_SIZE_PRESET
);

/**
 * resolveIconPaddingSizePreset — возвращает ключ канонического размерного ряда
 * под текущий `iconPadding`. Берёт первый ключ ряда, у которого `getIconPadding`
 * даёт то же значение; иначе `CARD_HEADER_ACTION_SIZE_PRESET`.
 *
 * @param iconPadding текущий отступ окна Icon
 * @returns ключ ряда для контрола отступа окна Icon
 */
function resolveIconPaddingSizePreset(iconPadding: SpacingValue): SizePreset {
  return (
    SIZE_PRESET_KEYS.find((key) => getIconPadding(key) === iconPadding) ??
    CARD_HEADER_ACTION_SIZE_PRESET
  );
}

/**
 * CardHeaderActionState — представляет одно действие шапки в состоянии витрины
 * дизайн-системы.
 *
 * @property disabled — включает недоступное состояние
 * @property iconKey — ключ иконки из витринного набора
 * @property iconPadding — отступ окна Icon
 */
export type CardHeaderActionState = {
  disabled: boolean;
  iconKey: IconKey;
  iconPadding: SpacingValue;
};

/**
 * CardWidgetState — представляет состояние настроек компонента Card в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Card, кроме витринных ключей:
 * `showSubtitle` управляет передачей подзаголовка в превью, `headerActions`
 * хранит демо-ряд действий с ключом иконки, отступом окна Icon и флагом `disabled`
 * вместо `ReactNode` и обработчика.
 * Используется для синхронизации значений между панелью управления и демонстрационным виджетом Card.
 *
 * @property background — заливка карточки
 * @property headerActions — демо-ряд действий шапки
 * @property showSubtitle — витринный ключ показа подзаголовка. Выключенный — в превью остаётся только заголовок
 * @property subtitle — подзаголовок
 * @property subtitleAlign — выравнивание подзаголовка
 * @property subtitleSizePreset — размер подзаголовка
 * @property subtitleTone — тон подзаголовка
 * @property title — заголовок
 * @property titleAlign — выравнивание заголовка
 * @property titleSizePreset — размер заголовка
 * @property titleTone — тон заголовка
 */
export type CardWidgetState = {
  background: CardBackground;
  headerActions: CardHeaderActionState[];
  showSubtitle: boolean;
  subtitle: string;
  subtitleAlign: TextAlignPreset;
  subtitleSizePreset: TextSizePreset;
  subtitleTone: TextTone;
  title: string;
  titleAlign: TextAlignPreset;
  titleSizePreset: TextSizePreset;
  titleTone: TextTone;
};

/**
 * CardSettingsProps — представляет пропсы компонента CardSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек карточки
 */
type CardSettingsProps = {
  onChange: <K extends keyof CardWidgetState>(key: K, value: CardWidgetState[K]) => void;
  state: CardWidgetState;
};

/**
 * CardSettings — отображает панель настроек Card в витрине дизайн-системы.
 *
 * @example
 * <CardSettings state={card} onChange={updateCard} />
 */
export function CardSettings({ onChange, state }: CardSettingsProps) {
  /**
   * updateHeaderAction — обновляет поля одного действия шапки в состоянии витрины.
   *
   * @param index индекс действия в `headerActions`
   * @param patch частичное обновление полей действия
   */
  function updateHeaderAction(
    index: number,
    patch: Partial<CardHeaderActionState>
  ): void {
    onChange(
      'headerActions',
      state.headerActions.map((action, actionIndex) =>
        actionIndex === index ? { ...action, ...patch } : action
      )
    );
  }

  /**
   * handleAddHeaderAction — добавляет действие шапки с полями по умолчанию.
   */
  function handleAddHeaderAction(): void {
    onChange('headerActions', [
      ...state.headerActions,
      {
        disabled: false,
        iconKey: 'settings',
        iconPadding: DEFAULT_CARD_HEADER_ACTION_ICON_PADDING,
      },
    ]);
  }

  /**
   * handleRemoveHeaderAction — удаляет действие шапки по индексу.
   *
   * @param index индекс удаляемого действия
   */
  function handleRemoveHeaderAction(index: number): void {
    onChange(
      'headerActions',
      state.headerActions.filter((_action, actionIndex) => actionIndex !== index)
    );
  }

  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <BackgroundListbox
        label="Background:"
        value={state.background}
        onChange={(background) => onChange('background', background)}
      />

      {state.headerActions.map((action, index) => (
        <Fragment key={index}>
          <Combobox
            label={`Header action ${index + 1} icon:`}
            options={COMBOBOX_OPTIONS}
            reserveErrorSpace={false}
            value={action.iconKey}
            onChange={(value) =>
              updateHeaderAction(index, { iconKey: value as IconKey })
            }
          />

          <SizeListbox
            label={`Header action ${index + 1} icon padding:`}
            sizes={SIZE_PRESET_KEYS}
            value={resolveIconPaddingSizePreset(action.iconPadding)}
            onChange={(size) =>
              updateHeaderAction(index, { iconPadding: getIconPadding(size) })
            }
          />

          <Checkbox
            checked={action.disabled}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateHeaderAction(index, { disabled: event.target.checked })
            }
          >
            {`Disable action ${index + 1}`}
          </Checkbox>

          <Button
            tone="danger"
            onClick={() => {
              handleRemoveHeaderAction(index);
            }}
          >
            Remove action
          </Button>
        </Fragment>
      ))}

      <Button tone="primary" onClick={handleAddHeaderAction}>
        Add header action
      </Button>

      <TitleGroup
        align={state.titleAlign}
        labelPrefix="Title"
        size={state.titleSizePreset}
        title={state.title}
        tone={state.titleTone}
        onAlignChange={(align) => onChange('titleAlign', align)}
        onSizeChange={(size) => onChange('titleSizePreset', size)}
        onTitleChange={(title) => onChange('title', title)}
        onToneChange={(tone) => onChange('titleTone', tone)}
      />

      <Checkbox
        checked={state.showSubtitle}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showSubtitle', event.target.checked)
        }
      >
        Show subtitle
      </Checkbox>

      {state.showSubtitle && (
        <TitleGroup
          align={state.subtitleAlign}
          labelPrefix="Subtitle"
          size={state.subtitleSizePreset}
          title={state.subtitle}
          tone={state.subtitleTone}
          onAlignChange={(align) => onChange('subtitleAlign', align)}
          onSizeChange={(size) => onChange('subtitleSizePreset', size)}
          onTitleChange={(title) => onChange('subtitle', title)}
          onToneChange={(tone) => onChange('subtitleTone', tone)}
        />
      )}
    </StyledSettingsForm>
  );
}
