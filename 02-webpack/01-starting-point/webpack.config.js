const path = require('path')

const config = {
    entry: './src/',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    mode: 'production'
}

module.exports = config;