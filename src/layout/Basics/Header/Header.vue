<template>
	<div class="layout-header" :style="headerStyle">
		<div class="nav">
			<div @click="turnTo(item)" class="nav__item" :class="[{'actived':isActivedRouter(item)}]" v-for="item in routes" :style="{width:preWidth+'px','line-height':layout.headerHeight + 'px'}">{{item.name}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'layout-header',
		data() {
			return {
				layout: this.$store.state.layout,
				preWidth: 120,
				routes: []
			}
		},
		computed: {
			headerStyle() {
				return {
					height: this.layout.headerHeight + 'px',
				}
			},
			navWidth() {

				return this.routes.length * (this.preWidth)
			}
		},
		created() {
			let newRoutes = [];
			let routes = this.$router.options.routes;

			routes.forEach((item) => {
				if(item.hasOwnProperty('children')) {
					newRoutes.push(item);
				}

			});
			this.routes = newRoutes;

		},
		methods: {
			isActivedRouter(item) {
				return item.path === this.$route.matched[0].path
			},
			setCurRouter(rItem) {
				let route = rItem || this.$route;
				let rootPath = route.matched[0].path,
					fullPath = route.path;

			},
			turnTo(item) {

				this.$router.push(item.path);
			}
		},
		mounted() {

		},
		watch: {

		}
	}
</script>

<style scoped lang="less">
	.layout-header {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: var(--BBB);;
	}
	
	.nav {
		height: 100%;
		position: relative;
		margin-left: 220px;
		.nav__item {
			text-align: center;
			font-weight: bold;
			display: inline-block;
			cursor: pointer;
			position: relative;
			&.actived:before,
			&:hover:before {
				content: '';
				position: absolute;
				width: 100%;
				height: 5px;
				background-color: #DDD;
				left: 0;
				bottom: 0px;
			}
		}
	}
</style>