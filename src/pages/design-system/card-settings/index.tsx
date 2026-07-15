/**
 * Файл: `src/pages/design-system/card-settings/index.tsx`
 * Определяет панель настроек компонента Card в витрине дизайн-системы.
 * Содержит контролы для изменения фона, шапки, подзаголовка и действий
 * в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `CardWidgetState` и `CardHeaderActionState`
 * 2. Экспортировать компонент `CardSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Card
 */

import { Fragment, type CSSProperties, type ChangeEvent } from 'react';

import { Button } from '@ui/button';
import { type CardBackground } from '@ui/card';
import { Checkbox } from '@ui/checkbox';
import { Combobox } from '@ui/combobox';
import { type TextSizePreset, type TextTone } from '@ui/text';

import { BackgroundListbox } from '../background-listbox';
import { StyledSettingsForm } from '../design-system.styles';
import { HeadingGroup } from '../heading-group';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';

/**
 * CardHeaderActionState — представляет одно действие шапки в состоянии витрины
 * дизайн-системы.
 *
 * @property iconKey — ключ иконки из витринного набора
 */
export type CardHeaderActionState = {
  iconKey: IconKey;
};

/**
 * CardWidgetState — представляет состояние настроек компонента Card в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Card, кроме витринных ключей:
 * `showSubtitle` управляет передачей подзаголовка в превью, `headerActions`
 * хранит демо-ряд действий с ключом иконки вместо `ReactNode`.
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
  subtitleAlign: CSSProperties['textAlign'];
  subtitleSizePreset: TextSizePreset;
  subtitleTone: TextTone;
  title: string;
  titleAlign: CSSProperties['textAlign'];
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

  function handleAddHeaderAction(): void {
    onChange('headerActions', [...state.headerActions, { iconKey: 'settings' }]);
  }

  function removeHeaderAction(index: number): void {
    onChange(
      'headerActions',
      state.headerActions.filter((_action, actionIndex) => actionIndex !== index)
    );
  }

  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <BackgroundListbox
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

          <Button
            tone="danger"
            onClick={() => {
              removeHeaderAction(index);
            }}
          >
            Remove action
          </Button>
        </Fragment>
      ))}

      <Button tone="primary" onClick={handleAddHeaderAction}>
        Add header action
      </Button>

      <HeadingGroup
        align={state.titleAlign}
        labelPrefix="Title"
        size={state.titleSizePreset}
        text={state.title}
        tone={state.titleTone}
        onAlignChange={(align) => onChange('titleAlign', align)}
        onSizeChange={(size) => onChange('titleSizePreset', size)}
        onTextChange={(text) => onChange('title', text)}
        onToneChange={(tone) => onChange('titleTone', tone)}
      />

      <Checkbox
        checked={state.showSubtitle}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showSubtitle', event.target.checked)
        }
      >
        Show subtitle
      </Checkbox>

      {state.showSubtitle && (
        <HeadingGroup
          align={state.subtitleAlign}
          labelPrefix="Subtitle"
          size={state.subtitleSizePreset}
          text={state.subtitle}
          tone={state.subtitleTone}
          onAlignChange={(align) => onChange('subtitleAlign', align)}
          onSizeChange={(size) => onChange('subtitleSizePreset', size)}
          onTextChange={(text) => onChange('subtitle', text)}
          onToneChange={(tone) => onChange('subtitleTone', tone)}
        />
      )}
    </StyledSettingsForm>
  );
}
