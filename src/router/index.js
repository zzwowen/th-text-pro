import Vue from 'vue'
import Router from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);
Vue.use(Router);

import { Main, Content, Home } from '../layout';

const routerCfg = {
	'Home': Home,
	'Main': Main,
	'Content': Content
};

let env = process.env;
let promiseDef;

if(env['NODE_ENV'] === 'development') { //开发环境
	promiseDef =
		import("config/RouterConfig.json");		
} else { //生成环境
	let defaultUrl = 'static/config/routerConfig.json?' + new Date().getTime();
	promiseDef = Vue.axios({
		methods: 'get',
		headers: {},
		url: defaultUrl,
		baseURL: ''
	});
}

/**
 * 递归解析路由配置
 * @param cfgs
 */


// 创建FileSystemObject对象实例 

function parseRouter(cfgs) {
	
	for(let i = 0; i < cfgs.length; i++) {
		cfgs[i]['componentname'] = cfgs[i]['component'];
		if(routerCfg[cfgs[i]['component']]) {
			cfgs[i]['component'] = routerCfg[cfgs[i]['component']]
		} else {
			let t_url = cfgs[i]['component'];
			cfgs[i]['component'] = () =>
				import(`components/${t_url}/Module.vue`);
		}
		if(cfgs[i]['children'])
			parseRouter(cfgs[i]['children'])
	}

}

async function routerAsyncFun(callfun) {
	
	try {
		const res = await promiseDef;
		let routers = env['NODE_ENV'] === 'development' ? res : res.data;
		
		parseRouter(routers);
		callfun(new Router({
			
			routes: routers
		}))
	} catch(err) {
		callfun(new Router({
			
			routes: []
		}))
	}
}
export default {
	routerAsyncFun
};
