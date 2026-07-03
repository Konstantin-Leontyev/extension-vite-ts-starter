import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

export function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M17.625 17.625L22 22"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g stroke="currentColor">
        <circle
          cx="11.375"
          cy="11.375"
          r="8.75"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
