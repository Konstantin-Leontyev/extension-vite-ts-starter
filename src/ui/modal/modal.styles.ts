import styled from 'styled-components';

/** Нативный top-layer: backdrop и центрирование — у dialog; Card внутри — контент. */
export const StyledModalDialog = styled.dialog`
  padding: 0;
  margin: auto;
  max-inline-size: calc(100vw - 2rem);
  max-block-size: calc(100dvb - 2rem);
  overflow: visible;
  background: transparent;
  border: none;

  &::backdrop {
    background-color: rgb(0 0 0 / 50%);
  }
`;
