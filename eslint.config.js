import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
  // Client config
  {
    files: ['client/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: js.parser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        window: true,
        document: true,
        navigator: true,
        console: true,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Server config
  {
    files: ['server/**/*.{js,ts}', '*.js'],
    languageOptions: {
      parser: js.parser,
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        process: true,
        __dirname: true,
        module: true,
        require: true,
        console: true,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  // Prettier config
  {
    name: 'Prettier',
    rules: {
      ...prettier.rules,
    },
  },
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'build/',
      'dist/',
      '.env',
      '.env.*',
      '.DS_Store',
      'package-lock.json',
      'yarn.lock',
    ],
  },
];
