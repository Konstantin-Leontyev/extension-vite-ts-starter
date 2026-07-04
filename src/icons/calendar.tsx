import { ICON_MUTED_LAYER_OPACITY } from './muted-layer';

export function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor">
        <path
          d="M7.5 4.5V6.5M16.5 4.5V6.5M6.5 8.5H17.5M6.5 6.5H17.5C18.6046 6.5 19.5 7.39543 19.5 8.5V18.5C19.5 19.6046 18.6046 20.5 17.5 20.5H6.5C5.39543 20.5 4.5 19.6046 4.5 18.5V8.5C4.5 7.39543 5.39543 6.5 6.5 6.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
      <g fill="currentColor" opacity={ICON_MUTED_LAYER_OPACITY}>
        <circle cx="8.5" cy="12.5" r="1" />
        <circle cx="12" cy="12.5" r="1" />
        <circle cx="15.5" cy="12.5" r="1" />
        <circle cx="8.5" cy="16" r="1" />
        <circle cx="12" cy="16" r="1" />
        <circle cx="15.5" cy="16" r="1" />
      </g>
    </svg>
  );
}
