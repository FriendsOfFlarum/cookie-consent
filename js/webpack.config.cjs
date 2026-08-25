const { merge } = require('webpack-merge');

const baseConfig = require('flarum-webpack-config')();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return merge(baseConfig, {
    module: {
      rules: [
        {
          test: /\.css$/,
          // Flarum doesn't serve CSS from js/dist, so the library's stylesheet
          // is bundled into the JavaScript and injected by style-loader at
          // runtime. Importing it from node_modules keeps it in lockstep with
          // the installed version.
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: !isProduction,
                url: false,
              },
            },
          ],
        },
      ],
    },
  });
};
