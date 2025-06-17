<template>
  <div class="echarts">
    <div class="top">
      <echartsItem title="当前温度">
        <echartsBar></echartsBar>
      </echartsItem>
      <echartsItem title="设备电压">
        <echartsVoltLine></echartsVoltLine>
      </echartsItem>
    </div>
    <div class="bottom">
      <echartsItem title="当前湿度">
        <echartsLine></echartsLine>
      </echartsItem>
      <echartsItem title="设备信息" class="wide-item">
        <echartsList></echartsList>
      </echartsItem>
      <echartsItem title="环境烟雾">
        <echartsSmogBar></echartsSmogBar>
      </echartsItem>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import echartsItem from "./components/echartsItem.vue";
import echartsBar from "./components/echartsBar.vue";
import echartsLine from "./components/echartsLine.vue";
import echartsList from "./components/echartsList.vue";
import echartsVoltLine from "./components/echartsVoltLine.vue";
import echartsSmogBar from "./components/echartsSmogBar.vue";
import useSocketStore from "@/stores/websocket";

const socketStore = useSocketStore();
onMounted(() => {
  // let url = `ws://192.168.224.232:8080/webSocket`;
  let url = `ws://ytt2wx.natappfree.cc/webSocket`;
  socketStore.connection(url);
});
// onUnmounted(()=>{
//   socketStore.closeWs();
// })

// onBeforeUnmount(() => {
//     socketStore.closeWs();
// })
</script>

<style lang="scss">
.echarts {
  display: flex;
  flex-wrap: wrap;
  min-width: 1024px;
  max-width: 1680px;
  margin: 0 auto;
  padding: 0.2597rem 0.1299rem 0;
  .top,
  .bottom {
    display: flex;
    justify-content: space-between;
    width: 100%; // 确保占据整个宽度
    flex: 2 0 auto; // 避免收缩，保持空间
  }
  .top > *,
  .bottom > * {
    // 应用于.top和.bottom的所有直接子元素
    flex-basis: calc(
      25% - 2 * 0.1299rem
    ); // 假设每个项目之间有padding或margin，这里减去两倍的padding/margin值
    margin-bottom: 1rem;
  }
  .bottom .wide-item {
    // 特定于底部的宽项
    flex-basis: calc(48% - 2 * 0.1299rem); // 占据一半的空间减去padding/margin
  }
}
</style>
