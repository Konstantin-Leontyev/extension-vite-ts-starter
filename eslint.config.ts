import js from '@eslint/js';
import { defineConfig, globalIgnores, type Config } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importX from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const config: Config[] = defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
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
                '@{components,context,hooks,icons,models,pages,services,styles,ui,utils}{,/**}',
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
