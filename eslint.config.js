import antfu from '@antfu/eslint-config'

// noinspection JSUnusedGlobalSymbols - suppresses "exported but not used" warning in WebStorm
export default antfu({
  type: 'lib',
  rules: {
    'curly': ['error', 'all'],
    'style/brace-style': ['error', 'stroustrup'],
  },
  ignores: [
    '**/dist/',
    '**/*.d.ts',
  ],
  typescript: {
    parserOptions: {
      ecmaVersion: 'latest',
    },
  },
})
