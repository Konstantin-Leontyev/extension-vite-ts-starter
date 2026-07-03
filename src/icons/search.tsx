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
          d="M16.5 16.5L20 20"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g stroke="currentColor">
        <circle cx="11.5" cy="11.5" r="7" strokeLinejoin="round" strokeWidth="2" />
      </g>
    </svg>
  );
}
