import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'eslint-config-prettier'),
  {
    plugins: {
      prettier,
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
      '**/.turbo/**',
      '**/coverage/**',
    ],
  },
  {
    rules: {
      indent: ['error', 2],
      '@typescript-eslint/no-unused-vars': 'error',
      'space-in-parens': ['error', 'never'],
      'prettier/prettier': 'error',
    },
  },
];

export default eslintConfig;
