import { SignOutIcon } from './sign-out';

/** Стрелка «внутрь/вниз»: тот же sign-out, повёрнутый на 90°. */
export function DownloadIcon() {
  return (
    <span style={{ display: 'inline-flex', transform: 'rotate(90deg)' }}>
      <SignOutIcon />
    </span>
  );
}
