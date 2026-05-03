const path = require('path')
const metaEnv = require('./rn-imports-env')
const envJson = require('./.env.json')

const breweryTsconfig = require('@app-brew/brewery/tsconfig.paths.json')

// @app-brew integration packages — these use @gauntlet/* aliases
// that need to be resolved via their tsconfig.paths.json
const integrationConfigs = [
  { tsconfig: require('@app-brew/judgeme/tsconfig.paths.json'), pkg: '@app-brew/judgeme' },
  { tsconfig: require('@app-brew/appbrew/tsconfig.paths.json'), pkg: '@app-brew/appbrew' },
  { tsconfig: require('@app-brew/facebook/tsconfig.paths.json'), pkg: '@app-brew/facebook' },
  { tsconfig: require('@app-brew/loox/tsconfig.paths.json'), pkg: '@app-brew/loox' },
  { tsconfig: require('@app-brew/rich-size-guide/tsconfig.paths.json'), pkg: '@app-brew/rich-size-guide' },
  { tsconfig: require('@app-brew/stamped/tsconfig.paths.json'), pkg: '@app-brew/stamped' },
]

const PREFER_IOS = [
  '.ios.ts',
  '.ios.tsx',
  '.android.ts',
  '.android.tsx',
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
]

const PREFER_ANDROID = [
  '.android.ts',
  '.android.tsx',
  '.ios.ts',
  '.ios.tsx',
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
]

function addPathsFromTsconfig(aliases, tsconfig, packageRoot) {
  const paths = tsconfig.compilerOptions?.paths || {}
  for (const [key, values] of Object.entries(paths)) {
    const aliasKey = key.replace('/*', '')
    if (values.length > 0) {
      const tsconfigPath = values[0].replace('/*', '')
      aliases[aliasKey] = path.resolve(packageRoot, tsconfigPath)
    }
  }
}

function getTsconfigAliases() {
  const aliases = {}

  // Add brewery paths
  const breweryRoot = path.dirname(require.resolve('@app-brew/brewery/package.json'))
  addPathsFromTsconfig(aliases, breweryTsconfig, breweryRoot)

  // Add integration paths
  for (const { tsconfig, pkg } of integrationConfigs) {
    const pkgRoot = path.dirname(require.resolve(`${pkg}/package.json`))
    addPathsFromTsconfig(aliases, tsconfig, pkgRoot)
  }

  return aliases
}

function getPlatformExtensions(platform) {
  if (platform === 'android') {
    return PREFER_ANDROID
  }
  return PREFER_IOS
}

module.exports = function (api) {
  // Get platform from Metro - it passes this through the caller API
  const platform = api.caller((caller) => caller?.platform) || 'android'
  const isDev = api.env('development')
  // Disable caching to ensure platform updates properly
  api.cache(false)
  let plugins = []
  let commonPlugins = [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: getTsconfigAliases(),
        extensions: getPlatformExtensions(platform),
      },
    ],
    '@babel/plugin-transform-export-namespace-from',
    'react-native-worklets/plugin',
  ]

  //production build plugins
  if (!isDev) {
    if (envJson) plugins.push([metaEnv, { env: envJson }])
  }
  plugins = plugins.concat(commonPlugins)
  return {
    presets: [['module:@react-native/babel-preset']],
    plugins: plugins,
  }
}
