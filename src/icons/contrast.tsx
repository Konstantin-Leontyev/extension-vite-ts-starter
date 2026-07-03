import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

export function ContrastIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} fill="currentColor">
        <path d="M12 2a10 10 0 0 1 0 20Z" />
      </g>
      <g stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
      </g>
    </svg>
  );
}
