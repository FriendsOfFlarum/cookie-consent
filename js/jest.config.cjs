const config = require('@flarum/jest-config')();

module.exports = {
  ...config,
  // Stylesheets are handled by webpack's style-loader at build time; Jest
  // cannot parse them, so map them to a stub.
  // Webpack resolves the library's ESM build, which Jest cannot load here;
  // point tests at the equivalent UMD bundle so they exercise the real library
  // rather than a mock.
  moduleNameMapper: {
    '^vanilla-cookieconsent$': '<rootDir>/node_modules/vanilla-cookieconsent/dist/cookieconsent.umd.js',
    '\\.css$': '<rootDir>/tests/stubs/style.cjs',
    ...config.moduleNameMapper,
  },
};
