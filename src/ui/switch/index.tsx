/**
 * Файл: `src/ui/switch/index.tsx`
 * Предоставляет компонент Switch для отображения тумблера.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - семантический тон через проп `tone`
 *  - подпись справа от дорожки через `children`. Без `children` — дорожка без подписи
 *  - тон подписи через проп `textTone`
 *  - размер подписи через проп `textSize`
 *  - курсив подписи через проп `textItalic`
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

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { getTextSize } from '@ui/presets';
import { Text, type TextNodeStyleProps, type TextTone } from '@ui/text';

import {
  StyledSwitchRoot,
  StyledSwitchTrack,
  splitLayoutProps,
  type SwitchStyleProps,
} from './switch.styles';

/**
 * DEFAULT_SWITCH_TEXT_TONE — задаёт тон подписи по умолчанию.
 * Подпись контрола — вторичный текст, поэтому `muted`.
 */
const DEFAULT_SWITCH_TEXT_TONE: TextTone = 'muted';

/**
 * SwitchProps — представляет пропсы компонента Switch.
 *
 * @property children — подпись
 */
type SwitchProps = SwitchStyleProps &
  Omit<TextNodeStyleProps<'text'>, 'textAlign'> & {
    children?: ReactNode;
  } & Omit<
    ComponentPropsWithRef<'input'>,
    'children' | 'className' | 'style' | 'type' | keyof SwitchStyleProps
  >;

/**
 * Switch — отображает тумблер с опциональной подписью.
 *
 * @example
 * <Switch checked={enabled} onChange={handleChange}>Notifications</Switch>
 * <Switch checked={enabled} onChange={handleChange} aria-label="Notifications" />
 */
function Switch({
  children,
  sizePreset,
  textItalic,
  textSize,
  textTone = DEFAULT_SWITCH_TEXT_TONE,
  tone,
  ...rest
}: SwitchProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);

  return (
    <StyledSwitchRoot {...layoutProps}>
      <input className="visually-hidden" role="switch" type="checkbox" {...restProps} />
      <StyledSwitchTrack aria-hidden="true" sizePreset={sizePreset} tone={tone} />
      {Boolean(children) && (
        <Text
          italic={textItalic}
          sizePreset={textSize ?? getTextSize(sizePreset)}
          tone={textTone}
        >
          {children}
        </Text>
      )}
    </StyledSwitchRoot>
  );
}

export { Switch };
