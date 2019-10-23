/**
 * Created by zzw on 2019/10/8.
 */
//在Vue原型链上注册全局对象和一些全局方法
//lodash jquery 在webpack中全局注册了
import Vue from 'vue';
import jquery from 'jquery'
import './chart/chart'
const env = process.env;
let GlobePlugin = {};
GlobePlugin.install = function(Vue, options) {
	//开发环境
	if(env['NODE_ENV'] === 'development') {
		//全局获取AppConfig
		import("../config/appConfig.json").then((cfg) => {
			Vue.prototype['$$appConfig'] = cfg;
			//			Vue.axios.defaults.baseURL = cfg['prjInfo']['webApi']['url'];
			//设置浏览器标签名称
			document.getElementsByTagName("title")[0].innerText = cfg.title;

		}).catch((err) => {
			Vue.prototype['$$appConfig'] = {};
		});
		
	}
	//生成环境
	else if(env['NODE_ENV'] === 'production') {
		let url = 'static/config/appConfig.json?' + new Date().getTime();
		jquery.ajax({
			url: url,
			type: 'get', //GET
			async: false, //或false,是否异步
			data: {},
			timeout: 5000, //超时时间
			dataType: 'json', //返回的数据格式：
			success: function(cfg, textStatus, jqXHR) {
				Vue.prototype['$$appConfig'] = cfg;
				Vue.axios.defaults.baseURL = cfg['prjInfo']['webApi']['url'];
				document.getElementsByTagName("title")[0].innerText = cfg.title;
			},
			error: function(xhr, textStatus) {
				Vue.prototype['$$appConfig'] = {};
			},
			complete: function(data) {

			}
		});
		
	}

	//  添加全局处理窗口大小变更方法
	Vue.prototype['$$resize'] = function(callFun) {
		jquery(window).resize(() => {
			if(this._statue !== 'CLOSE') {
				callFun.call(this);
			}
		});
		this.$root.eventBus.$on('toggleMenu', () => {
			if(this._statue !== 'CLOSE') {
				callFun.call(this);
			}
		});
	};

	Vue.prototype['$$getConfig'] = function(callFun) {
		if(env['NODE_ENV'] === 'development') {
			if(this.type && this.type === "layout") { ///判断是否是layout文件夹下的组件
				//				import("../layout/" + LAYOUT + '/' + this.name + '/config-' + this.$store.state.user.userinfo.info.id + ".json").then((cfg) => {
				//					callFun(cfg);
				//				}).catch((err) => {
				import("../layout/" + LAYOUT + '/' + this.name + "/config.json").then((cfg) => {
					callFun(cfg);
				}).catch((err) => {
					console.error(err);
					callFun({});
				});
				//				});
			} else {
				//				import("../components/" + this.name + '/config-' + this.$store.state.user.userinfo.info.id + ".json").then((cfg) => {
				//					callFun(cfg);
				//				}).catch((err) => {
				import("../components/" + this.name + "/config.json").then((cfg) => {
					callFun(cfg);
				}).catch((err) => {
					console.error(err);
					callFun({});
				});
				//				});
			}

		} else {
			//
			//			let url = 'static/config/' + this.name + '/config-' + this.$store.state.user.userinfo.info.id + '.json?' + new Date().getTime();
			//			Vue.axios({
			//				methods: 'get',
			//				headers: {},
			//				url: url,
			//				baseURL: ''
			//			}).then((cfg) => {
			//				callFun(cfg.data);
			//			}).catch((err) => {
			let defaultUrl = 'static/config/' + this.name + '/config.json?' + new Date().getTime();
			Vue.axios({
				methods: 'get',
				headers: {},
				url: defaultUrl,
				baseURL: ''
			}).then((cfg) => {
				callFun(cfg.data);
			}).catch((err) => {
				callFun({});
			})
			//			})
		}

	};
	
	let mixins = {
		
		data() {
			return {

				_statue: ''
				
			}
		},

		created: function() {
			this._statue = 'CREATED';
			let that = this;

			this.$nextTick(() => {
				if(that.hasOwnProperty('name')) {
					that.addClass(that.$el, that.name);
				}
			});
		},
		methods: {
			addClass(ele, name) {
				if(name) {
					//判断该dom有没有class，有则在原class基础上增加，无则直接赋值
					ele.className ? (ele.className.includes(name) ? (ele.className = ele.className) : (ele.className = ele.className + " " + name)) : ele.className = name;
				}
			}
		},
		activated: function() {
			this._statue = 'OPEN';
		},
		deactivated: function() {
			this._statue = 'CLOSE';
		}
	};

	Vue.mixin(mixins);
}
Vue.use(GlobePlugin);
