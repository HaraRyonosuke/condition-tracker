import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', '*.d.ts', '.tmp-react-tool.jsx'],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...pluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/v-on-style': ['error', 'longform'],
      'vue/v-bind-style': ['error', 'longform'],
      'vue/v-slot-style': ['error', 'longform'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    },
  },
  {
    files: ['vite.config.ts', 'eslint.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
)
