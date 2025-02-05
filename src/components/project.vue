<template>
	<div id="project" class="project">
		<div class="project-cont">
			<div class="title">我的项目</div>
			<div @click="$emit('goto',project.link)" v-for="project in projectList" class="project-card">
				<img class="card-img" :src="project.img"/>
				<div class="card-title">{{project.title}}</div>
				<div class="card-des">{{project.des}}</div>
			</div>
      <div class="project-card">
        <amp-ad width="100vw" height="320"
                type="adsense"
                data-ad-client="ca-pub-7990766290275978"
                data-ad-slot="5277816790"
                data-auto-format="rspv"
                data-full-width="">
          <div overflow=""></div>
        </amp-ad>
      </div>
			<div v-if="projectList.length%2" style="opacity: 0;cursor: default;width: 380px;"></div>
		</div>
	</div>
	
</template>

<script setup>
	import { ref } from 'vue';
	const projectList=ref([
		{
			title:'个人博客',
			des:'我们所度过的每个平凡的日常，也许就是连续发生的奇迹。',
			img:'/blog.png',
			link:'https://blog.zhoujump.club'
		},
		{
			title:'简历编辑器',
			des:'做简历什么的，超简单的拉！',
			img:'/resume.png',
			link:'https://resume.zhoujump.club'
		},
		{
			title:'掌上莆院',
			des:'学校的教务系统真的很难用！',
			img:'/uniedu.png',
			link:'https://gitlab.com/zhoujump/JiaowuUniapp'
		},
		{
			title:'邮件收发系统',
			des:'一个MySQL的小课程设计',
			img:'/mymail.png',
			link:'https://gitlab.com/zhoujump/mail-system-mysql'
		},
		{
			title:'小蓝书',
			des:'一个微信小程序的课程设计',
			img:'/bluebook.png',
			link:'https://gitlab.com/zhoujump/wechat-little-blue-book'
		},
	])
</script>

<style scoped>
	.project{
		width: 100%;
		overflow: hidden;
		scroll-snap-align: start;
	}
	.project-cont{
		max-width: 800px;
		height: 100%;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-content: flex-start;
		padding-bottom: 60px;
	}
	.title{
		color: var(--main-font-color);
		padding-top: 80px;
		margin-bottom: 20px;
		font-size: 24px;
		font-weight: 700;
		width: 100%;
		margin-left: 16px;
	}
	.project-card{
		height: 300px;
		width: 380px;
		border-radius: 8px;
		background-color: var(--sec-bg-color);
		box-shadow: var(--shadow);
		overflow: hidden;
		margin-top: 16px;
		cursor: pointer;
	}
	.project-card:hover{
		box-shadow: var(--shadow-active);
		scale: 1.02;
	}
	.card-img{
		width: 100%;
		height: 60%;
		object-fit: cover;
	}
	.card-title{
		font-size: 20px;
		line-height: 20px;
		margin: 10px;
		color: var(--main-font-color);
	}
	.card-des{
		margin: 10px;
		color: var(--sec-font-color);
	}
</style>