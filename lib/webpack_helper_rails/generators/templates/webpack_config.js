import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import CommonsChunkPlugin from "webpack/lib/optimize/CommonsChunkPlugin";
import UglifyJsPlugin from "webpack/lib/optimize/UglifyJsPlugin";
import OccurrenceOrderPlugin from "webpack/lib/optimize/OccurrenceOrderPlugin";
import {LoaderOptionsPlugin, DefinePlugin, NamedModulesPlugin} from "webpack";
import ManifestPlugin from "webpack-manifest-plugin";
// https://github.com/webpack/webpack/issues/1315

const nodeEnv = process.env.NODE_ENV || "development";
const assetDst = process.env.ASSET_DST || "public/assets";
const assetUrl = process.env.ASSET_URL || "/assets/"; // "https://my_app.com/assets/"
const manifestPath = process.env.MANIFEST_PATH || "../../config/manifest.json";
const isProd = nodeEnv === "production";
const rootPath = path.resolve(__dirname);
const jsSourcePath = path.join(rootPath, "app", "assets", "javascripts");
const cssSourcePath = path.join(rootPath, "app", "assets", "stylesheets");
const imagesSourcePath = path.join(rootPath, "app", "assets", "images");
const distPath = path.join(rootPath, assetDst);
const fileLoaderOptions = {limit: 10000, name: isProd ? '[name].[hash].[ext]' : '[name].[ext]'};
const outputFileName = isProd ? "[name].[chunkhash].js" : "[name].js";
const useSourceMap = !isProd;

const plugins = [
    new CommonsChunkPlugin({
        names: ["common", "manifest"],
        filename: outputFileName,
        minChunks: 3
    }),
    new DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify(nodeEnv),
            ASSET_URL: JSON.stringify(assetUrl),
            ASSET_DST: JSON.stringify(assetDst),
            MANIFEST_PATH: JSON.stringify(manifestPath)
        }
    }),
    new ManifestPlugin({publicPath: assetUrl, fileName: manifestPath})
];

if (isProd) {
    plugins.push(
        new LoaderOptionsPlugin({minimize: true, debug: false}),
        new UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        }),
        new ExtractTextPlugin({filename: "[name].[contenthash].css"}),
        new OccurrenceOrderPlugin()
    );
} else {
    plugins.push(
        new NamedModulesPlugin(),
        new LoaderOptionsPlugin({minimize: false, debug: true}),
        new ExtractTextPlugin({filename: "[name].css"})
    );
}

export default {
    context: rootPath,
    entry: {
        main: path.join(jsSourcePath, "main.js")
    },
    output: {
        path: distPath,
        publicPath: assetUrl,
        filename: outputFileName,
        pathinfo: !isProd
    },
    resolve: {
        extensions: ["*", ".js"],
        modules: [jsSourcePath, cssSourcePath, "node_modules"],
        alias: {
            Images: imagesSourcePath
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {presets: ["es2015", "stage-3"]},
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {loader: "css-loader", options: {sourceMap: useSourceMap}},
                        {loader: "sass-loader", options: {sourceMap: useSourceMap}}
                    ]
                })
            },
            {test: /\.ya?ml$/, loaders: "json-loader!yaml-loader"},
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loaders: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{loader: "css-loader", options: {sourceMap: useSourceMap}}]
                })
            },
            {
                test: /\.(eot|png|jpe?g)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader",
                options: fileLoaderOptions
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                options: {mimetype: 'application/font-woff', ...fileLoaderOptions}
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                options: {mimetype: 'application/octet-stream', ...fileLoaderOptions}
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader",
                options: {mimetype: 'image/svg+xml', ...fileLoaderOptions}
            }
        ]
    },
    plugins,
    stats: {colors: true, modules: true, reasons: true, errorDetails: true},
    devtool: "cheap-module-source-map"
};