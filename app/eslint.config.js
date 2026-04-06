import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^[_A-Z]',
        caughtErrors: 'none',
        destructuredArrayIgnorePattern: '^_',
      }],
      // Padrão intencional em context providers e hooks — downgrade para warn
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  // Arquivos de configuração e scripts Node.js — process disponível
  {
    files: ['*.config.{js,mjs}', 'scripts/**/*.{js,mjs}', 'verify_*.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // Context providers e arquivos que exportam não-componentes intencionalmente
  {
    files: ['**/context/**/*.{js,jsx}', '**/stores/**/*.{js,jsx}', '**/*Context.{js,jsx}'],
    rules: {
      'react-refresh/only-export-components': 'warn',
    },
  },
])
