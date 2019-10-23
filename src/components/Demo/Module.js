/**
 * Created by ZZW
 * date:  2019-10-08
 * desc: 框架测试
 */
import axios from 'axios';
//import less from 'less';

import Chart from 'register/chart/chart';
//import echarts from 'echarts';

export default {
	name: 'Demo',
	components: {

	},
	data() {
		return {
			//模块基础数据信息
			name: 'Demo',
			config: {},
			lessLoaded: false,
			themes: [{
				label: 'themeA',
				value: 'themeA'
			}, {
				label: 'themeB',
				value: 'themeB'
			}, {
				label: 'themeC',
				value: 'themeC'
			}],
			chartOption: {}
		}
	},
	methods: {

	},

	created() {
		this.$$getConfig(this.onGetConfig);
		this.$$resize(this.onResize);

	},
	methods: {
		onGetConfig(config) {
			this.config = config;
			this.setEcharts();
		},
		setEcharts() {
			//			let obj=charttheme;

			let myChart = new Chart(this.$refs['userChart']);

			let option = {
				title: {
					text: '堆叠区域图'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985'
						}
					}
				},
				legend: {
					data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
						name: '邮件营销',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: [120, 132, 101, 134, 90, 230, 210]
					},
					{
						name: '联盟广告',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: [220, 182, 191, 234, 290, 330, 310]
					},
					{
						name: '视频广告',
						type: 'line',
						stack: '总量',
						areaStyle: {},
						data: [150, 232, 201, 154, 190, 330, 410]
					},
					{
						name: '直接访问',
						type: 'line',
						stack: '总量',
						areaStyle: {
							normal: {}
						},
						data: [320, 332, 301, 334, 390, 330, 320]
					},
					{
						name: '搜索引擎',
						type: 'line',
						stack: '总量',
						label: {
							normal: {
								show: true,
								position: 'top'
							}
						},
						areaStyle: {
							normal: {}
						},
						data: [820, 932, 901, 934, 1290, 1330, 1320]
					}
				]
			};
			myChart.setOption(option);
			this.chartOption = option;
		},
		changeTheme() {
			let layout = 'AAA';
			if(this.$store.state.global.layout_type === 'AAA') {
				layout = 'Basics';
			}
			this.$store.dispatch('global/change_layout_type', {
				layout_type: layout
			});

		},
		changeT(value) {

			document.getElementById('app').className = value;

		},
		onResize() {

		}
	},
	mounted() {

	},

	activated() {

	}
}