const path = require('path');

module.exports = {
    entry: './src/main.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [path.resolve(__dirname, 'src')],
                use: 'ts-loader',
            }
        ]
    },
    devServer: {
        contentBase: './dist',
    },
    devtool: 'eval-source-map',
    resolve: {
        extensions: [ '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};