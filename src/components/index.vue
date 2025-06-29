<template>
	<div id="index" class="index">
		<div class="sologan">
			<div class="title">我们所度过的每个平凡的日常</div>
			<div class="title">也许就是连续发生的奇迹<span class="pointer"></span></div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
</script>

<style scoped>
	.pointer{
		display: inline-block;
		width: 1.8vw;
		aspect-ratio: 1/2;
		margin-left: 0.5vw;
		background-color: var(--main-font-color);
		animation: pointer 1s infinite;
	}
	@keyframes pointer {
		0%{
			opacity: 0;
		}
		50%{
			opacity: 1;
		}
		100%{
			opacity: 0;;
		}
	}
	.index{
		width: 100%;
		height: 100%;
		overflow: hidden;
		scroll-snap-align: start;
		position: relative;
		background-color: var(--main-bg-color);
	}
	.sologan{
		width: 100%;
		top:40%;
		text-align: center;
		position: absolute;
		z-index: 2;
		color: var(--main-font-color);
	}
	.sologan .title{
		z-index: 1;
		font-size: 4vw;
		font-weight: 700;
		text-shadow: 0 0 20px var(--main-bg-color);
	}
</style>