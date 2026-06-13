import { SignOutIcon } from './sign-out';

/** Стрелка «наружу/вверх»: тот же sign-out, повёрнутый на -90°. */
export function UploadIcon() {
  return (
    <span style={{ display: 'inline-flex', transform: 'rotate(-90deg)' }}>
      <SignOutIcon />
    </span>
  );
}
