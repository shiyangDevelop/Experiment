const path = require('path')
const { override, addWebpackAlias, addLessLoader } = require('customize-cra');

module.exports = {
  webpack: override(
    addLessLoader({
      javascriptEnabled: true,
      localIdentName: '[local]__[hash:base64:5]'
    }),
    addWebpackAlias({
      '@': path.join(__dirname, './src')
    })
  )
}