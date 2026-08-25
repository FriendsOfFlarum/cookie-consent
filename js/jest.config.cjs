const config = require('@flarum/jest-config')();

module.exports = {
  ...config,
  // Stylesheets are handled by webpack's style-loader at build time; Jest
  // cannot parse them, so map them to a stub.
  moduleNameMapper: {
    '\\.css$': '<rootDir>/tests/stubs/style.cjs',
    ...config.moduleNameMapper,
  },
};
