import { defineConfig } from 'eslint/config';
import { createConfig } from '@homer0/eslint-plugin/create';

export default defineConfig([
  createConfig({
    importUrl: import.meta.url,
    ignores: ['tests/**', 'docs/**', '.prettierrc.mjs'],
    configs: ['node-with-prettier', 'jsdoc'],
    addTsParser: false,
    sourceType: 'commonjs',
    rules: {
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['parent', 'prettierignore'],
        },
      ],
    },
  }),
  {
    ignores: ['tests/e2e/fixtures/*.js'],
  },
  createConfig({
    importUrl: import.meta.url,
    files: 'all-inside:./tests',
    configs: ['node-with-prettier', 'tests'],
    addTsParser: false,
    languageOptions: {
      parserOptions: {
        sourceType: 'commonjs',
      },
      globals: {
        it: 'readonly',
        describe: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'no-use-before-define': 'off',
    },
  }),
]);
