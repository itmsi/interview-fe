const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load .env file
const env = dotenv.config().parsed || {};

// Convert ke bentuk DefinePlugin
const envKeys = Object.keys(env).reduce((acc, key) => {
    acc[`process.env.${key}`] = JSON.stringify(env[key]);
    return acc;
}, {});

module.exports = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/views/react'),
        },
    },
    plugins: [
        new webpack.DefinePlugin(envKeys)
    ]
};
