<template>
    <div class="panel">
        <h2>
            <div class="title-left"></div>
           <span class="title-inner">{{title}}</span> 
           <div class="title-right"></div>
        </h2>
        <div class="chart">
            <slot></slot>
        </div>
        <div class="panel-footer"></div>
    </div>
</template>
<script setup>
defineProps({
    title: {
        type: String
    }
})
</script>
<style lang="scss" >
.panel{
    position: relative;
    height: 4.6753rem;
    margin: 0 .1948rem .5195rem;
    background:rgba(28, 41, 59, 0.3);
    margin-bottom:.6494rem;
    background-size:cover; 
    }
    h2{
        height: .6234rem;
        line-height: .6234rem;
        text-align: center;
        font-size: .2338rem;
        font-weight: 900;
        // background:rgba(33, 49, 75, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        .title-left{
            width: 58px;
            height: 14px;
            background:url('@/assets/images/titles/zuo.png')
        }
         .title-right{
            width: 58px;
            height: 14px;
            background:url('@/assets/images/titles/you.png')
        }
         .title-inner{
        background: linear-gradient(
        92deg,
        #94b8e8 0%,
        #4181e1 100%
      );
        background-clip: text;
        -webkit-text-fill-color: transparent;
        }

    }
    .chart{
        height: 4rem;
        width: 100%;
    }
</style>