const { FlatCompat } = require('@eslint/eslintrc');
const legacyConfig = require('./.eslintrc.json');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const legacyRuleReplacements = {
  '@typescript-eslint/lines-between-class-members': 'lines-between-class-members',
  '@typescript-eslint/no-throw-literal': 'no-throw-literal',
  '@typescript-eslint/padding-line-between-statements': 'padding-line-between-statements',
  '@typescript-eslint/sort-type-union-intersection-members': '@typescript-eslint/sort-type-constituents',
  '@typescript-eslint/no-duplicate-imports': 'no-duplicate-imports',
};
const removedLegacyRules = ['@typescript-eslint/ban-types', '@typescript-eslint/no-parameter-properties'];

module.exports = [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'extension/',
      '.yarn/',
      '.pnp.js',
      'src/common/template/template.js',
      'src/common/libs/keymaster.js',
      'src/ContentScript/ui/toast/toast.js',
    ],
  },
  ...compat.config(legacyConfig).map(config => {
    if (!config.rules) {
      return config;
    }

    const rules = { ...config.rules };

    Object.entries(legacyRuleReplacements).forEach(([legacyRule, replacementRule]) => {
      if (rules[legacyRule]) {
        rules[replacementRule] = rules[legacyRule];
        delete rules[legacyRule];
      }
    });
    removedLegacyRules.forEach(rule => delete rules[rule]);
    rules['@typescript-eslint/explicit-member-accessibility'] = 'off';
    rules['@typescript-eslint/member-ordering'] = 'off';
    rules['@typescript-eslint/no-empty-interface'] = 'off';
    rules['react/no-unused-class-component-methods'] = 'off';

    if (config.languageOptions && config.languageOptions.parser && config.languageOptions.parser.meta && config.languageOptions.parser.meta.name === 'typescript-eslint/parser') {
      return {
        ...config,
        languageOptions: {
          ...config.languageOptions,
          parserOptions: {
            ...config.languageOptions.parserOptions,
            project: './tsconfig.json',
            tsconfigRootDir: __dirname,
          },
        },
        rules,
      };
    }

    return {
      ...config,
      rules,
    };
  }),
];
