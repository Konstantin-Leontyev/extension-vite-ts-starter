export const DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES = {
  emptyBounds: 'Enter at least one bound.',
  invalidFrom: 'From must be a whole number.',
  invalidTo: 'To must be a whole number.',
} as const;

export type RangeInputValidationMessages = {
  [K in keyof typeof DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES]?: string;
};

export type ResolvedRangeInputValidationMessages = {
  [K in keyof typeof DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES]: string;
};
