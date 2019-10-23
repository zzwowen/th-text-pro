import store from '../store/modules/global.js';
let layout_type = store.state.layout_type;
let layoutConfig = require(`./${layout_type}/`);
let Home = layoutConfig.Home;
let Main = layoutConfig.Main;
let Content = layoutConfig.Content;
let layout = layoutConfig.layout;
export {

	Home,
	Main,
	Content,
	layout
}