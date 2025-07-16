import mix from 'laravel-mix';
import path from 'path';
import 'laravel-mix-clean';
import dotenv from 'dotenv';
import webpack from 'webpack';

// Load environment variables
const env = dotenv.config().parsed || {};

// Filter only REACT_APP_ variables
const envKeys = Object.keys(env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((acc, key) => {
        acc[`process.env.${key}`] = JSON.stringify(env[key]);
        return acc;
}, {});

// Add NODE_ENV if not present
if (!envKeys['process.env.NODE_ENV']) {
    envKeys['process.env.NODE_ENV'] = JSON.stringify(process.env.NODE_ENV || 'development');
}

mix.setPublicPath('.');

mix.clean({
    cleanOnceBeforeBuildPatterns: ['public/assets/app']
});

mix.disableNotifications();

mix.options({
    processCssUrls: false,
    manifest: false
});

mix.postCss('resources/views/react/css/app.css', 'public/assets/app/css');

mix.webpackConfig({
    plugins: [
        new webpack.DefinePlugin(envKeys),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'cache-loader',
                include: path.resolve('resources/views/react'),
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        usedExports: true,
        sideEffects: false,
        providedExports: true,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    output: {
        chunkFilename: 'public/assets/app/js/modules/[name].[contenthash].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
});

if (mix.inProduction()) {
    mix.js('resources/views/react/app.js', 'public/assets/app/js').react();
    mix.version();
} else {
    mix.js('resources/views/react/app.js', 'public/assets/app/js').react().sourceMaps();
}