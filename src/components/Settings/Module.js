/**
 * Created by ZZW
 * date:  2019-10-08
 * desc: 框架测试
 */
import axios from 'axios';
import fs from 'fs';

//const style=require('!css-loader!./assets/style/style.less') 
export default {
	name: 'Settings',
	components: {},
	data() {
		return {
			//模块基础数据信息
			name: 'Demo',
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
			this.$nextTick(() => {
				this.appTheme = _.cloneDeep(this.$store.state.global.appTheme);
			});

		},
		checkUp() {

			this.$store.dispatch('global/change_app_theme', {
				appTheme: this.appTheme
			}).then(() => {

				console.log('1112111111111112')
			})
		},
		onResize() {

		}
	},
	mounted() {
		this.$nextTick(() => {
			this.appTheme = _.cloneDeep(this.$store.state.global.appTheme);
		});
		
	},

	activated() {

	}
}