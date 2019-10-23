const getters = {
	skeletonShow: state => state.skeleton.skeletonShow,
	skeletonName: state => state.skeleton.skeletonName,
	layout: state => state.layout,
	ajax_loading: state => state.global.ajax_loading,
	layout_type: state => state.global.layout_type,
}

export default getters