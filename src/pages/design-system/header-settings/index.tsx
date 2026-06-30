import { Switch } from '@ui/switch';

import { StyledSettingsForm } from '../design-system.styles';

type HeaderSettingsProps = {
  autoHide: boolean;
  onChange: (value: boolean) => void;
};

/**
 * Витрина пропа `Header autoHide` — ТОЛЬКО для дизайн-системы.
 *
 * Тумблер связан с состоянием каркаса (RouterLayout), чтобы вживую показать «уезжающий»
 * хедер. В реальном проекте развилка не нужна: поведение задаётся прямо — <Header autoHide />.
 * Не переносить эту обвязку в продуктовый код.
 */
export function HeaderSettings({ autoHide, onChange }: HeaderSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Switch
        checked={autoHide}
        label="Auto-hide header"
        onChange={(event) => onChange(event.target.checked)}
      />
    </StyledSettingsForm>
  );
}
