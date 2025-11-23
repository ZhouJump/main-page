<script setup>
import { useData } from 'vitepress'
// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
</script>
<template>
  <div class="home">
    <div class="hero-text-cont">
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>

        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>

        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>

        <div class="block"></div>
        <div class="block"></div>
        <div class="block flip" style="--index: 0;"><span>我</span></div>
        <div class="block flip" style="--index: 1;"><span>们</span></div>
        <div class="block flip" style="--index: 2;"><span>所</span></div>
        <div class="block flip" style="--index: 3;"><span>度</span></div>
        <div class="block flip" style="--index: 4;"><span>过</span></div>
        <div class="block flip" style="--index: 5;"><span>的</span></div>
        <div class="block flip" style="--index: 6;"><span>每</span></div>
        <div class="block flip" style="--index: 7;"><span>个</span></div>
        <div class="block flip" style="--index: 8;"><span>平</span></div>
        <div class="block flip" style="--index: 9;"><span>凡</span></div>
        <div class="block flip" style="--index: 10;"><span>的</span></div>
        <div class="block flip" style="--index: 11;"><span>日</span></div>
        <div class="block flip" style="--index: 12;"><span>常</span></div>
        <div class="block"></div>
        <div class="block"></div>

        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block flip" style="--index: 13;"><span>也</span></div>
        <div class="block flip" style="--index: 14;"><span>许</span></div>
        <div class="block flip" style="--index: 15;"><span>就</span></div>
        <div class="block flip" style="--index: 16;"><span>是</span></div>
        <div class="block flip" style="--index: 17;"><span>连</span></div>
        <div class="block flip" style="--index: 18;"><span>续</span></div>
        <div class="block flip" style="--index: 19;"><span>发</span></div>
        <div class="block flip" style="--index: 20;"><span>生</span></div>
        <div class="block flip" style="--index: 21;"><span>的</span></div>
        <div class="block flip" style="--index: 22;"><span>奇</span></div>
        <div class="block flip" style="--index: 23;"><span>迹</span></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>

        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>

        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>

        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>

    </div>
  </div>
</template>
<style scoped>
.home{
    position: relative;
    cursor: default;
    width: 100%;
    height: 100%;
    .hero-text-cont{
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(17, 1fr);
        grid-template-rows: repeat(8, 1fr);
        .block{
            width: 100%;
            height: 100%;
            position: relative;
            perspective: 1000px;
            span{
                transition-timing-function: ease-in-out;
                position: relative;
                display: block;
                width: 100%;
                height: 100%;
                font-size: 4vw;
                backface-visibility: hidden;
                font-weight: 100;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: rotate3d(0, 1, 0, 0deg);
                transition-duration: 400ms;
            }
            &::after{
                font-size: 1.5vw;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition-timing-function: ease-in-out;
                transition-duration: 400ms;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                transform: rotate3d(0, 1, 0, 180deg);
            }
            &:nth-child(4n){
                &::after{
                    content: 'HTML';
                    background-color: #cc421c;
                }
            }
            &:nth-child(4n - 1){
                &::after{
                    content: 'CSS';
                    background-color: #8745ca;
                }
            }
            &:nth-child(4n - 2){
                &::after{
                    content: 'JS';
                    background-color: #61630e;
                }
            }
            &:nth-child(4n - 3){
                &::after{
                    content: 'Vue';
                    background-color: #0f7949;
                }
            }
            &:hover{
                span{
                    transition-duration: 0ms;
                    transform: rotate3d(0, 1, 0, 180deg);
                }
                    &::after{
                    transition-duration: 0ms;
                    transform: rotate3d(0, 1, 0, 360deg);
                }
            }
        }
    }
}
</style>
<style>
@keyframes flip {
    0% {
        transform: rotate3d(0, 1, 0, 180deg);
    }
    100% {
        transform: rotate3d(0, 1, 0, 0deg);
    }
}
</style>