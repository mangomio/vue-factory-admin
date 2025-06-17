<template>
  <div class="chart-header">
    <div class="btn_left_container">
      <RouterLink :to="{path:'echarts'}" class="btn_left">数据监测</RouterLink>
      <RouterLink :to="{path:'floor'}" class="btn_left">楼层管理</RouterLink>
      <!-- <RouterLink :to="{path:'warn'}" class="btn_left">预警信息</RouterLink> -->
    </div>

    <h1>
      <span class="title-text">工厂环境智慧监测及预警系统</span>
    </h1>

    <div class="btn_right_container">
      <RouterLink v-if="isAdmin" :to="{ name: 'manage/personnel' }" class="btn_left">系统管理</RouterLink>
      <div class="time">当前时间：{{ time }}</div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { useDate } from '@/composables/useDate';
import { useUserStore } from '@/stores/user';

const { userInfo } = useUserStore();
const time = useDate().currentTime;

const isAdmin = computed(() => userInfo.role=== 'admin'); 
</script>

<style lang="scss" scoped>
.chart-header {
  position: relative;
  height: 1rem;
  background: url("@/assets/images/header.png") no-repeat;
  background-size: 100% 100%;
  .el-menu--horizontal.el-menu{
    border:none;
  }
  .btn_left_container{
    display: flex;
    gap: 0.4rem; // 间隙
    position: absolute;
    left: .6rem;
    top: .3117rem;
    line-height: .4rem;
    font-size: .25rem;
    color: #324d9a;
    padding: .026rem .1948rem;
    .btn_left {
      position: relative;
      padding: .026rem 0.1rem; // 内边距
      color: #d2d7e5;
      text-decoration: none;
      display: inline-block;
      background: linear-gradient(92deg, #0072FF 0%, #5884bf 48.8525390625%, #2b8ebf 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border: 1px solid #324d9a;
        transform: skewX(-38deg);
      }
      &:hover::before {
        border-color: #183c9e;
        box-shadow: 1px 1px 3px 1px #324d9a inset;
      }
    }
  }
  h1 {
    font-size: 30px;
    background: transparent;
    text-align: center;
    line-height: 1rem;
    .title-text { 
      background: linear-gradient(92deg, #0072FF 0%, #00EAFF 48.8525390625%, #01AAFF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .btn_right_container{
    display: flex;
    position: absolute;
    gap: 5px;
    right: .3896rem;
    top: .3117rem;
    line-height: .4rem;
    font-size: .25rem;
    color: #324d9a;
    padding: .026rem .1948rem;
    .btn_left {
      margin-right: .1299rem;
      position: relative;
      padding: .026rem 0.1rem; // 内边距
      color: #d2d7e5;
      text-decoration: none;
      display: inline-block;
      background: linear-gradient(92deg, #0072FF 0%, #5884bf 48.8525390625%, #2b8ebf 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border: 1px solid #324d9a;
        transform: skewX(-38deg);
      }
      &:hover::before {
        border-color: #183c9e;
        box-shadow: 1px 1px 3px 1px #324d9a inset;
      }
    }
  }
  .time {
    right: .5195rem;
    top: .1299rem;
    color: rgba(255,255,255,0.7);
    font-size:.2597rem;
  }
}
</style>
