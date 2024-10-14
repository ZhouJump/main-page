<template>
	<div id="index" class="index">
		<video :class="[isHide?'bg-movie-show':'bg-movie']" id="video" :muted="isMuted" loop="true" autoplay>
			  <source src="/video.mp4" type="video/mp4" />
		</video>
		<div class="play-contr">
			<i @click="$emit('goto','https://www.bilibili.com/video/BV1Ef4y137fJ')" class="bi bi-link-45deg"></i>
			<i @click="isHide=!isHide" style="font-size: 24px;" :class="['bi',isHide?'bi-eye-slash-fill':'bi-eye-fill']"></i>
			<i @click="isMuted=!isMuted" style="margin-right: -8px;" :class="['bi',isMuted?'bi-volume-mute-fill':'bi-volume-down-fill']"></i>
			<i @click="switchPlay" :class="['bi',isPlay?'bi-play-fill':'bi-pause-fill']"></i>
		</div>
		<div v-if="!isHide" class="sologan">
			<div class="title">我们所度过的每个平凡的日常，</div>
			<div class="title">也许就是连续发生的奇迹。</div>
			<i class="bi bi-mouse"></i>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	const isMuted = ref(true)
	const isPlay = ref(false)
	const isHide = ref(false)
	function switchPlay(){
		isPlay.value =! isPlay.value
		if(isPlay.value)
			document.getElementById('video').pause()
		else
			document.getElementById('video').play()
	}
</script>

<style scoped>
	.index{
		width: 100%;
		height: 100%;
		overflow: hidden;
		scroll-snap-align: start;
		position: relative;
	}
	.sologan{
		width: 100%;
		top:40%;
		text-align: center;
		position: absolute;
		z-index: 2;
		color: var(--main-font-color);
		cursor: default;
	}
	.sologan .title{
		font-size: 60px;
		font-weight: 700;
		text-shadow: 0 0 20px var(--main-bg-color);
	}
	.sologan .bi{
		font-size: 40px;
		margin-top: 160px;
		display: inline-block;
	}
	@media screen and (max-width: 900px) {
	  .sologan .title{
	  	font-size: 26px;
	  	font-weight: 700;
	  	text-shadow: 0 0 10px white;
	  }
	}
	.bg-movie{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		filter: var(--bg-movie-fittler);
		object-fit: cover;
	}
	.bg-movie-show{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
	.play-contr{
		width: 200px;
		height: 60px;
		border-radius: 30px;
		position: absolute;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		left: 20px;
		bottom: 20px;
		background-color: var(--sec-bg-color);
		box-shadow: var(--shadow);
		z-index: 1;
		opacity: 0.6;
	}
	.play-contr:hover{
		opacity: 1;
	}
	.play-contr .bi{
		color: var(--main-font-color);
		font-size: 30px;
		cursor: pointer;
	}
</style>