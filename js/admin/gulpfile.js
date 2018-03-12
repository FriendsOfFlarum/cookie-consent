var flarum = require('flarum-gulp');

flarum({
  modules: {
    'zaptech/cookie-consent': [
      'src/**/*.js'
    ]
  }
});