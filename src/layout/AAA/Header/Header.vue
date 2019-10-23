<template>
	<div class="layout-header" :style="headerStyle">

	</div>
</template>

<script>
	export default {
		name: 'layout-header',
		data() {
			return {
				layout: this.$store.state.layout
			}
		},
		computed: {
			headerStyle() {
				return {
					height:this.layout.headerHeight+'px'
				}
			}
		},
		mounted() {

		},
	}
</script>

<style scoped lang="less">
	.layout-header {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #5782EA;
	}
</style>