export default {
	input: 'src/index.js',
	output: {
		format: 'cjs',
		file: 'lib/index.js'
	},
	external: [ 'koa', 'koa-router', 'koa-logger','koa-bodyparser','@koa/cors','apollo-server-koa', 'lodash.merge' ,'graphql-type-json' ,'graphql-tools' ,'request-promise-native' ,'graphql'  ]
};
