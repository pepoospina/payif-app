const webpack = require('webpack')

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          os: require.resolve('os-browserify'),
        },
      },
      plugins: [
        new webpack.DefinePlugin({
          process: {
            browser: true,
            env: {
              NODE_ENV: '"development"',
              MAGIC_API_KEY: '"pk_live_5BF359361B5DB7B0"',
              ALCHEMY_KEY: '"viTuemX_zq3RT6PAr-OoRGTQNyEsIBHp"',
              ALCHEMY_KEY_ENS: '"fzFr4jkXrpoVie58udU1CMy0QX1u2nCn"',
              WALLETCONNECT_PROJECT_ID: '"f4af653bc3358f5a8b85cd00ea7ffe9b"',
              FUNCTIONS_BASE: '"http://127.0.0.1:5001/microrevolutions-a6bcf/europe-west1"',
              ALCHEMY_GAS_POLICY_ID: '"fda2c24b-d900-4937-b2e2-e57c9e9f3931"',
            },
          },
        }),
      ],
      ignoreWarnings: [
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          )
        },
      ],
    },
  },
  plugins: [],
}
