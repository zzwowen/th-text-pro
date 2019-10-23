<template>
	<div id="app" class="themeB">
		<transition leave-active-class="fadeOut animated" :duration="{enter:300,leave:300}">
			<component v-if="skeletonShow" class="skeleton-component " :is="currentTabComponent"></component>
		</transition>
		<keep-alive>
			<router-view id="routerView" class="animated fadeIn" />
		</keep-alive>
		<div id="mapwait" :style="{'display':$store.state.global.ajax_loading?'block':'none'}">
			<center>加载中...<br><br>
				<div class="aqspinner3">
					<div class="r1"></div>
					<div class="r2"></div>
					<div class="r3"></div>
					<div class="r4"></div>
					<div class="r5"></div>
				</div>
			</center>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import jquery from 'jquery';
	import {
		store
	} from 'utils/';

	import setTheme from 'register/theme';
	const env = process.env;
	export default {
		name: 'App',
		data() {
			return {

			}
		},
		computed: {
			skeletonShow() {
				return this.$store.state.skeleton.skeletonShow
			},
			currentTabComponent() {
				let name = this.$store.state.skeleton.skeletonName;
				return() =>
					import(`skeletonview/${name}.vue`);
			},

		},
		methods: {
			replaceAllVarColor(cfg) {

			}
		},
		created() {

		},

		updated: function(ss) {

			setTheme();

		}
	}
</script>
<style lang="less">
	@import "assets/style/3ClearStyles/index.less";
	@import "assets/style/theme/base.less";
</style>
<style lang="less">
	#app {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.skeleton-component {
		position: absolute;
		top: 0;
		left: 0;
	}
	
	#mapwait {
		z-index: 81;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -60px;
		margin-left: -90px;
		text-align: center;
		padding-top: 30px;
		box-shadow: 0px 0px 8px rgba(0, 0, 0, .20);
		background-color: white;
		width: 180px;
		height: 120px;
		z-index: 1000;
	}
	
	.aqspinner3 {
		display: inline-block;
		height: 40px;
	}
	
	.aqspinner3>div {
		background-color: #333;
		height: 100%;
		width: 6px;
		display: inline-block;
		margin: 1px;
		-webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
		animation: sk-stretchdelay 1.2s infinite ease-in-out;
	}
	
	.aqspinner3>.r1 {
		background-color: #29fd2e;
	}
	
	.aqspinner3>.r2 {
		-webkit-animation-delay: -1.1s;
		animation-delay: -1.1s;
		background-color: #fffd37;
	}
	
	.aqspinner3>.r3 {
		-webkit-animation-delay: -1.0s;
		animation-delay: -1.0s;
		background-color: #fd7e23;
	}
	
	.aqspinner3>.r4 {
		-webkit-animation-delay: -0.9s;
		animation-delay: -0.9s;
		background-color: #fc0d1b;
	}
	
	.aqspinner3>.r5 {
		-webkit-animation-delay: -0.8s;
		animation-delay: -0.8s;
		background-color: #97084c;
	}
	
	@-webkit-keyframes sk-stretchdelay {
		0%,
		40%,
		100% {
			-webkit-transform: scaleY(0.4)
		}
		20% {
			-webkit-transform: scaleY(1.0)
		}
	}
	
	@keyframes sk-stretchdelay {
		0%,
		40%,
		100% {
			transform: scaleY(0.4);
			-webkit-transform: scaleY(0.4);
		}
		20% {
			transform: scaleY(1.0);
			-webkit-transform: scaleY(1.0);
		}
	}
</style>