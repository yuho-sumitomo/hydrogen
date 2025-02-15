import {renderSelectPrompt} from '@shopify/cli-kit/node/ui';
import {AbortSignal} from '@shopify/cli-kit/node/abort';
import type {CssSetupConfig} from './common.js';
import type {CssStrategy} from './assets.js';
import {setupTailwind} from './tailwind.js';
import {setupPostCss} from './postcss.js';
import {setupCssModules} from './css-modules.js';
import {setupVanillaExtract} from './vanilla-extract.js';

export {type CssStrategy, SETUP_CSS_STRATEGIES} from './assets.js';

export const CSS_STRATEGY_NAME_MAP: Record<CssStrategy, string> = {
  tailwind: 'Tailwind',
  'css-modules': 'CSS Modules',
  'vanilla-extract': 'Vanilla Extract',
  postcss: 'CSS',
};

export function setupCssStrategy(
  strategy: CssStrategy,
  options: CssSetupConfig,
  force?: boolean,
) {
  switch (strategy) {
    case 'tailwind':
      return setupTailwind(options, force);
    case 'postcss':
      return setupPostCss(options, force);
    case 'css-modules':
      return setupCssModules(options);
    case 'vanilla-extract':
      return setupVanillaExtract(options);
    default:
      throw new Error('Unknown strategy');
  }
}

export async function renderCssPrompt<
  T extends string = CssStrategy,
>(options?: {abortSignal?: AbortSignal; extraChoices?: Record<T, string>}) {
  const cssStrategies = Object.entries({
    ...CSS_STRATEGY_NAME_MAP,
    ...options?.extraChoices,
  }) as [[CssStrategy | T, string]];

  return renderSelectPrompt<CssStrategy | T>({
    message: 'Select an internationalization strategy',
    ...options,
    choices: cssStrategies.map(([value, label]) => ({
      value,
      label,
    })),
    defaultValue: 'tailwind',
  });
}
