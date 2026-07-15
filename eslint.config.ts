import js from '@eslint/js';
import { defineConfig, globalIgnores, type Config } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importX from 'eslint-plugin-import-x';
// @ts-expect-error eslint-plugin-jsx-a11y ships without TypeScript types
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const deepImportPatterns = [
  {
    group: ['@ui/*/*', '@ui/*/*/**'],
    message: 'Import UI kit modules only via barrel @ui/<name>.',
  },
  {
    group: ['@services/*/*', '@services/*/*/**'],
    message: 'Import services only via barrel @services/<name>.',
  },
];

const config: Config[] = defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      jsxA11y.flatConfigs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      'import-x': importX,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],
      'import-x/consistent-type-specifier-style': ['error', 'prefer-inline'],
      'import-x/no-duplicates': 'error',
      'import-x/order': [
        'error',
        {
          alphabetize: {
            caseInsensitive: false,
            order: 'asc',
          },
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
          ],
          named: {
            enabled: true,
            types: 'types-last',
          },
          'newlines-between': 'always',
          pathGroups: [
            {
              group: 'internal',
              pattern:
                '@{components,context,hooks,icons,lib,models,pages,services,styles,ui,utils}{,/**}',
            },
            // Side-effect stylesheet imports (e.g. import './button.css'). ESLint group name is fixed: object.
            {
              group: 'object',
              pattern: '*.{css,scss}',
              patternOptions: { matchBase: true },
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          warnOnUnassignedImports: true,
        },
      ],
      'no-restricted-imports': ['error', { patterns: deepImportPatterns }],
    },
  },
  {
    files: ['src/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...deepImportPatterns,
            {
              group: ['../*', '../**'],
              message:
                'Cross-primitive relative imports are forbidden; use @ui/<name> barrel.',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'import-x/no-default-export': 'error',
      'import-x/prefer-default-export': 'off',
    },
  },
]);

export default config;
