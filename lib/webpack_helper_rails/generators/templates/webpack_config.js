import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import CommonsChunkPlugin from "webpack/lib/optimize/CommonsChunkPlugin";
import UglifyJsPlugin from "webpack/lib/optimize/UglifyJsPlugin";
import OccurrenceOrderPlugin from "webpack/lib/optimize/OccurrenceOrderPlugin";
import {LoaderOptionsPlugin, DefinePlugin, NamedModulesPlugin} from "webpack";
import ManifestPlugin from "webpack-manifest-plugin";
// https://github.com/webpack/webpack/issues/1315

const nodeEnv = process.env.NODE_ENV || "development";
const assetUrl = process.env.ASSET_URL || "/assets/"; // "https://my_app.com/assets/"
const isProd = nodeEnv === "production";
const rootPath = path.resolve(__dirname);
const jsSourcePath = path.join(rootPath, "app", "assets", "javascripts", "webpack");
const distPath = path.join(rootPath, "public", "assets");
const manifestPath = path.join("..", "..", "config", "manifest.json");

const plugins = [
    new CommonsChunkPlugin({
        names: ["common", "manifest"],
        filename: isProd ? "[name].[chunkhash].js" : "[name].js",
        minChunks: 3
    }),
    new DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify(nodeEnv),
            ASSET_URL: JSON.stringify(assetUrl)
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
        chunkFilename: isProd ? "[id].[name].[chunkhash].js" : "[id].[name].js",
        path: distPath,
        publicPath: isProd ? assetUrl : "",
        filename: isProd ? "[name].[chunkhash].js" : "[name].js",
        pathinfo: !isProd
    },
    resolve: {
        extensions: [".js", ".scss", ".css", ".json", ".yaml", ".yml"]
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
                loaders: ExtractTextPlugin.extract({
                    notExtractLoader: "style-loader",
                    loader: isProd ? "css-loader!sass-loader" : "css-loader?sourceMap!sass-loader?sourceMap"
                }),
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loaders: ExtractTextPlugin.extract({
                    notExtractLoader: "style-loader",
                    loader: isProd ? "css-loader" : "css-loader?sourceMap"
                }),
                exclude: /node_modules/
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[name].[hash].[ext]"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/octet-stream&name=[name].[hash].[ext]"
            },
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?name=[name].[hash].[ext]"},
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml&name=[name].[hash].[ext]"
            },
            {test: /\.ya?ml$/, loaders: "json-loader!yaml-loader"}
        ]
    },
    plugins,
    stats: {colors: true, modules: true, reasons: true, errorDetails: true},
    devtool: "cheap-module-source-map"
};