import tseslint from 'typescript-eslint'
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config({
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
        parser: tseslint.parser,
    },
    plugins: {
        "@typescript-eslint": tseslint.plugin, import: pluginImport, react: pluginReact, prettier: pluginPrettier
    },
    rules: {
        quotes: ['error', 'single', {avoidEscape: true}],
        'no-empty-pattern': 0,
        'linebreak-style': ['error', 'unix'],
        'no-trailing-spaces': 'error',
        'max-lines-per-function': ['error', {max: 90, skipBlankLines: true, skipComments: true}],
        complexity: ['error', 9],
        'no-constant-condition': [
            'error',
            {
                checkLoops: false,
            },
        ],
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
            },
        ],
        'import/no-duplicates': 'error',
        'keyword-spacing': [
            'error',
            {
                before: true,
                after: true,
            },
        ],
        'object-curly-spacing': ['error', 'always'],
        'block-spacing': ['error', 'always'],
        'space-before-blocks': 'error',
        curly: ['error', 'all'],
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
            },
        ],
        'brace-style': 'error',
        'object-shorthand': 'error',
        'prefer-destructuring': [
            'error',
            {
                VariableDeclarator: {
                    array: false,
                    object: true,
                },
                AssignmentExpression: {
                    array: false,
                    object: false,
                },
            },
        ],
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/no-use-before-define': ['error', {functions: false, variables: true}],
        eqeqeq: ['error', 'smart'],
        'no-nested-ternary': 'error',
        'react/react-in-jsx-scope': 0,
        'react/jsx-boolean-value': 'error',
        'react/display-name': [0],
        'react/prop-types': 'error',
        'react/no-unused-prop-types': 'error',
        'react/default-props-match-prop-types': 'error',
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'function-declaration',
                unnamedComponents: 'arrow-function',
            },
        ],
        'react/jsx-curly-brace-presence': 'error',
        'react/self-closing-comp': 'error',
        'prettier/prettier': 'error',
    },
});
