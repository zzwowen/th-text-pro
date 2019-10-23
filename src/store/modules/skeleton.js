const state = {
	skeletonShow: true,
	skeletonName: 'home-ske'
}

const mutations = {
	SHOW_SKELETON_VIEW: (state, view) => {
		state.skeletonShow = true;
	},
	HIDE_SKELETON_VIEW: () => {
		state.skeletonShow = false;
	},
	CHANGE_SKELETON_NAME: (state, view) => {
		state.skeletonName = view.skeletonName;
	},

}

const actions = {
	change_skeleton({
		commit
	}, view) {
		commit('CHANGE_SKELETON_NAME',view);
	},
	show_skeleton({
		commit
	}, view) {
		commit('SHOW_SKELETON_VIEW')
	},
	hide_skeleton({
		commit
	}, view) {
		commit('HIDE_SKELETON_VIEW')
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}