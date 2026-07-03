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
          d="M2.625 22C2.625 17.625 7 15.125 12 15.125C17 15.125 21.375 17.625 21.375 22"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g stroke="currentColor">
        <circle cx="12" cy="7" r="4.375" strokeWidth="2" />
      </g>
    </svg>
  );
}
