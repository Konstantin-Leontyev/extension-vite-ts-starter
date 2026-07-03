import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

export function SignOutIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor">
        <path
          d="M2.625 22V2H8.875"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M11.375 12H21.375M17 7.625L21.375 12L17 16.375"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
