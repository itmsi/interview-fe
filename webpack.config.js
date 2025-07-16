const path = require('path');
const mix = require('laravel-mix');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
require('dotenv').config();

// Load environment variables
const webpack = require('webpack');
const envKeys = Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(process.env[key]);
        return acc;
}, {});

// Add NODE_ENV if not present
if (!envKeys['process.env.NODE_ENV']) {
    envKeys['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV || 'development');
}

mix.setPublicPath('public');

mix.disableNotifications();

mix.options({
    processCssUrls: false,
    manifest: false
});

mix.webpackConfig({
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['assets/app/js/**/*', 'assets/app/css/**/*'],
            cleanStaleWebpackAssets: false,
            protectWebpackAssets: false
        }),
        new webpack.DefinePlugin(envKeys),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'cache-loader',
                include: path.resolve('resources/views/react'),
            },
        ],
    },
    optimization: {
        usedExports: true,
        sideEffects: false,
        providedExports: true
    },
    output: {
        chunkFilename: 'assets/app/js/modules/[name].[contenthash].js',
        publicPath: '/',
    },
    resolve: { // Added: resolve extensions
        extensions: ['.js', '.jsx', '.json'],
    },
});

mix.postCss('resources/views/react/css/app.css', 'public/assets/app/css');

if (mix.inProduction()) {
    mix.js('resources/views/react/app.js', 'public/assets/app/js').react();
    mix.version();
} else {
    mix.js('resources/views/react/app.js', 'public/assets/app/js').react().sourceMaps();
}
