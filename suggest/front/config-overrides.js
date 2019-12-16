const path = require('path')
const { override, addWebpackAlias, addLessLoader } = require('customize-cra');
module.exports = {
  webpack: override(
    addLessLoader({
      javascriptEnabled: true
    }),
    addWebpackAlias({
      '@': path.resolve(__dirname, './src'),
      'pages': path.resolve(__dirname, './src/pages'),
      'assets': path.resolve(__dirname, './src/assets'),
      'components': path.resolve(__dirname, './src/components'),
      'http': path.resolve(__dirname, './src/http')
    })
  )
}