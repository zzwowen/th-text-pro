/**
 * Created by ZZW
 * date:  2019-10-08
 * desc: 框架测试
 */

export default {
	name: 'NotFound',
	components: {},
	data() {
		return {
			//模块基础数据信息
			name: 'NotFound',
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