const mix = require('laravel-mix');

mix.postCss('resources/views/react/css/app.css', 'public/assets/css')
mix.js('resources/views/react/app.js', 'public/assets/js').sourceMaps()
    .react()
    .webpackConfig(require('./webpack.config'));

if (mix.inProduction()) {
    mix.version();
}
