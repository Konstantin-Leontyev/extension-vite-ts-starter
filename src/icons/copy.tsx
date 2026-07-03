import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

export function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor">
        <path
          d="M4 16V7c0-1.5 1-3 2.5-3H15"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <rect height="11" rx="1.5" strokeWidth="2" width="11" x="9" y="9" />
      </g>
    </svg>
  );
}
