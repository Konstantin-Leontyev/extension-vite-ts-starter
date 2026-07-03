import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

export function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor">
        <path
          d="M4 16.5v2.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M12 14.5V4M8 8L12 4L16 8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
