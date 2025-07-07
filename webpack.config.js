const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//# =======================================

const mix = require('laravel-mix');
require('laravel-mix-clean');

mix.setPublicPath('public');

mix.clean({
    cleanOnceBeforeBuildPatterns: ['public/assets/app'],
});

mix.disableNotifications();

mix.options({
    processCssUrls: false,
    manifest: false
});

mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: 'cache-loader',
                include: path.resolve('resources/views/react'),
            },
        ],
    },
    optimization: {
        usedExports: true,
        sideEffects: true,
        providedExports: true
    },
    output: {
        chunkFilename: 'assets/app/js/modules/[name].[contenthash].js',
        publicPath: '/',
    }
});

mix.postCss('resources/views/react/css/app.css', 'public/assets/app/css');

if (mix.inProduction()) {
    mix.js('resources/views/react/app.js', 'public/assets/app/js').react();
    mix.version();
} else {
    mix.js('resources/views/react/app.js', 'public/assets/app/js').react().sourceMaps();
}
