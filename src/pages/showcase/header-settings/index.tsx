/**
 * Файл: `src/pages/showcase/header-settings/index.tsx`
 * Определяет панель настроек компонента Header в витрине дизайн-системы.
 * Содержит контролы для изменения режима `autoHide` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `HeaderSettingsProps`
 * 2. Экспортировать компонент `HeaderSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета шапки
 */

import { Switch } from '@ui/switch';

import { StyledSettingsForm } from '../showcase.styles';

/**
 * HeaderSettingsProps — представляет пропсы компонента HeaderSettings.
 *
 * @property autoHide — включает режим скрытия шапки
 * @property onChange — обработчик изменения режима `autoHide`
 */
type HeaderSettingsProps = {
  autoHide: boolean;
  onChange: (value: boolean) => void;
};

/**
 * HeaderSettings — отображает панель настроек Header в витрине дизайн-системы.
 * Тумблер связан с состоянием каркаса страницы, чтобы показать скрытие шапки вживую.
 * Обвязку панели в продуктовый код не переносить: там `autoHide` задаётся пропом Header напрямую.
 *
 * @example
 * <HeaderSettings autoHide={autoHide} onChange={setAutoHide} />
 */
export function HeaderSettings({ autoHide, onChange }: HeaderSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Switch
        checked={autoHide}
        sizePreset="medium"
        onChange={(event) => onChange(event.target.checked)}
      >
        Auto-hide
      </Switch>
    </StyledSettingsForm>
  );
}
