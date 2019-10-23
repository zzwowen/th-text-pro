<template>
	<div class="layout-router-nav" :style="routerNavStyle">

	</div>
</template>

<script>
	export default {
		name: 'layout-router-nav',
		data() {
			return {
				layout: this.$store.state.layout
			}
		},
		computed: {
			routerNavStyle() {
				return {

					[this.layout.model]: '0px',
					width: this.layout.routerPanel.openWidth + 'px',
					top: this.layout.headerHeight + this.layout.padding + 'px',
					bottom: this.layout.footerHeight + this.layout.padding + 'px'
				}
			}
		},
		mounted() {

		},
	}
</script>

<style scoped lang="less">
	.layout-router-nav {
		width: 100%;
		position: absolute;
		background-color: #5782EA;
	}
</style>