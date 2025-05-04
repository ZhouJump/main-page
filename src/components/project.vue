<template>
	<div id="project" class="project">
		<div class="project-cont">
			<div class="title">我的项目</div>
			<a target="_blank" :href="project.link" v-for="project in projectList" class="project-card">
				<img class="card-img" :src="project.img"/>
				<div class="card-title">{{project.title}}</div>
				<div class="card-des">{{project.des}}</div>
			</a>
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
			img:'/blog.jpg',
			link:'https://blog.zhoujump.club'
		},
		{
			title:'简历编辑器',
			des:'做简历什么的，超简单的拉！',
			img:'/resume.jpg',
			link:'https://resume.zhoujump.club'
		},
		{
			title:'QQ侧栏编辑插件',
			des:'让你的QQ侧边栏清清爽爽',
			img:'/qqsidebar.jpg',
			link:'https://github.com/ZhouJump/qq-fuck-sidebar'
		},
		{
			title:'码农名片生成器',
			des:'生成vscode风格的名片',
			img:'/businesscard.jpg',
			link:'https://businesscard.zhoujump.club'
		},
		{
			title:'掌上莆院',
			des:'学校的教务系统真的很难用！',
			img:'/uniedu.jpg',
			link:'https://github.com/ZhouJump/JiaowuUniapp'
		},
		{
			title:'邮件收发系统',
			des:'一个MySQL的小课程设计',
			img:'/mymail.jpg',
			link:'https://github.com/ZhouJump/mail-system-mysql'
		},
		{
			title:'小蓝书',
			des:'一个微信小程序的课程设计',
			img:'/bluebook.jpg',
			link:'https://github.com/ZhouJump/wechat-little-blue-book'
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
		display: block;
		height: 300px;
		width: 380px;
		border-radius: 8px;
		background-color: var(--sec-bg-color);
		box-shadow: var(--shadow);
		overflow: hidden;
		margin-top: 16px;
		cursor: pointer;
		text-decoration: none;
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