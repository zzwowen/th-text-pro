// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import router from './router'
//import '3clearlz-ui/style/index.css';
//import _3clearlzui from '3clearlz-ui';
//Vue.use(_3clearlzui.src_install);
//Vue.prototype.$ELEMENT = {
//	size: 'small'
//};
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
Vue.config.productionTip = false
import store from './store'
/* eslint-disable no-new */
import 'register/';

router.routerAsyncFun(function(router) {
	let vueApp = new Vue({
		el: '#app',
		data() {
			return {
				eventBus: new Vue()
			};
		},
		router,
		store,
		template: '<App/>',
		components: {
			App
		}

	});
	router.beforeEach((to, from, next) => {
		//		store.dispatch('skeleton/show_skeleton');
		NProgress.start();
		next();
	});
	router.afterEach(transition => {
		NProgress.done();

		setTimeout(() => {

			store.dispatch('skeleton/hide_skeleton');
		
		}, 300);

	});

});