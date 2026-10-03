/**
 * Файл: `src/ui/switch/index.tsx`
 * Предоставляет компонент Switch для отображения тумблера.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - семантический тон через проп `tone`
 *  - подпись справа от дорожки через `children`. Без `children` — дорожка без подписи
 *  - текстовую метку через проп `aria-label`
 *  - id метки через проп `aria-labelledby`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Switch
 * 2. Типизировать пропсы через `SwitchProps`
 * 3. Выставлять `role="switch"` на скрытом input
 *
 * Потребители:
 *  - `src/pages/showcase/header-settings/index.tsx` — переключает режим `autoHide` шапки
 *  - страницы и виджеты приложения — рендерят тумблеры настроек
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { type ChildrenAccessibleName } from '@ui/a11y';
import { getTextSize } from '@ui/presets';
import { Text } from '@ui/text';

import {
  StyledSwitchRoot,
  StyledSwitchTrack,
  splitLayoutProps,
  type SwitchStyleProps,
} from './switch.styles';

/**
 * SwitchProps — представляет пропсы компонента Switch.
 */
type SwitchProps = SwitchStyleProps &
  ChildrenAccessibleName &
  Omit<
    ComponentPropsWithRef<'input'>,
    | 'aria-label'
    | 'aria-labelledby'
    | 'children'
    | 'className'
    | 'style'
    | 'type'
    | keyof SwitchStyleProps
  >;

/**
 * Switch — отображает тумблер с опциональной подписью.
 *
 * @example
 * <Switch checked={enabled} onChange={handleChange}>Notifications</Switch>
 * <Switch checked={enabled} onChange={handleChange} aria-label="Notifications" />
 */
function Switch({ children, size, tone, ...rest }: SwitchProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);

  return (
    <StyledSwitchRoot {...layoutProps}>
      <input className="visually-hidden" role="switch" type="checkbox" {...restProps} />
      <StyledSwitchTrack aria-hidden="true" size={size} tone={tone} />
      {Boolean(children) && <Text size={getTextSize(size)}>{children}</Text>}
    </StyledSwitchRoot>
  );
}

export { Switch };
