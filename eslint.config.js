import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript,
      react: react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
      },
    },
    rules: {
      // Prevent imports of deprecated components
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/components/SimpleChatbot*'],
              message: 'SimpleChatbot is deprecated. Use @/components/ui/SimpleChatBot instead.',
            },
            {
              group: ['**/components/NewSidebar*'],
              message: 'NewSidebar is deprecated. Use @/components/Sidebar instead.',
            },
            {
              group: ['**/pages/shop-simple*'],
              message: 'shop-simple pages are deprecated. Use /shop routes instead.',
            },
            {
              group: ['**/pages/shop-new*'],
              message: 'shop-new pages are deprecated. Use /shop routes instead.',
            },
            {
              group: ['**/components/notifications/NotificationProvider*'],
              message: 'NotificationProvider from notifications/ is deprecated. Use @/hooks/use-notifications instead.',
            },
            {
              group: ['**/components/notifications/NotificationBell*'],
              message: 'NotificationBell from notifications/ is deprecated. Use @/components/NotificationBell instead.',
            },
            {
              group: ['**/components/features/Chatbot*'],
              message: 'Chatbot from features/ is deprecated. Use @/components/ui/SimpleChatBot instead.',
            },
          ],
          paths: [
            {
              name: '@/components/SimpleChatbot',
              message: 'SimpleChatbot is deprecated. Use @/components/ui/SimpleChatBot instead.',
            },
            {
              name: '@/components/NewSidebar',
              message: 'NewSidebar is deprecated. Use @/components/Sidebar instead.',
            },
            {
              name: '@/components/notifications/NotificationProvider',
              message: 'NotificationProvider from notifications/ is deprecated. Use @/hooks/use-notifications instead.',
            },
            {
              name: '@/components/notifications/NotificationBell',
              message: 'NotificationBell from notifications/ is deprecated. Use @/components/NotificationBell instead.',
            },
            {
              name: '@/components/features/Chatbot',
              message: 'Chatbot from features/ is deprecated. Use @/components/ui/SimpleChatBot instead.',
            },
            {
              name: '../components/SimpleChatbot',
              message: 'SimpleChatbot is deprecated. Use @/components/ui/SimpleChatBot instead.',
            },
            {
              name: '../components/NewSidebar',
              message: 'NewSidebar is deprecated. Use @/components/Sidebar instead.',
            },
            {
              name: '../pages/shop-simple',
              message: 'shop-simple pages are deprecated. Use /shop routes instead.',
            },
            {
              name: '../pages/shop-new',
              message: 'shop-new pages are deprecated. Use /shop routes instead.',
            },
          ],
        },
      ],
      
      // Additional React and TypeScript rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Turn off some rules that might be too strict for this project
      'no-unused-vars': 'off',
      'no-undef': 'off', // TypeScript handles this
      'prefer-const': 'warn',
      'no-console': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'target/**',
      '**/*.d.ts',
      'vite.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
      '.cache/**',
      'logs/**',
      'temp/**',
      'uploads/**',
      'public/**',
    ],
  },
];