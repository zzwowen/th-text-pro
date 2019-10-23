<template>
	<div class="home-ske">
		<div class="header" :style="{height:layout.headerHeight+'px'}">

		</div>
		
		<div class="contentPanel" :style="contentPanelStyle">

		</div>
		
		<div class="footer" :style="{height:layout.footerHeight+'px'}">

		</div>
	</div>
</template>

<script>
	export default {
		name: 'home-ske',
		data() {
			return {
				layout: this.$store.state.layout
			}
		},
		computed: {
			
			contentPanelStyle() {
				return {
					float: this.layout.model,
					left: this.layout.padding + 'px',
					right: this.layout.padding + 'px',
					top: this.layout.headerHeight + this.layout.padding + 'px',
					bottom: this.layout.footerHeight + this.layout.padding + 'px'
				}
			},
			
		},
		created() {

		},
		methods: {

		}
	}
</script>

<style scoped="scoped" lang="less">
	.home-ske {
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: relative;
		.header {
			width: 100%;
			background-color: #f5f5f5;
		}
		.footer {
			width: 100%;
			background-color: #f5f5f5;
			position: absolute;
			bottom: 0;
		}
		.routerPanel {
			position: absolute;
			background-color: #f5f5f5;
		}
		.conditionPanel {
			position: absolute;
			background-color: #f5f5f5;
		}
		.contentPanel {
			position: absolute;
			background-color: #f5f5f5;
		}
	}
</style>