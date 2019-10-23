<template>
	<div class="home-view">
		<keep-alive>
			<router-view :key="key" />
		</keep-alive>
	</div>
</template>

<script>
	export default {
		name: 'home-view',
		computed: {

			key() {
				return this.$route.fullPath
			}
		},
		mounted() {
			this.$store.dispatch('skeleton/change_skeleton', {
				skeletonName: 'home-ske'
			})
		}
	}
</script>

<style lang="less"  scoped="scoped">
	.home-view {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>