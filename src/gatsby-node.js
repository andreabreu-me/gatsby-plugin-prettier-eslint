import mergeWith from "lodash.mergewith";
import { PrettierEslintWatcher } from "./watcher";

const defaultOptions = {
  cwd: process.cwd(),
  watch: true,
  initialScan: true,
  onChangeFullScanLint: false,
  onChangeFullScanFormat: false,
  prettierLast: false,
  ignorePatterns: [
    "**/node_modules/**/*",
    "**/.git/**/*",
    "**/dist/**/*",
    ".cache/**/*",
    "public/**/*",
  ],
  prettier: {
    patterns: [],
    ignorePatterns: [],
    customOptions: {},
  },
  eslint: {
    patterns: [],
    ignorePatterns: [],
    formatter: "stylish",
    maxWarnings: undefined,
    emitWarning: true,
    failOnError: false,
    failOnWarning: false,
    plugins: [],
    customOptions: {},
  },
};

function extendDefaultOptions(options) {
  // do not merge pure arrays values
  return mergeWith(defaultOptions, options, (obj, src) => {
    if (
      Array.isArray(obj) &&
      obj.every((item) => !(Array.isArray(item) || typeof item === "object"))
    ) {
      return src;
    }
  });
}

let isInitialized = false;

// eslint-disable-next-line import/prefer-default-export
export function onCreateWebpackConfig(_, pluginOptions) {
  const options = extendDefaultOptions(pluginOptions);

  if (isInitialized) return;

  const watcher = new PrettierEslintWatcher(options);

  try {
    if (options.watch) {
      watcher.start();
    } else if (options.initialScan) {
      watcher.fullScan();
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  isInitialized = true;
}
