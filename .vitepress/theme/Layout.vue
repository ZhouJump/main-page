<script setup>
import { useData } from 'vitepress'
import Home from './home.vue'
import Project from './project.vue'
import Blog from './blog.vue'
import About from './about.vue'
import NotFound from './404.vue'
const { site, frontmatter, page } = useData()
</script>

<template>
  <link rel="stylesheet" href="/icon/iconfont.css">
  <div class="head-bar">
    <div class="head-menu">
      <a href="/" class="head-bar-home head-item">Z</a>
    </div>
    <div class="head-menu">
      <a href="/" :class="['head-menu-item','head-item',frontmatter.page === 'home' ? 'active' : '']">
        <div class="head-menu-item-cont">
          <div class="iconfont icon-home"></div>
          <div class="head-menu-item-text">首页</div>
        </div>
      </a>
      <a href="/project" :class="['head-menu-item','head-item',frontmatter.page === 'project' ? 'active' : '']">
        <div class="head-menu-item-cont">
          <div class="iconfont icon-project"></div>
          <div class="head-menu-item-text">项目</div>
        </div>
      </a>
      <a href="/blog" :class="['head-menu-item','head-item',frontmatter.page === 'blog' ? 'active' : '']">
        <div class="head-menu-item-cont">
          <div class="iconfont icon-blog"></div>
          <div class="head-menu-item-text">博客</div>
        </div>
      </a>
      <a href="/about" :class="['head-menu-item','head-item',frontmatter.page === 'about' ? 'active' : '']">
        <div class="head-menu-item-cont">
          <div class="iconfont icon-info"></div>
          <div class="head-menu-item-text">关于</div>
        </div>
      </a>
    </div>
  </div>
  <project v-if="frontmatter.page === 'project'"></project>
  <home v-if="frontmatter.page === 'home'"></home>
  <blog v-if="frontmatter.page === 'blog'"></blog>
  <about v-if="frontmatter.page === 'about'"></about>
  <not-found v-if="page.isNotFound"></not-found>
  <div class="foot">
    <div class="nav">
      <div class="nav-item">
        <div class="title">我们所度过的每个平凡的日常，也许就是连续发生的奇迹</div>
      </div>
      <div class="nav-item">
        <div class="title">项目表</div>
          <a href="https://blog.zhoujump.club" class="item">粥粥个人博客</a>
          <a href="https://resume.zhoujump.club" class="item">简历编辑器</a>
          <a href="https://github.com/ZhouJump/qq-fuck-sidebar" class="item">QQ侧栏编辑插件</a>
          <a href="https://businesscard.zhoujump.club/" class="item">码农名片生成器</a>
          <a href="https://github.com/ZhouJump/JiaowuUniapp" class="item">掌上莆院(uniapp+uniCloud)</a>
          <a href="https://github.com/ZhouJump/mail-system-mysql" class="item">邮件收发系统(MySQL+Spring)</a>
          <a href="https://github.com/ZhouJump/wechat-little-blue-book" class="item">小蓝书(原生微信小程序)</a>
      </div>
      <div class="nav-item">
        <div class="title">本网站</div>
        <a href="/" class="item">首页-Home</a>
        <a href="/project" class="item">项目-Project</a>
        <a href="/blog" class="item">博客-Blog</a>
        <a href="/about" class="item">关于-About</a>
      </div>
      <div class="nav-item">
        <div class="title">联系我</div>
        <a href="https://github.com/ZhouJump" class="item">GitHub.com</a>
        <a href="https://www.linkedin.com/in/zhou-jump/" class="item">领英-LinkedIn</a>
        <a href="https://space.bilibili.com/346093756" class="item">哔哩哔哩-Bilibili</a>
        <a href="https://blog.zhoujump.club/index.xml" class="item">RSS订阅-RSS</a>
        <a href="mailto:x@zhoujump.club" class="item">电子邮箱-Email</a>
      </div>
    </div>
    <div class="foot-toy">
      <div class="toy">
        <div class="toy-item">Z</div>
        <div class="toy-item">H</div>
        <div class="toy-item">O</div>
        <div class="toy-item">U</div>
        <div class="toy-item">J</div>
        <div class="toy-item">U</div>
        <div class="toy-item">M</div>
        <div class="toy-item">P</div>
        <div class="toy-item">.</div>
        <div class="toy-item">C</div>
        <div class="toy-item">L</div>
        <div class="toy-item">U</div>
        <div class="toy-item">B</div>
      </div>
      <div class="beian">
        <a href="https://beian.miit.gov.cn" class="beian-item">湘ICP备2025141796号-1</a>
        <a href="https://beian.mps.gov.cn/#/query/webSearch?code=35021102002336" class="beian-item"><img src="/image/beian.png" alt="icp">闽公网安备35021102002336号</a>
      </div>
    </div>
  </div>
</template>
<style>
@font-face {
  font-family: 'NotoSerifSC';
  src: url('/fonts/NotoSerifSC.ttf');
}
html{
  /* filter: grayscale(100%); */
  width: 100%;
  height: 100%;
  #app{
    width: 100%;
    height: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #F7F7F7;
    width: 100%;
    height: 100%;
    *{
      box-sizing: border-box;
    }
    .foot{
      margin-top: 128px;
      border-top: 1px solid #e2e2e2;
      padding: 16px 24px;
      a{
        position: relative;
        width: fit-content;
        &::after{
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          transform: scaleX(0);
          box-shadow: 0 0 0 1px #2C64FF;
          transition-duration: 400ms;
          transform-origin: top left;
        }
        &:hover::after{
          transform: scaleX(1);
        }
      }
      .nav{
        display: grid;
        grid-template-columns: 3fr 1fr 1fr 1fr;
        .nav-item{
          .title{
            font-weight: 500;
            color: #a0a0a0;
            font-size: 14px;
            margin-bottom: 12px;
          }
          .item{
            margin: 8px 0;
            text-decoration: none;
            display: block;
            color: #111111;
            font-size: 13px;
          }
          font-family: 'NotoSerifSC';
        }
      }
      .foot-toy{
        margin-top: 128px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .toy{
          height: 70px;
          display: flex;
          align-items: flex-end;
          gap: 4px;
          .toy-item{
            transition-duration: 400ms;
            cursor: default;
            font-size: 12px;
            color: #111111;
            border-radius: 8px;
            border: 1px solid #e2e2e2;
            width: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover{
              width: 70px;
              height: 70px;
            }
          }
        }
        .beian{
          font-family: 'NotoSerifSC';
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #111111;
          .beian-item{
            color: #111111;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            img{
              object-fit: contain;
              width: 1.2em;
              height: 1.2em;
            }
          }
        }
      }
    }
    .head-bar {
      z-index: 100;
      padding: 8px;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 76px;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
      .head-item{
        box-shadow: 0 0 12px #00000001;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        text-decoration: none;
      }
      .head-menu{
        pointer-events: auto;
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: #F7F7F7;
        box-shadow: 0 0 0 12px #F7F7F7; 
        &:first-child{
          border-bottom-right-radius: 12px;
        }
        &:last-child{
          border-bottom-left-radius: 12px;
        }
        .head-menu-item{
          background-color: white;
          color: #111111;
          width: 60px;
          transition-duration: 400ms;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          .head-menu-item-cont{
            height: 24px;
            width: 60px;
            overflow: hidden;
            text-align: center;
            line-height: 24px;
            .iconfont{
              transition-property: transform;
              transition-delay: 200ms;
              transition-duration: 200ms;
              color: inherit;
              text-decoration: none;
              display: block;
            }
            .head-menu-item-text{
              font-family: 'NotoSerifSC';
              font-size: 14px;
              transition-property: transform;
              transition-delay: 100ms;
              transition-duration: 200ms;
              display: block;
            }
          }
          &:hover{
            background-color: #2C64FF;
            color: white;
            width: 100px;
            .iconfont{
              transform: translateY(-24px);
              transition-delay: 100ms;
            }
            .head-menu-item-text{
              transform: translateY(-24px);
              transition-delay: 200ms;
            }
          }
          &.active{
            background-color: #2C64FF;
            color: white;
          }
        }
      }
      .head-bar-home{
        pointer-events: auto;
        background-color: #2C64FF;
        color: white;
        text-align: center;
        line-height: 60px;
        font-size: 32px;
        font-weight: 900;
        box-shadow: 0 0 0 12px #F7F7F7;      
      }
    }
  }
}
</style>
