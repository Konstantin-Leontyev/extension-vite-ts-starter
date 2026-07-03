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
        <rect height="18.75" rx="1.875" width="8.75" x="13.25" y="2.625" />
      </g>
      <g stroke="currentColor">
        <rect
          height="18.75"
          rx="3.125"
          strokeLinejoin="round"
          strokeWidth="2"
          width="20"
          x="2"
          y="2.625"
        />
      </g>
    </svg>
  );
}
