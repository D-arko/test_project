const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api-v1',
    createProxyMiddleware({
      target: 'https://api.bitfinex.com/',
      changeOrigin: true,
    })
  );
  app.use(
    '/api-v2',
    createProxyMiddleware({
      target: 'https://api-pub.bitfinex.com/',
      changeOrigin: true,
    })
  );
}