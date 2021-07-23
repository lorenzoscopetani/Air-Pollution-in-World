const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'development',
	entry: './src/js/index.js',
	devServer: {
		contentBase: './dist',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/templete.html',
			inject: 'body',
		}),
		new Dotenv(),
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
		assetModuleFilename: 'images/[name][ext][query]',
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.html$/,
				use: ['html-loader'],
			},
		],
	},
};
