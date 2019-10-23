<template>
	<div class="body-warp ">
		{{$$appConfig.title}}
		<button class="caller" @click="changeTheme">主题</button>
		<div class="item" v-for="item in themes" @click="changeT(item.value)">
			{{item.label}}
		</div>
		
		<div class="echartsDom" ref="userChart">
			
		</div>
		<div class="echartsDom">
			<chart theme="myTheme" style="width: 100%;height: 100%;" :autoresize=true :options="chartOption"></chart>
		</div>
	</div>

</template>

<script>
	import ModuleJs from './Module.js';
	export default ModuleJs;
</script>
<style scoped lang='less'>
	/*@import url(./assets/style/style.css);
	@import url(./assets/style/style.less);*/
	
	each(@list, {
		.mixin(@value);
		.@{value} {
			.body-warp {
				background-color: @back;
				/*开始*/
				.caller {
					width: @width;
					height: @height;
				}
				.item {
					width: 100px;
					height: 50px;
					line-height: 50px;
					background-color: #fff;
					border: 1px solid #000000;
				}
				.echartsDom{
					width: 600px;
					height: 400px;
				}
				/*结束*/
			}
		}
	});
	.echarts{
		width: 100%;
		height: 100%;
	}
</style>