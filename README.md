# vue-element-admin-qiankun
主应用


利用vue脚手架创建一个vue2.0项目：qiankun-main（vue create qiankun-main），建议选择手动模式可以将Router勾选上，并且需要使用history路由模式
打开项目qiankun-main，安装qiankun（npm install qiankun --save）
修改App.vue，新增一个VueChild的router-link，to值为“/vueChild”，并在router-view的下方新增一个id为vueContainer的div盒子（用于承载子应用）
修改views/Home.vue，将默认内容删除，并改为： This is a home page in qiankun-main（非必须，可根据自己喜好随便改动，也可使用默认内容）
修改views/About.vue，将内容改为：This is an about page in qiankun-main（非必须，可根据自己喜好随便改动，也可使用默认内容）
修改main.js，导入qiankun中的registerMicroApps和start两个方法，注册子应用并启动qiankun

下面看下修改后的完整代码（创建项目和安装qiankun的步骤就省略了）

html复制代码<!-- App.vue -->
<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link> |
			<router-link to="/about">About</router-link> |
			<router-link to="/vueChild">VueChild</router-link> | <!--新增部分-->
		</div>
		<router-view />
		<div id="vueContainer"></div><!--新增部分，用于承载子应用-->
	</div>
</template>

<!-- views/Home.vue -->
<template>
	<div class="home">This is a home page in qiankun-main</div>
</template>

<!-- views/About.vue -->
<template>
	<div class="home">This is an about page in qiankun-main</div>
</template>

javascript复制代码// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
//======================新增内容开始===============================
import {registerMicroApps, start} from 'qiankun' //新增部分，导入qiankun中的两个方法
const apps = [
{
	name:'qiankun-child', //子应用的名称
	entry:'//localhost:8082',//子应用的域名
	container:'#vueContainer',//承载子应用的容器，在上面App.vue中定义
	activeRule:'/vueChild', // 被激活的子应用的路由
}
]
registerMicroApps(apps);//注册子应用
start();//启动qiankun
//======================新增内容结束===============================
new Vue({
	router,
	render: h => h(App)
}).$mount('#app');

// router/index.js
//...省略原有不需修改的代码，以下是修改后的代码
const router = new VueRouter({
	mode:'history',
	base: '',
	routes
})

微应用

微应用中主要需要修改的地方有三个文件：main.js、vue.config.js和router/index.js，其余页面部分根据自己喜好可改可不改，本文为了便于区分主子应用的内容将对Home.vue和About.vue页面进行微小的改动

利用vue脚手架创建一个vue2.0项目：qiankun-child（vue create qiagainkun-child），建议选择手动模式可以将Router勾选上，并且需要使用history路由模式
修改views/Home.vue，在原有内容的基础上新增语句：“This is a home page in qiankun-child”（根据个人喜好，可改可不改）
修改views/About.vue，将内容改为：“This is an about page in qiankun-child”（根据个人喜好，可改可不改）
修改main.js（必需）

将创建Vue实例的代码部分提取到一个函数render中，render函数接收一个参数props
判断window.__ POWERED_BY_QIANKUN __，如果是从qiankun启动则将window. __ INJECTED_PUBLIC_PATH_BY_QIANKUN __ 的值赋值给 __ webpack_public_path __ ，否则直接调用render方法表示子应用是独立运行
导出3个必需的方法bootstrap，mount和unmount；bootstrap函数体内容可为空但函数必须要导出。mount函数中调用render方法进行子应用渲染。unmount函数中将render方法中创建的vue实例销毁。


修改router/index.js，指定base值为：“/vueChild”
创建vue.config.js，在该文件中配置允许跨域：“ Access-Control-Allow-Origin：'*' ”，并配置webpack的output.library和output.libraryTarget

各部分完整代码如下：、

html复制代码<!--======================== views/Home.vue ====================-->
<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png" />
		<h1 style="color:red;">This is a home page in qiankun-child</h1>
		<HelloWorld msg="Welcome to Your Vue.js App" />
	</div>
</template>

<!--======================== views/About.vue ====================-->
<template>
	<div class="About">		
		This is an about page in qiankun-child
	</div>
</template>

javascript复制代码// main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

let instance = null; //设置全局变量，用于保存或销毁Vue实例
function render(props){
	const { container } = props;
	instance = new Vue({
		router,
		render: h => h(App)
	}).$mount(container ? container.querySelector("#app") : "#app");//用于限定当前上下文下的#app，防止与主应用中的#app冲突
}

if(window.__POWERED_BY_QIANKUN__){
	__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}else{
	render();
	console.log('子应用独立运行')
}

export async function bootstrap(props){
	console.log('这里暂时可以什么都不用做，但方法必须要导出')
}

export async function mount(props){
	render(props);//从qiankun启动
}

export async function unmount(props){
	instance.$destroy();//销毁子应用实例
}

javascript复制代码//vue.config.js
module.exports = {
	devServer:{
		port:8082,
		headers:{
			"Access-Control-Allow-Origin": "*"
		}
	},
	configureWebpack:{
		output:{
			library:'qiankun-child',
			libraryTarget:'umd'
		}
	}
}

javascript复制代码// router/index.js
// ...原有代码省略
//修改后的代码
const router = new VueRouter({
	mode:'history',
	base:'/vueChild',
	routes
});

启动应用

以上就是主应用和子应用的完整代码了，代码实现了下面我们就把它运行起来看一下实现效果。
分别在主应用qiankun-main和子应用qiankun-child的terminal中运行npm run serve来启动两个应用，然后分别打开2个链接地址，我们发现：主应用中除本身自有内容外，还可以通过点击VueChild链接把子应用中的内容也加载过来。而打开子应用的链接同样子应用也能够独立运行不受影响。这就是微前端的魅力所在。

作者：西瓜watermelon
链接：https://juejin.cn/post/7026341892707057694
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
