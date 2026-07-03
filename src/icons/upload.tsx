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
          d="M2 17.625v3.125a1.25 1.25 0 0 0 1.25 1.25h17.5a1.25 1.25 0 0 0 1.25-1.25v-3.125"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g opacity={ICON_MUTED_LAYER_OPACITY} stroke="currentColor">
        <path
          d="M12 15.125V2M7 7L12 2L17 7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
