/**
 * Created by ZZW
 * date:  2019-10-08
 * desc: 框架测试
 */

export default {
	name: 'UI',
	components: {},
	data() {
		return {
			//模块基础数据信息
			name: 'UI',
			config: {},
			lessLoaded: false,
			appTheme: {}

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

		},
		checkUp() {

		},
		onResize() {

		}
	},
	mounted() {

	},

	activated() {

	}
}