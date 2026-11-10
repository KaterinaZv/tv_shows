import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// View is any component: a *.tsx file with a PascalCase name (ARCHITECTURE.md, rule 1)
const VIEW_FILES = ['src/**/[A-Z]*.tsx'];

const VIEW_SYNTAX = [
  {
    selector: "CallExpression:not([callee.name='usePresenter']):not([callee.property.name='map'])",
    message: 'Во View разрешены только вызов usePresenter() и .map() для списков. Логику перенесите в usePresenter.',
  },
  {
    selector: 'TemplateLiteral',
    message: 'Склейка строк и className — работа presenter. Верните готовое значение из usePresenter.',
  },
  {
    selector: 'NewExpression',
    message: 'Создание объектов во View запрещено. Перенесите в usePresenter.',
  },
  {
    selector: 'ArrowFunctionExpression VariableDeclarator > :matches(ArrowFunctionExpression, FunctionExpression)',
    message: 'Функции внутри View запрещены. Обработчики объявляются в usePresenter.',
  },
];

// Rule 7: a View/presenter module declares only the component/hook; constants, types and helpers live in separate files
const VIEW_EXPORT_NAME = '/^[A-Z][a-z][A-Za-z0-9]*$/';
const PRESENTER_EXPORT_NAME = '/^usePresenter$/';

const moduleSyntax = (allowedName) => [
  {
    selector: `Program > :matches(VariableDeclaration, ExportNamedDeclaration > VariableDeclaration) > VariableDeclarator:not([id.name=${allowedName}])`,
    message: 'Константы и хелперы выносятся в constants.ts / utils.ts (ARCHITECTURE.md, правило 7).',
  },
  {
    selector:
      'Program > :matches(TSTypeAliasDeclaration, TSInterfaceDeclaration, ExportNamedDeclaration > TSTypeAliasDeclaration, ExportNamedDeclaration > TSInterfaceDeclaration)',
    message: 'Типы выносятся в types.ts (ARCHITECTURE.md, правило 7).',
  },
  {
    selector: 'Program > :matches(FunctionDeclaration, ExportNamedDeclaration > FunctionDeclaration)',
    message: 'Хелперы выносятся в utils.ts (ARCHITECTURE.md, правило 7).',
  },
];

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx,js}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // Type-aware linting is needed to catch `any` leaking from libraries (JSON.parse, response.json())
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      // `any` is forbidden: explicit, as a cast, and leaking from untyped values
      '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
    },
  },
  {
    // Config files are plain JS outside the TS project: type-aware rules do not apply
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['**/*.tsx'],
    extends: [react.configs.flat.recommended, react.configs.flat['jsx-runtime']],
    settings: { react: { version: 'detect' } },
    rules: {
      // Inline arrows and bind in handlers are forbidden: presenter returns a ready handle*
      'react/jsx-no-bind': ['error', { allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
    },
  },
  {
    files: VIEW_FILES,
    rules: {
      // UI texts come from presenter via i18n; only icon symbols are allowed as raw JSX text
      'react/jsx-no-literals': ['error', { allowedStrings: ['←', '→', '✕'] }],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Allowed: ./usePresenter, components (PascalCase), *.module.css. Types only via import type
              regex: '^(?!\\./usePresenter$)(?!.*\\.module\\.css$)(?!(?:\\.{1,2}|@)/(?:.*/)?[A-Z][A-Za-z0-9]*$).*$',
              allowTypeImports: true,
              caseSensitive: true,
              message:
                'View может импортировать только ./usePresenter, компоненты, ui-kit, *.module.css и типы (import type). Логика — в usePresenter.',
            },
          ],
        },
      ],
      'no-restricted-syntax': ['error', ...VIEW_SYNTAX, ...moduleSyntax(VIEW_EXPORT_NAME)],
    },
  },
  {
    files: ['src/**/usePresenter.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@tanstack/react-query'],
              allowTypeImports: true,
              message:
                'Presenter не вызывает React Query напрямую: оберните запрос в отдельный хук use<Name>.ts (ARCHITECTURE.md, правило 2).',
            },
          ],
        },
      ],
      'no-restricted-syntax': ['error', ...moduleSyntax(PRESENTER_EXPORT_NAME)],
    },
  },
  {
    // Rule 5: base elements are rendered only through ui-kit
    files: ['src/**/*.tsx'],
    ignores: ['src/ui-kit/**'],
    rules: {
      'react/forbid-elements': [
        'error',
        {
          forbid: [
            { element: 'button', message: 'Используйте Button из ui-kit.' },
            { element: 'input', message: 'Используйте Input из ui-kit.' },
            { element: 'h1', message: 'Используйте Heading из ui-kit.' },
            { element: 'h2', message: 'Используйте Heading из ui-kit.' },
            { element: 'h3', message: 'Используйте Heading из ui-kit.' },
            { element: 'h4', message: 'Используйте Heading из ui-kit.' },
            { element: 'h5', message: 'Используйте Heading из ui-kit.' },
            { element: 'h6', message: 'Используйте Heading из ui-kit.' },
            { element: 'p', message: 'Используйте Text из ui-kit.' },
            { element: 'span', message: 'Используйте Text или Badge из ui-kit.' },
            { element: 'a', message: 'Используйте Link из ui-kit.' },
            { element: 'img', message: 'Используйте Image из ui-kit.' },
          ],
        },
      ],
    },
  },
  prettier,
]);
