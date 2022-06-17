const webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require('glob');

function getEntry() {
    const entry = {};
    glob.sync('./src/pages/**/index.ts').forEach((file) => {
        const name = file.match(/\/pages\/(.+)\/index.ts/)[1];
        entry[name] = file;
        console.log(entry)
    });
    return entry;
}

function getHtmlTemplate() {
  return glob
    .sync('./src/pages/**/index.html')
    .map((file) => {
      return { name: file.match(/\/pages\/(.+)\/index.html/)[1], path: file };
    })
    .map(
      (template) =>
        new HtmlWebpackPlugin({
          template: template.path,
          chunks: [template.name.toString()],
          filename: `${template.name}/index.html`,
        })
    );
}


module.exports = {
    entry: {
        index: './src/index.ts',
        ...getEntry(),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
    },
    devtool: 'inline-source-map',
    stats: {
        assets: true,
        children: true,

    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
            },

            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: true,

                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'font/[name][ext]'
                }
            },
        ]
    },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", ".ts", ".html"]
    },
    performance: {
        maxEntrypointSize: 700000,
        maxAssetSize: 700000,

    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            inject: 'body',
            chunks: ["index"],
            favicon: './src/assets/favicon.ico'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css"
        }),
        new CleanWebpackPlugin(),
    ].concat(...getHtmlTemplate()),
};
