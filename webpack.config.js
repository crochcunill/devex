const webpack = require('webpack');
const merge = require('webpack-merge');

const path = require('path');
const glob = require('glob');
const minimatch = require('minimatch');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

// various webpack goodies
const parts = require('./webpack.parts');

// application-specific PATHS
const paths = require('./paths');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const ASSET_PATH = process.env.ASSET_PATH || '/';

const envFile = {};
envFile['BASE_PATH'] = JSON.stringify('');
// Populate the env dict with Environment variables from the system
if (process.env) {
	Object.keys(process.env).map(key => {
		envFile[key] = JSON.stringify(process.env[key]);
	});
}
// Update the env dict with any in the .env file
if (dotenv.parsed) {
	Object.keys(dotenv.parsed).map(key => {
		envFile[key] = JSON.stringify(dotenv.parsed[key]);
	});
}

const BUILD_FILE_NAMES = {
	css: '[name].css',
	bundle: '[name].bundle.js',
	vendor: '[id].[chunkhash:4].js',
	assets: 'assets/[name].[hash:4].[ext]',
};

const commonConfig = merge([
	{
		entry: {
			vendor: [
				'angular',
				'angular-animate',
				'angular-breadcrumb',
				'angular-messages',
				'angular-mocks',
				'angular-resource',
				'angular-ui-notification',
				'angular-ui-router',
				'angular-ui-tinymce',
				'ng-img-crop',
				'ng-file-upload',
				'ng-idle',
				'angular-drag-and-drop-lists',
				'angular-sanitize',
				'jquery',
				'bootstrap',
				'ui-bootstrap4'
			],
			main: [
				'./modules/core/client/app/config.js',
				'./modules/core/client/app/init.js',
			].concat(
				glob.sync('./modules/*/client/*.js'),
				glob.sync('./modules/*/client/**/*.js', {
					ignore: [
						'./modules/*/client/*.js',
						'./main.js',
						'./modules/core/client/app/config.js',
						'./modules/core/client/app/init.js'
					]
				}),
			),
		},
		resolve: {
			// These files are tried when trying to resolve a directory...
			//  - i.e. require("/some/dir") -> require("some/dir/index.js")
			mainFiles: ['index', 'compile/minified/ng-img-crop']
		},
	},
	parts.setEnvironmentVariables(envFile),
	parts.loadFonts({
		urlLoaderOptions: {
			// Inline files smaller than 10 kB (10240 bytes)
			limit: 10 * 1024,
		}
	}),
	{
		plugins: [
			new webpack.ProvidePlugin({
				jQuery: 'jquery'
			}),
		],
	}
]);

const devConfig = merge([
	{
		output: {
			path: paths.build,
			publicPath: ASSET_PATH,
			filename: BUILD_FILE_NAMES.bundle,
		},
	},
	parts.generateSourceMaps({
		type: "source-map",
	}),
	parts.devServer({
		// Parse host and port from env to allow customization.
		//
		// If you use Docker, set
		// host: HOST || "0.0.0.0";
		//
		// 0.0.0.0 is available to all network devices
		// unlike default `localhost`.
		host: HOST || '0.0.0.0',
		port: PORT,
	}),
	parts.loadCSS(),
	parts.loadTinyMCE(),
	parts.loadImages({
		urlLoaderOptions: {
			// Inline files smaller than 10 kB (10240 bytes)
			limit: 10 * 1024,
		}
	}),
]);

const prodConfig = merge([
	{
		output: {
			path: paths.build,
			publicPath: ASSET_PATH,
			chunkFilename: BUILD_FILE_NAMES.vendor,
			filename: BUILD_FILE_NAMES.bundle,
		},
	},
	parts.clean(paths.build),
	parts.extractCSS({
		filename: BUILD_FILE_NAMES.css,
	}),
	parts.loadTinyMCE(),
	parts.loadImages({
		urlLoaderOptions: {
			// Inline files smaller than 10 kB (10240 bytes)
			limit: 10 * 1024,
		},
	}),
	parts.minifyJS(),
]);

module.exports = (mode) => {
	// return env-specific configuration - i.e. dev vs prod
	const config = mode === PRODUCTION ? prodConfig : devConfig;
	return merge(commonConfig, config, { mode });
};
