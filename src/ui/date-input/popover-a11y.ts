/** aria-label кнопки сброса — из подписи триггера, без двоеточия. */
export function clearButtonAriaLabel(
  ariaLabel: string | undefined,
  fallback = 'Clear date'
): string {
  const trimmed = ariaLabel?.trim();

  if (!trimmed) {
    return fallback;
  }

  return `Clear ${trimmed.replace(/:$/, '')}`;
}

export function focusCalendarPanelInitial(panel: HTMLElement): void {
  const selectedDay = panel.querySelector<HTMLElement>(
    'button[aria-pressed="true"]:not([disabled])'
  );

  if (selectedDay) {
    selectedDay.focus();
    return;
  }

  panel.querySelector<HTMLElement>('button:not([disabled])')?.focus();
}
