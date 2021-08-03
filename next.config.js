const withSvgr = require('next-svgr')

module.exports = withSvgr({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  reactStrictMode: true,
})
