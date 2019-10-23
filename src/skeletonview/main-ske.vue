<template>
	<div class="main-ske">
		<div class="header" :style="{height:layout.headerHeight+'px'}">

		</div>
		<div class="routerPanel" :style="routerPanelStyle">

		</div>
		<div class="contentPanel" :style="contentPanelStyle">

		</div>
		<div class="conditionPanel" :style="conditionPanelStyle">

		</div>
		<div class="footer" :style="{height:layout.footerHeight+'px'}">

		</div>
	</div>
</template>

<script>
	export default {
		name: 'main-ske',
		data() {
			return {
				layout: this.$store.state.layout
			}
		},
		computed: {
			routerPanelStyle() {
				return {
					float: this.layout.model,
					[this.layout.model]: '0px',
					width: this.layout.routerPanel.openWidth + 'px',
					top: this.layout.headerHeight + this.layout.padding + 'px',
					bottom: this.layout.footerHeight + this.layout.padding + 'px'
				}
			},
			contentPanelStyle() {
				return {
					float: this.layout.model,
					[this.layout.model]: this.layout.routerPanel.openWidth + this.layout.padding + 'px',
					[this.layout.model === 'left' ? 'right' : 'left']: this.layout.conditionPanel.width + this.layout.padding + 'px',
					top: this.layout.headerHeight + this.layout.padding + 'px',
					bottom: this.layout.footerHeight + this.layout.padding + 'px'
				}
			},
			conditionPanelStyle() {
				return {
					float: this.layout.model,
					width: this.layout.conditionPanel.width + 'px',
					[this.layout.model === 'left' ? 'right' : 'left']: '0px',
					top: this.layout.headerHeight + this.layout.padding + 'px',
					bottom: this.layout.footerHeight + this.layout.padding + 'px'
				}
			}
		},
		created() {

		},
		methods: {

		}
	}
</script>

<style scoped="scoped" lang="less">
	.main-ske {
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: relative;
		.header {
			width: 100%;
			background-color: var(--BBB);
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