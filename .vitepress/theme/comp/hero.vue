<script setup>
import { onMounted } from 'vue'
function initHero() {
  const blocks = document.querySelectorAll('.block.flip')
  blocks.forEach((block, index) => {
    setTimeout(() => {
      block.classList.remove('flip')
    }, (index + 1) * 20)
  })
}
defineProps({
  desc: {
    type: String,
    default: '0000000000000000'
  },
  desc2: {
    type: String,
    default: '0000000000000000'
  }
})
onMounted(() => {
  initHero()
})
</script>
<template>
  <div class="hero-text-cont">
    <div v-for="index in 51" class="block"></div>
    <div v-for="value in desc" :class="['block',value!=='0' ? 'flip' : '']"><span>{{ value!=='0' ? value : '' }}</span></div>
    <div v-for="value in desc2" :class="['block',value!=='0' ? 'flip' : '']"><span>{{ value!=='0' ? value : '' }}</span></div>
    <div v-for="index in 51" class="block"></div>
  </div>
</template>
<style scoped>
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
            &.flip{
                span{
                    transform: rotate3d(0, 1, 0, 180deg);
                }
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
</style>
