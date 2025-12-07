<script setup>
import Hero from './comp/hero.vue'
import { data as blogData } from '../loader/blog.data.js'
import { useData } from 'vitepress'
import { ref } from 'vue'
const { site, frontmatter } = useData()

const items = ref(blogData.rss.channel.item)
const currentBlog = ref({
    left: 0,
    top: 0,
    height: 0,
    content: '',
})
const handleMouseMove = (e) => {
    currentBlog.value.left = e.clientX - (e.clientX / window.innerWidth) * 600
    currentBlog.value.top = e.clientY + 24
    currentBlog.value.height = document.querySelector('.float-blog .inner').scrollHeight * 0.556 + 16
}
const handleMouseLeave = () => {
    currentBlog.value.height = 0
}
console.log(items.value)
</script>
<template>
    <div class="blog">
        <hero :desc="frontmatter.desc" :desc2="frontmatter.desc2" :page="frontmatter.page"></hero>
        <div @mousemove="handleMouseMove" @mouseleave="handleMouseLeave" class="blog-list">
            <a @mouseenter="currentBlog.content = item.description" :href="item.link" class="blog-item" v-for="item in items" :key="item.title">
                <span>{{ item.title }}</span>
            </a>
        </div>
        <div :style="{ left: currentBlog.left + 'px', top: currentBlog.top + 'px', height: currentBlog.height + 'px' }" :class="['float-blog', {'show': currentBlog.height > 0}]">
            <div class="inner" v-html="currentBlog.content"></div>
        </div>
    </div>
</template>
<style>
    .float-blog{
        .inner{
            color: #111111;
            font-family: 'Noto Serif SC';
            font-weight: 600;
            img{
                border-radius: 12px;
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
            }
        }
    }
</style>
<style scoped>
.blog{
    position: relative;
    .float-blog{
        overflow: hidden;
        padding: 8px;
        pointer-events: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 600px;
        background-color: #FFFFFF;
        border-radius: 16px;
        box-shadow: 0 0 16px #00000022;
        z-index: 200;
        transition-duration: 300ms;
        transition-property: transform, height, opacity;
        transform: translateY(-50%) scale(0.8);
        opacity: 0;
        &.show{
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        .inner{
            transform-origin: top left;
            width: 180%;
            scale: 0.556;
        }
    }
    .blog-list{
        position: relative;
        width: 100%;
        .blog-item{
            position: relative;
            font-family: 'Noto Serif SC';
            font-weight: 100;
            border-top: 1px solid #e2e2e2;
            display: block;
            text-decoration: none;
            color: #111111;
            font-size: 2.5vw;
            padding: 30px 20px;
            animation: text-in 1s ease-out forwards;
            animation-timeline: view(60% 0);
            animation-range: contain;
            opacity: 0;
            transform: translateY(80%);
            span{
                transition-duration: 200ms;
                position: relative;
            }
            &::before{
                transition-duration: 300ms;
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transform: scaleY(0);
                background-color: #2C64FF;
            }
            &:last-child{
                border-bottom: 1px solid #e2e2e2;
            }
            &:hover{
                color: white;
                &::before{
                    transform: scaleY(1);
                }
            }
        }
    }
}
</style>
