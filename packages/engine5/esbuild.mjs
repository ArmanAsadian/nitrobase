import {createLogger} from '@alwatr/logger';
import {readJsonFileSync} from '@alwatr/util/node.js';

import {context, build} from 'esbuild';
// import packageJson from './package.json' assert { type: 'json' };

const packageJson = readJsonFileSync('./package.json');

const logger = createLogger('esbuild', true);
const watchMode = process.argv.includes('--watch');

(async () => {
  logger.logProperty?.('packageJson.esbuild', packageJson.esbuild);

  /**
   * @type {import('esbuild').BuildOptions}
   */
  const esbuildOptions = {
    logLevel: 'info',
    platform: 'node',
    target: 'es2020',
    format: 'esm',
    minify: true,
    // mangleProps: /_$/, // end with underscore
    treeShaking: true,
    sourcemap: false,
    sourcesContent: false,
    bundle: true,
    splitting: false,
    charset: 'utf8',
    legalComments: 'none',
    define: {
      __package_version: `'${packageJson.version}'`,
    },
    ...packageJson.esbuild,
  };

  if (watchMode) {
    logger.logOther?.('👀 Watching...');
    const esbuildContext = await context(esbuildOptions);
    esbuildContext.watch();
    return;
  }

  // else
  logger.logOther?.('🚀 Building...');
  await build(esbuildOptions);
  return;
})();
