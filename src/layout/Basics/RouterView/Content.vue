<template>
	<div class="content-view">
		<keep-alive>
			<router-view :key="key"/>
		</keep-alive>
	</div>
</template>

<script>
	export default {
		name: 'content-view',
		computed: {

			key() {
				return this.$route.fullPath
			}
		}
	}
</script>

<style lang="less"  scoped="scoped">
	.content-view {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>