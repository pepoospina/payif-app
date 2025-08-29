const base = require("./craco.config");
const webpack = require("webpack");
const orgPlugins = base.webpack.configure.plugins;

const ix = orgPlugins.findIndex((e) => {
  return e.definitions !== undefined;
});
const definePlugin = orgPlugins[ix];

/** remove original define plugin */
base.webpack.configure.plugins.splice(ix, 1);

/** new copy of plugins without the org define one */
const newPlugins = [...base.webpack.configure.plugins];

if (!process.env.FB_PROJECT) {
  throw new Error("FB_PROJECT is not set");
}

if (process.env.FB_PROJECT === "production") {
  base.webpack.configure.plugins = [
    ...newPlugins,
    new webpack.DefinePlugin({
      ...definePlugin.definitions,
      process: {
        ...definePlugin.definitions.process,
        env: {
          ...definePlugin.definitions.process.env,
          NODE_ENV: '"production"',
          FUNCTIONS_BASE: '"https://api-hgvdeqc6mq-ew.a.run.app"',
          FB_APIKEY: '"AIzaSyBMPrihDW25bftg0IBTKSahl0yjxDHzaOo"',
          FB_AUTHDOMAIN: '"cervesera-osona.firebaseapp.com"',
          FB_PROJECTID: '"cervesera-osona"',
          FB_STORAGE_BUCKET: '"cervesera-osona.firebasestorage.app"',
          FB_MESSAGING_SENDER_ID: '"871655215341"',
          FB_APPID: '"1:871655215341:web:eef3d4cbcb027fe53cbce4"',
          APP_URL: '"https://cervesera.cat"',
        },
      },
    }),
  ];
}

module.exports = base;
