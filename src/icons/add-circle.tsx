import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

export function AddCircleIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      </g>
      <g stroke="currentColor">
        <path
          d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}
