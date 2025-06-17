<template>
  <div ref="chart" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, ref, watch, toRaw } from 'vue';
import useSocketStore from '@/stores/websocket';
import { storeToRefs } from 'pinia';

// 初始化store
const socketStore = useSocketStore();
const { msg } = storeToRefs(socketStore);

let myChart = null; // ECharts实例
const chart = ref(null); // 图表容器
const categories = ['环境一', '环境二', '环境三', '环境四', '环境五']; // 固定分类
const data = ref([]); // 数据数组

// 图表初始化方法
const initChart = () => {
  if (chart.value) {
    myChart = echarts.init(chart.value);
    renderChart(data.value); // 初始化时渲染图表
  } else {
    console.error('Chart container not found.');
  }
};

// 图表销毁方法
const destroyChart = () => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
};

// 渲染图表方法
const renderChart = (data) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {},
    grid: {
      left: '10',
      top: '30',
      right: '10',
      bottom: '-20',
      containLabel: true,
    },
    xAxis: {
      show: false,
      type: 'value',
      max: (value) => parseInt(value.max * 1.2),
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: categories,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9eb1c8' },
    },
    series: [
      {
        type: 'bar',
        barWidth: 14,
        label: {
          show: true,
          position: 'right',
          textStyle: { color: '#fff' },
        },
        showBackground: true,
        backgroundStyle: { color: 'rgba(180,180,180,0.2)' },
        itemStyle: {
          color: '#479AD3',
          barBorderRadius: 7,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 7,
        },
        data: data,
      },
    ],
  };

  if (myChart) {
    myChart.setOption(option);
  }
};

// 监听 WebSocket 消息更新
watch(
  msg,
  (newMessage) => {
    const rawMessage = toRaw(newMessage);
    if (rawMessage && rawMessage.type === 6) {
      const newData = rawMessage.data;

      // 只有当数据发生变化时才更新图表
      if (JSON.stringify(data.value) !== JSON.stringify(newData)) {
        data.value = newData.slice(0, 5); // 限制数据长度为 5
        renderChart(data.value);
      }
    }
  },
  { immediate: true }
);

// 监听窗口大小变化以调整图表大小
const onResize = () => {
  if (myChart) {
    myChart.resize();
  }
};

// 生命周期钩子
onMounted(() => {
  initChart(); // 初始化图表
  window.addEventListener('resize', onResize); // 监听窗口调整
});

onBeforeUnmount(() => {
  destroyChart(); // 销毁图表实例
  window.removeEventListener('resize', onResize); // 移除事件监听器
});
</script>

<style scoped>
/* 设置图表容器的样式 */
div {
  width: 100%;
  height: 100%;
}
</style>
