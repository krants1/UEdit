const packageJson = require('../../package.json');

export const environment = {
  production: true,
  appName: 'UEditor',
  appVersion: packageJson.version,
  envName: 'PROD',
  test: false,
  i18nPrefix: '',
  serverHost: window.location.hostname,
  serverPort: 8080,
  wsUrl: `ws://${window.location.hostname}:8080`,
  wsReconnectInterval: 2000,
  wsReconnectAttempts: 10
};
