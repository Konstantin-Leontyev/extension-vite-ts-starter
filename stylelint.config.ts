import { type Config } from 'stylelint';

/** block[-name][__element[-name]][_mod[-name]]* — classic BEM with `_` modifiers (Yandex). */
const bemClassPattern =
  '^[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(_[a-z0-9]+(-[a-z0-9]+)*)*$';

const config: Config = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  ignoreFiles: ['**/fonts/', '**/images/', 'dist/**'],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-blockless', 'first-nested'],
      },
    ],
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
      },
    ],
    'comment-whitespace-inside': 'always',
    'declaration-block-single-line-max-declarations': 1,
    'declaration-empty-line-before': 'never',
    'font-family-name-quotes': 'always-unless-keyword',
    'function-url-no-scheme-relative': true,
    'number-max-precision': 3,
    'order/order': ['custom-properties', 'declarations'],
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
      },
    ],
    'selector-attribute-quotes': 'always',
    'selector-class-pattern': bemClassPattern,
  },
};

export default config;
