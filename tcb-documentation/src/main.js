import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false

let instance = null; //设置全局变量，用于保存或销毁Vue实例
function render(props = false){
	const { container } = props;
	instance = new Vue({
		router,
    store,
		render: h => h(App)
	}).$mount(container ? container.querySelector("#app") : "#app");//用于限定当前上下文下的#app，防止与主应用中的#app冲突
}

if(window.__POWERED_BY_QIANKUN__){
	__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}else{
	render();
	console.log('documentation子应用独立运行')
}

export async function bootstrap(props){
	console.log('documentation这里暂时可以什么都不用做，但方法必须要导出')
}

export async function mount(props){
	render(props);//从qiankun启动
}

export async function unmount(props){
	instance.$destroy();//销毁子应用实例
}


