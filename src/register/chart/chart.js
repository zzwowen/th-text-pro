import Vue from 'vue';
import ECharts from 'echarts';
import myChart from 'vue-echarts';
const theme = require('./charttheme.json')
ECharts.registerTheme('myTheme', theme);
Vue.component('chart', myChart);
Vue.use(myChart);

function Chart(dom, theme = 'myTheme', opts = {}) {
	return ECharts.init(dom, theme, opts);
}
export default Chart