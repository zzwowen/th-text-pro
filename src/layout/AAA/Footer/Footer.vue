<template>
	<div class="layout-footer" :style="footerStyle">

	</div>
</template>

<script>
	export default {
		name: 'layout-footer',
		data() {
			return {
				layout: this.$store.state.layout
			}
		},
		computed: {
			footerStyle() {
				return {
					height:this.layout.footerHeight+'px'
				}
			}
		},
		mounted() {

		},
	}
</script>

<style scoped lang="less">
	.layout-footer {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #5782EA;
	}
</style>