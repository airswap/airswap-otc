const { addBabelPlugin, override, overrideDevServer } = require('customize-cra') // eslint-disable-line
const fs = require('fs') // eslint-disable-line

module.exports = {
  webpack(config, env) {
    const overridedConfig = override(
      addBabelPlugin('react-intl-auto'),
      env === 'production' ? addBabelPlugin('transform-remove-console') : undefined,
    )(config, env)
    if (env !== 'production') {
      overridedConfig.devtool = 'cheap-module-source-map'
    }
    return overridedConfig
  },
  devServer: overrideDevServer(config => {
    const headers = config.headers || {}
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization'
    headers['Access-Control-Allow-Origin'] = '*'
    return {
      ...config,
      headers,
    }
  }),
}
