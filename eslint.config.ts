import js from '@eslint/js';
import { defineConfig, globalIgnores, type Config } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importX from 'eslint-plugin-import-x';
// @ts-expect-error eslint-plugin-jsx-a11y ships without TypeScript types
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
// @ts-expect-error eslint-plugin-sort-destructure-keys ships without TypeScript types
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
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
      perfectionist,
      react,
      'sort-destructure-keys': sortDestructureKeys,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'jsx-a11y': {
        polymorphicPropName: 'as',
        // polymorphicAllowList — учитывает проп as только у узлов, которые
        // меняют тег на интерактивный или табличный. Card в перечень не входит:
        // as меняет тег на article или section, а они в критерий не входят.
        polymorphicAllowList: [
          'Icon',
          'StyledIcon',
          'StyledTableCell',
          'StyledText',
          'TableCell',
          'Text',
        ],
        // components — связывает компонент с нативным тегом корня для правил
        // jsx-a11y. Новый компонент вносится, когда корень — тег, на который
        // действуют правила плагина, и линтер видит связанный нативный контрол
        // в JSX вызывающего кода. Switch не внесён: правило
        // label-has-associated-control не видит вложенный input, потому что
        // в JSX вызывающего кода его нет. StyledProfileMenuLegalLink не внесён:
        // узел — Link с пропом to и обработчиком клика, а правила клика проп to
        // за ссылку не считают даже с specialLink.
        // Открытые находки доступности — в общем чеклисте набора
        // .cursor/skills/shared/a11y-checklist.md проекта caption-downloader.
        components: {
          FieldClear: 'button',
          FieldLabel: 'label',
          Fieldset: 'fieldset',
          Modal: 'dialog',
          StyledButton: 'button',
          StyledCalendarDayButton: 'button',
          StyledCalendarNavButton: 'button',
          StyledCheckboxControl: 'input',
          StyledCheckboxRoot: 'label',
          StyledComboboxList: 'ul',
          StyledComboboxOption: 'button',
          StyledComboboxTrigger: 'button',
          StyledFieldset: 'fieldset',
          StyledHeaderBrand: 'a',
          StyledInputControl: 'input',
          StyledListboxOption: 'li',
          StyledListboxPanel: 'ul',
          StyledListboxTrigger: 'button',
          StyledModalDialog: 'dialog',
          StyledRadioButtonControl: 'input',
          StyledRadioButtonRoot: 'label',
          StyledRangeInputPresetButton: 'button',
          StyledRangeInputPresetList: 'ul',
          StyledRangeInputTrigger: 'button',
          StyledSearchFieldControl: 'input',
          StyledSegmentButtonPartsPart: 'button',
          StyledStepperButton: 'button',
          StyledStepperInput: 'input',
          StyledSwitchRoot: 'label',
          StyledTable: 'table',
          StyledTableBody: 'tbody',
          StyledTableCell: 'td',
          StyledTableCol: 'col',
          StyledTableFoot: 'tfoot',
          StyledTableHead: 'thead',
          StyledTableInlineField: 'input',
          StyledTablePanelErrorCell: 'td',
          StyledTableRow: 'tr',
          StyledTableRowPanelTable: 'table',
          TableCell: 'td',
          TableInlineField: 'input',
          ThemeToggle: 'button',
        },
      },
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
            // Side-effect stylesheet imports, for example import './button.css'. ESLint group name is fixed: object.
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
      'jsx-a11y/anchor-is-valid': ['error', { specialLink: ['to'] }],
      'no-restricted-imports': ['error', { patterns: deepImportPatterns }],
      // Сортируются только перечислимые списки без собственной семантики порядка.
      // Литералы объектов вроде таблиц пресетов и соответствий проп → CSS-свойство не сортируются:
      // их порядок семантический, например ряд размеров или шорткат раньше лонгхендов.
      // Порядок объявлений верхнего уровня линтером не сортируется — он смысловой
      // и держится вручную по канону: зависимость раньше использования, композит последним.
      'perfectionist/sort-object-types': 'error',
      'perfectionist/sort-union-types': 'error',
      'react/jsx-sort-props': ['error', { callbacksLast: true }],
      'sort-destructure-keys/sort-destructure-keys': 'error',
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
  // Playwright: Node-глобалы для сценариев e2e и playwright.config.ts.
  // jsx-a11y, react-hooks и react-refresh на оснастке не действуют.
  // no-empty-pattern выключен из-за пустой деструктуризации fixture baseURL.
  {
    files: ['e2e/**/*.ts', 'playwright.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      ...Object.fromEntries(
        Object.keys(jsxA11y.flatConfigs.recommended.rules as object).map(
          (rule) => [rule, 'off']
        )
      ),
      'no-empty-pattern': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
]);

export default config;
