import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

export function SidebarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity={ICON_MUTED_LAYER_OPACITY} fill="currentColor">
        <rect height="15" rx="1.5" width="7" x="13" y="4.5" />
      </g>
      <g stroke="currentColor">
        <rect
          height="15"
          rx="2.5"
          strokeLinejoin="round"
          strokeWidth="2"
          width="16"
          x="4"
          y="4.5"
        />
      </g>
    </svg>
  );
}
