const debug = require('debug')('cypress:server:ts-node')
const path = require('path')
const tsnode = require('ts-node')
const resolve = require('./resolve')

const getTsNodeOptions = (tsPath, pluginsFile) => {
  return {
    compiler: tsPath, // use the user's installed typescript
    compilerOptions: {
      module: 'CommonJS',
    },
    // resolves tsconfig.json starting from the plugins directory
    // instead of the cwd (the project root)
    dir: path.dirname(pluginsFile),
    transpileOnly: true, // transpile only (no type-check) for speed
  }
}

const register = (projectRoot, pluginsFile) => {
  try {
    debug('projectRoot path: %s', projectRoot)
    debug('pluginsFile: %s', pluginsFile)
    const tsPath = resolve.typescript(projectRoot)

    if (!tsPath) return

    debug('typescript path: %s', tsPath)

    const tsOptions = getTsNodeOptions(tsPath, pluginsFile)

    debug('registering project TS with options %o', tsOptions)

    require('tsconfig-paths/register')
    tsnode.register(tsOptions)
  } catch (err) {
    debug(`typescript doesn't exist. ts-node setup failed.`)
    debug('error message: %s', err.message)
  }
}

module.exports = {
  register,
}
