<template>
	<div class="body-warp">
		<div v-for="(item,index) in appTheme">

			<div>{{index}}</div>
			<input type="text" v-model="appTheme[index]" :key="index" ></input>
		</div>
		<button @click="checkUp">提交</button>
	</div>

</template>

<script>
	import ModuleJs from './Module.js';
	export default ModuleJs;
</script>
<style scoped lang='less'>
	.body-warp {
		color: var(--BBB);
	}
</style>