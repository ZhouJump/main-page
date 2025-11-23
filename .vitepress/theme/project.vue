<script setup>
import { ref } from 'vue'
import Hero from './comp/hero.vue'
import { useData } from 'vitepress'
const { site, frontmatter } = useData()

function setViewData(index,event){
    viewData.value = DataList[index]
    event.preventDefault()
}

const viewData = ref({})
const DataList = [
    {
        name: '粥粥个人博客',
        desc: '我们所度过的每个平凡的日常，也许就是连续发生的奇迹。',
        link: 'https://blog.zhoujump.club',
    },
    {
        name: '简历编辑器',
        desc: '做简历什么的，超简单的拉！',
        link: 'https://resume.zhoujump.club',
    },
    {
        name: '码农名片生成器',
        desc: '生成vscode风格的名片',
        link: 'https://businesscard.zhoujump.club/',
    },
    {
        name: '掌上莆院(uniapp+uniCloud)',
        desc: '学校的教务系统真的很难用！',
        link: 'https://github.com/ZhouJump/JiaowuUniapp',
    },
    {
        name: '邮件收发系统(MySQL+Spring)',
        desc: '一个MySQL的小课程设计',  
        link: 'https://github.com/ZhouJump/mail-system-mysql',
    },
    {
        name: '小蓝书(原生微信小程序)',
        desc: '一个微信小程序的课程设计',
        link: 'https://github.com/ZhouJump/wechat-little-blue-book',
    },
]
</script>
<template>
    <div class="project">
        <hero :desc="frontmatter.desc" :desc2="frontmatter.desc2" :page="frontmatter.page"></hero>
        <div class="project-list">
            <a v-for="(item,index) in DataList" :key="index" :href="item.link" class="project-item" @click="setViewData(index,$event)">
                <span>{{ item.name }}</span>
            </a>
        </div>
        <div @click="viewData = {}" :class="['view-mask',{'show':viewData.name}]">
            <div @click.stop="" class="view-cont">
                <div class="view-header">
                    <div class="desc">{{ viewData.desc }}</div>
                    <div @click="viewData = {}" class="close">关闭</div>
                </div>
                <div class="view-desc">
                    <div class="name">{{ viewData.name }}</div>
                    <div class="desc">{{ viewData.desc }}</div>
                </div>
                <div class="view-website">
                    <div class="view-inner">
                        <div class="view-text">
                        预览加载中
                        </div>
                        <iframe class="view-iframe" :src="viewData.link" frameborder="0"></iframe>
                    </div>
                </div>
                <div class="view-link">
                    <a :href="viewData.link" target="_blank">打开链接</a>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.project{
    position: relative;
    .view-mask{
        transition-duration: 400ms;
        pointer-events: none;
        padding: 8px;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #00000000;
        z-index: 200;
        display: flex;
        justify-content: flex-end;
        .view-cont{
            display: grid;
            grid-template-rows: auto auto 1fr auto;
            font-family: 'NotoSerifSC';
            transition-duration: 600ms;
            border-radius: 12px;
            width: 50vw;
            height: 100%;
            background-color: white;
            transform: translateX(calc(100% + 16px));
            .view-link{
                margin: 0 16px 16px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                a{
                    margin-right: 12px;
                    font-weight: 400;
                    position: relative;
                    width: fit-content;
                    text-decoration: none;
                    font-size: 18px;
                    color: #111111;
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
            }
            .view-website{
                pointer-events: none;
                position: relative;
                width: 100%;
                height: 100%;
                .view-inner{
                    border: 1px solid #e2e2e2;
                    background-color: #F7F7F7;
                    border-radius: 8px;
                    overflow: hidden;
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    width: calc(100% - 24px);
                    height: calc(100% - 24px);
                    .view-text{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                        font-size: 18px;
                        color: #a0a0a0;
                     }
                    .view-iframe{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%) scale(0.67);
                        width: 150%;
                        height: 150%;
                    }
                }
            }
            .view-desc{
                padding: 16px;
                .name{
                    margin: 12px;
                    font-size: 28px;
                    font-weight: 600;
                }
                .desc{
                    margin-left: 12px;
                    font-size: 18px;
                    color: #a0a0a0;
                }
            }
            .view-header{
                border-bottom: 1px solid #e2e2e2;
                font-weight: 100;
                font-size: 14px;
                padding: 8px 16px;
                display: flex;
                justify-content: space-between;
                .desc{
                    color: #a0a0a0;
                }
                .close{
                    cursor: pointer;
                    font-weight: 600;
                    color: #111111;
                }
            }
        }
        &.show{
            pointer-events: auto;
            background-color: #00000066;
            .view-cont{
                transform: translateX(0);
            }
        }
    }
    .project-list{
        position: relative;
        width: 100%;
        .project-item{
            position: relative;
            font-family: 'NotoSerifSC';
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
<style>
@keyframes text-in{
    from{
        opacity: 0;
        transform: translateY(80%);
    }
    to{
        opacity: 1;
        transform: translateY(0);
    }
}
</style>