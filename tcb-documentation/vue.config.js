// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
//vue.config.js
module.exports = {
	devServer:{
		port:8081,
		headers:{
			"Access-Control-Allow-Origin": "*"
		}
	},
	configureWebpack:{
		output:{
			library:'tcb-docunmentation',
			libraryTarget:'umd'
		}
	}
}
