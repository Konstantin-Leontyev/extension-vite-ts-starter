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
          d="M2 17V5.75c0-1.875 1.25-3.75 3.125-3.75H15.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <rect
          height="13.75"
          rx="1.875"
          strokeWidth="2"
          width="13.75"
          x="8.25"
          y="8.25"
        />
      </g>
    </svg>
  );
}
