<script setup>
	import { nextTick, ref } from 'vue';
	import topBar from './components/top-bar.vue';
	import index from './components/index.vue';
	import project from './components/project.vue';
	import "bootstrap-icons/font/bootstrap-icons.css"
	function goto(url){
		window.open(url)
	}
	window.addEventListener('mousemove', mouseMove);
	function mouseMove(e){
		document.querySelector('.mouse').style.left = e.clientX + 'px';
		document.querySelector('.mouse').style.top = e.clientY + 'px';
	}
</script>

<template>
	<top-bar @goto="goto"></top-bar>
	<index @goto="goto"></index>
	<project @goto="goto"></project>
	<div :class="[isOpen?'open-active':'open']"></div>
	<div id="mouse" class="mouse">
		<div class="mouse-inner"></div>
	</div>
</template>

<style>
	.mouse{
		pointer-events: none;
		z-index: 999;
		position: fixed;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		backdrop-filter: invert(100%);
		transform: translate(-50%, -50%);
	}
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
		cursor: none !important;
	}
	::selection{
		background-color: var(--main-font-color);
		color: var(--font-bg-color);
	}
	a{
		cursor: none!important;
	}
	#app{
		overflow: hidden;
		overflow-y: auto;
		scroll-behavior: smooth;
		background-color: var(--main-bg-color);
	}
	:root{
		--main-bg-color:#F9F4EB;
		--sec-bg-color:#FFFFFF;
		--main-font-color:#000000;
		--sec-font-color:#747474;
		--font-bg-color:#F0ECE5;
		--active-font-color:#34495e;
	}
	@media (prefers-color-scheme: dark) {
	  :root {
	   --main-bg-color:#303030;
	   --sec-bg-color:#424242;
	   --main-font-color:#ffffffe6;
	   --sec-font-color:#747474;
	   --active-font-color:#ecf0f1;
	  }
	}
</style>
