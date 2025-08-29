const webpack = require("webpack");

const localEnv = {
  NODE_ENV: '"development"',
  FUNCTIONS_BASE: '"http://127.0.0.1:5001/demo-project/us-central1/api"',
  FB_PROJECTID: '"demo-project"',
  APP_URL: '"http://127.0.0.1:3000"',
  PUBLIC_PRIVY_APP_ID: '"cmex0h8fk01e3l80bfj1fcqjr"',
  PUBLIC_PRIVY_CLIENT_ID:
    '"client-WY6PsXsnJT8M18Lh9zfX8W6Mt86fmNrQAgYZeqnPSs4f3"',
};

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {},
      },
      plugins: [
        new webpack.DefinePlugin({
          process: {
            browser: true,
            env: localEnv,
          },
        }),
      ],
    },
  },
  plugins: [],
  localEnv,
};
