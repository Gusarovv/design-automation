module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
	  ecmaVersion: 'latest',
	  sourceType: 'module',
	},
	extends: [
	  'eslint:recommended',
	  'plugin:@typescript-eslint/recommended',
	  'plugin:react-hooks/recommended',
	  'plugin:prettier/recommended',
	  // Это отключает правила форматирования в ESLint, за обработку которых будет отвечать Prettier.
	  'eslint-config-prettier',
	],
	settings: {
	  react: {
		// Сообщает eslint-plugin-react автоматически определять версию React для использования.
		version: 'detect',
	  },
	  // Сообщает eslint, как разрешить импорт
	  'import/resolver': {
		node: {
		  paths: ['src'],
		  extensions: ['.js', '.jsx', '.ts', '.tsx'],
		},
	  },
	},
	env: {
	  browser: true,
	  amd: true,
	  node: true,
	  jest: true,
	  es2020: true,
	},
	plugins: ['@typescript-eslint/eslint-plugin', 'react-refresh'],
	ignorePatterns: ['dist', 'node_modules', '.eslint.cjs'],
	rules: {
	  // Собственные правила
	  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
	  'react/react-in-jsx-scope': 'off',
	  'prettier/prettier': ['warn'],
	  'prefer-const': 'warn',
	  '@typescript-eslint/no-explicit-any': 'off',
	  '@typescript-eslint/no-empty-interface': 'off',
	  '@typescript-eslint/no-unused-vars': 'off',
	  // '@typescript-eslint/interface-name-prefix': 'off',
	  // '@typescript-eslint/explicit-function-return-type': 'off',
	  // '@typescript-eslint/explicit-module-boundary-types': 'off',
	},
  };
  