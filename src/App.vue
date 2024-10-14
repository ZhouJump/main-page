<script setup>
	import { nextTick, ref } from 'vue';
	import topBar from './components/top-bar.vue';
	import index from './components/index.vue';
	import project from './components/project.vue';
	import "bootstrap-icons/font/bootstrap-icons.css"
	const isOpen = ref(false)
	function goto(url){
		isOpen.value = true
		nextTick(()=>{
			setTimeout(()=>{
				window.open(url)
				isOpen.value=false
			},400)
			
		})	
	}
</script>

<template>
	<top-bar @goto="goto"></top-bar>
	<index @goto="goto"></index>
	<project @goto="goto"></project>
	<div :class="[isOpen?'open-active':'open']"></div>
</template>

<style>
	.open{
		position: fixed;
		width: 100px;
		height: 100px;
		border-radius: 50px;
		top: calc(50% - 50px);
		left: calc(50% - 50px);
		background-color: var(--sec-bg-color);
		z-index: 10;
		scale: 0;
	}
	.open-active{
		position: fixed;
		width: 100px;
		height: 100px;
		border-radius: 50px;
		top: calc(50% - 50px);
		left: calc(50% - 50px);
		background-color: var(--sec-bg-color);
		z-index: 10;
		scale: 24;
	}
	html,body,#app{
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
	#app{
		scroll-snap-type: y mandatory;
		overflow: hidden;
		overflow-y: auto;
		scroll-behavior: smooth;
		background-color: var(--main-bg-color);
	}
	*{
		transition-duration: 400ms;
	}
	:root{
		--main-bg-color:#F5F5FA;
		--sec-bg-color:#FFFFFF;
		--main-font-color:#000000;
		--sec-font-color:#747474;
		--active-font-color:#34495e;
		--shadow: 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 2px rgba(0, 0, 0, 0.06), 0px 0px 1px rgba(0, 0, 0, 0.04);
		--shadow-active: 0px 4px 8px rgba(0, 0, 0, 0.06), 0px 0px 2px rgba(0, 0, 0, 0.1), 0px 0px 1px rgba(0, 0, 0, 0.06);
		--bg-movie-fittler: invert(0%) blur(12px)
	}
	@media (prefers-color-scheme: dark) {
	  :root {
	   --main-bg-color:#303030;
	   --sec-bg-color:#424242;
	   --main-font-color:#ffffffe6;
	   --sec-font-color:#747474;
	   --active-font-color:#ecf0f1;
	   --bg-movie-fittler: hue-rotate(180deg) invert(80%) blur(12px)
	  }
	}
</style>
