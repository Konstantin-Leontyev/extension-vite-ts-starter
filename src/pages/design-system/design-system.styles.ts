import styled from 'styled-components';

import { spacingRem } from '@ui/spacing';

export const StyledMain = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-block-size: 0;
`;

/** Сетка виджетов: адаптивные колонки, квадратные карточки. */
export const StyledDesignSystemWidgets = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16.75rem, 1fr));
  gap: ${spacingRem(8)};
  align-items: start;

  > * {
    aspect-ratio: 1 / 1;
  }
`;

/** Форма настроек виджета в сайдбаре: колонка полей. */
export const StyledSettingsForm = styled.form`
  display: grid;
  gap: ${spacingRem(16)};
`;

/** Демо двух radio в виджете: вертикальный стек по центру ячейки. */
export const StyledRadioButtonDemo = styled.div`
  display: grid;
  gap: ${spacingRem(8)};
  place-content: center;
`;
