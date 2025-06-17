<template>
    <div class="chart_page">
        <div class="header_page">
            <LayoutHeader></LayoutHeader>
        </div>  
        <RouterView></RouterView>
    </div>
</template>
<script setup>
import LayoutHeader from './components/LayoutHeader.vue';
</script>

<style lang="scss" scoped>
.chart_page{
   background-image:  url("@/assets/images/gc5.jpg");
    // background-image: url("@/assets/images/gc2.jpg");
    /* 设置背景图片 */
    background-position: center center;
    /* 图片居中 */
    background-size: cover;
    /* 图片填满屏幕并保持比例 */
    background-repeat: no-repeat;
    /* 防止图片重复 */
    height: 100%;
    /* 页面高度填满屏幕 */
    width: 100vw;
    /* 页面宽度填满屏幕 */
    position: relative;
    z-index:0;
}
.chart_page::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, transparent 30%, rgb(33, 42, 49) 80%);
    z-index: -7;
}
.header_page{
    z-index: 10;
}
</style>