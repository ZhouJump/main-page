<template>
	<div class="top-bar">
		<div class="top-logo"></div>
		<div class="top-nav">
			<a href="#index" class="nav-item">主页<br/><span>home</span></a>
			<a href="#project" class="nav-item">项目<br/><span>project</span></a>
			<a href="https://blog.zhoujump.club/" class="nav-item">博客<br/><span>blog</span></a>
		</div>
	</div>
</template>

<script>
</script>

<style scoped>
	.top-bar{
		width: 100%;
		height: 60px;
		opacity: 0.8;
		background-color: var(--sec-bg-color);
		box-shadow: var(--shadow);
		position: fixed;
		top:0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;
	}
	.top-logo::after{
		content: 'ZHOUJUMP.CLUB';
		color: var(--main-font-color);
		margin-left: 60px;
	}
	.top-nav{
		
		margin-right: 40px;
	}
	.nav-item{
		display: inline-block;
		font-size: 18px;
		line-height: 16px;
		margin-right: 20px;
		cursor: pointer;
		text-decoration: none; /* 去除默认的下划线 */
		outline: none; /* 去除旧版浏览器的点击后的外虚线框 */
		color: var(--main-font-color);
		border-bottom: 2px solid #00000000;
	}
	.nav-item:hover{
		color: var(--active-font-color);
		border-bottom: 2px solid var(--active-font-color);
	}
	.nav-item span{
		font-size: 12px;
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