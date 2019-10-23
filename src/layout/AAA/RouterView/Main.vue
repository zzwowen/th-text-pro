<template>
	<div class="main-view" v-show="!$store.state.skeleton.skeletonShow">
		<header-nav></header-nav>
		<router-nav :style="routerPanelStyle"></router-nav>

		<div class="content-view" :style="contentPanelStyle">
			<keep-alive>
				<router-view style="width: 100%;height: 100%;"  :key="key" />
			</keep-alive>
		</div>
		<footer-view></footer-view>

	</div>
</template>

<script>
	import headerNav from '../Header/Header.vue';
	import routerNav from '../RouterNav/RouterNav.vue';
	import footerView from '../Footer/Footer.vue';
	export default {
		name: 'main-view',
		components: {
			'header-nav': headerNav,
			'router-nav': routerNav,
			'footer-view': footerView,
		},
		data() {
			return {
				layout: this.$store.state.layout
			}
		},
		computed: {

			key() {
				return this.$route.fullPath
			},
			routerPanelStyle() {
				return {

					[this.layout.model]: '0px',
					width: this.layout.routerPanel.openWidth + 'px',
					top: this.layout.headerHeight + this.layout.padding + 'px',
					bottom: this.layout.footerHeight + this.layout.padding + 'px'
				}
			},
			contentPanelStyle() {
				return {

					[this.layout.model]: this.layout.routerPanel.openWidth + this.layout.padding + 'px',
					[this.layout.model === 'left' ? 'right' : 'left']: '0px',
					top: this.layout.headerHeight + this.layout.padding + 'px',
					bottom: this.layout.footerHeight + this.layout.padding + 'px'
				}
			},
			conditionPanelStyle() {
				return {

					width: this.layout.conditionPanel.width + 'px',
					[this.layout.model === 'left' ? 'right' : 'left']: '0px',
					top: this.layout.headerHeight + this.layout.padding + 'px',
					bottom: this.layout.footerHeight + this.layout.padding + 'px'
				}
			}
		},
		mounted() {
			this.$store.dispatch('skeleton/change_skeleton', {
				skeletonName: 'main-ske'
			});
		}

	}
</script>

<style lang="less" scoped="scoped">
	.main-view {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
	}
	
	.content-view {
		position: absolute;
		background-color: #5782EA;
	}
</style>