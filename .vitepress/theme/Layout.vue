<script setup>
import { useData } from 'vitepress'
import Hero from './comp/hero.vue'
import Home from './home.vue'
import Project from './project.vue'
const { site, frontmatter } = useData()
</script>

<template>
  <link rel="stylesheet" href="/icon/iconfont.css">
  <div class="head-bar">
    <a href="/" class="head-bar-home head-item">Z</a>
    <div class="head-menu">
      {{ route }}
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
  <hero :desc="frontmatter.desc" :desc2="frontmatter.desc2"></hero>
  <project v-if="frontmatter.page === 'project'"></project>
  <home v-if="frontmatter.page === 'home'"></home>
</template>
<style>
html{
  /* filter: grayscale(100%); */
  width: 100%;
  height: 100%;
  #app{
    width: 100%;
    height: 100%;
  }
  body {
    overflow: hidden;
    margin: 0;
    padding: 0;
    background-color: #F7F7F7;
    width: 100%;
    height: 100%;
    *{
      box-sizing: border-box;
    }
    .head-bar {
      z-index: 1000;
      padding: 8px;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 76px;
      display: flex;
      justify-content: space-between;
      .head-item{
        box-shadow: 0 0 12px #00000001;
        width: 60px;
        height: 60px;
        border-radius: 12px;
        text-decoration: none;
      }
      .head-menu{
        display: flex;
        align-items: center;
        gap: 4px;
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
        background-color: #2C64FF;
        color: white;
        text-align: center;
        line-height: 60px;
        font-size: 32px;
        font-weight: 900;
      }
    }
  }
}
</style>
