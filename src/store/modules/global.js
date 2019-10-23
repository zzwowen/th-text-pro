import {
	store
} from 'utils/';
import setTheme from 'register/theme';

const env = process.env;
const state = {
	ajax_loading: false, //请求动画
	layout_type: store.get('layout_type') || 'Basics', //布局选择
	curRouter: { //当前选中路由
		headerRouter: '', //头部导航路由
		subMenuRouter: '', //子菜单路由
	},
	appTheme: store.get('appTheme') || null
};
const mutations = {
	SHOW_AJAX_LOADING: (state) => {
		state.ajax_loading = true;
	},
	HIDE_AJAX_LOADING: (state) => {
		state.ajax_loading = false;
	},
	CHANGE_LAYOUT_TYPE: (state, view) => {
		state.layout_type = view.layout_type;
		store.set('layout_type', state.layout_type);
		location.reload();
		//		if(env['NODE_ENV'] === 'development') {
		//			location.reload();
		//		} else {
		//			let href = location.href.split('//')[0] + '//' + location.href.split('//')[1].split('/')[0];
		//			window.location.href = href;
		//		}

	},
	CHANGE_APP_THEME: (state, view) => {

		state.appTheme = view.appTheme;
		store.set('appTheme', state.appTheme);
		setTheme();
		if(env['NODE_ENV'] === 'development') {
			location.reload();
		}

	}

};
const actions = {
	show_ajax_loading({
		commit
	}, view) {
		commit('SHOW_AJAX_LOADING')
	},
	hide_ajax_loading({
		commit
	}, view) {
		commit('HIDE_AJAX_LOADING')
	},
	change_layout_type({
		commit
	}, view) {
		commit('CHANGE_LAYOUT_TYPE', view)
	},
	change_app_theme({
		commit
	}, view) {
		return new Promise(resolve => {
			commit('CHANGE_APP_THEME', view);
			resolve()
		})
	},
};
export default {
	namespaced: true,
	state,
	mutations,
	actions
}