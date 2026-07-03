import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

export function AvatarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M4.5 20C4.5 16.5 8 14.5 12 14.5C16 14.5 19.5 16.5 19.5 20"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g stroke="currentColor">
        <circle cx="12" cy="8" r="3.5" strokeWidth="2" />
      </g>
    </svg>
  );
}
