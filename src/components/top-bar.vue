<template>
	<div class="top-bar">
		<!-- <div class="top-logo"></div> -->
		<div class="top-nav">
			<a href="#index" class="nav-item">主页<br/><span>home</span></a>
			<a href="#project" class="nav-item">项目<br/><span>project</span></a>
			<a @click="$emit('goto','https://blog.zhoujump.club')" class="nav-item">博客<br/><span>blog</span></a>
			<a @click="$emit('goto','https://resume.zhoujump.club')" class="nav-item">简历<br/><span>resume</span></a>
		</div>
	</div>
</template>

<script>
</script>

<style scoped>
	.top-bar{
		width: 100%;
		height: 60px;
		position: fixed;
		top:0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		background-color: var(--main-bg-color);
	}
	.top-logo::after{
		content: 'ZHOUJUMP.CLUB';
		color: var(--main-font-color);
		margin-left: 60px;
	}
	.nav-item{
		transition-duration: 300ms;
		border-radius: 0.2rem;
		padding: 0.4rem 1.6rem;
		display: inline-block;
		font-size: 0.9rem;
		line-height: 0.6rem;
		margin-right: 0.3rem;
		margin-left: 0.3rem;
		text-decoration: none; /* 去除默认的下划线 */
		outline: none; /* 去除旧版浏览器的点击后的外虚线框 */
		color: var(--main-font-color);
		background-color: var(--font-bg-color);
	}
	.nav-item:hover{
		font-size: 1rem;
		margin-right: 0.6rem;
		margin-left: 0.6rem;
		border-radius: 6rem;
		background-color: var(--main-font-color);
		color: var(--font-bg-color);
	}
	.nav-item span{
		transition-duration: 300ms;
		font-size: 0.5rem;
		font-weight: 200;
	}
	@media screen and (max-width: 800px) {
	  .top-logo::after{
		content: 'Z';
		font-size: 20px;
	  	color: var(--main-font-color);
	  	margin-left: 20px;
	  }
	  .top-nav{
	  	color: var(--main-font-color);
	  	margin-right: 0;
	  }
	}
</style>