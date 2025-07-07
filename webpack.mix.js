import mix from 'laravel-mix';
import path from 'path';
import 'laravel-mix-clean';

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
        chunkFilename: 'public/assets/app/js/modules/[name].[contenthash].js'
    }
});

if (mix.inProduction()) {
    mix.js('resources/views/react/app.js', 'public/assets/app/js').react();
    mix.version();
    // mix.minify('public/public/assets/app/js/app.js');
    // mix.minify('public/public/assets/app/css/app.css');
} else {
    mix.js('resources/views/react/app.js', 'public/assets/app/js').react().sourceMaps();
}