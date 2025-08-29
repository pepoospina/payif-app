const webpack = require("webpack");

const localEnv = {
  NODE_ENV: '"development"',
  FUNCTIONS_BASE: '"http://127.0.0.1:5001/demo-project/us-central1/api"',
  FB_PROJECTID: '"demo-project"',
  PROJECT_TWITTER_ACCOUNT: '"Slowfeed.ai"',
  APP_URL: '"http://127.0.0.1:3000"',
  PUBLIC_CLERK_KEY:
    '"pk_test_Y29ycmVjdC13ZWV2aWwtNy5jbGVyay5hY2NvdW50cy5kZXYk"',
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
