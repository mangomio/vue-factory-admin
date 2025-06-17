<template>
  <div ref="chart" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, ref, watch, toRaw, onBeforeUnmount, onActivated } from 'vue';
import useSocketStore from '@/stores/websocket';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';

// 初始化store
const socketStore = useSocketStore();
const { msg } = storeToRefs(socketStore);

// 初始数据和时间戳
const dataEnv1 = ref([]); // 环境一的数据
const dataEnv2 = ref([]); // 环境二的数据
const dataEnv3 = ref([]); // 环境三的数据
const timestamps = ref([]); // 存储时间戳

let myChart = null;
const chart = ref(null);

// 渲染图表函数
const renderChart = (data1, data2, data3, timestamps) => {
  if (!myChart) {
    console.error('ECharts instance is not initialized.');
    return;
  }

  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      axisLabel: { textStyle: { color: '#fff' }, interval: 0 },
      data: timestamps,
    },
    yAxis: {
      type: 'value',
      axisLabel: { textStyle: { color: '#fff' } },
      splitLine: { show: false },
    },
    series: [
      { name: '设备一', type: 'line', data: data1, lineStyle: { color: '#1E90FF' } },
      { name: '设备二', type: 'line', data: data2, lineStyle: { color: '#896fd0' } },
      { name: '设备三', type: 'line', data: data3, lineStyle: { color: '#13BCBC' } },
    ],
  };

  myChart.setOption(option);
};

// 初始化图表
const initChart = () => {
  if (chart.value) {
    myChart = echarts.init(chart.value);
    renderChart(dataEnv1.value, dataEnv2.value, dataEnv3.value, timestamps.value);
  } else {
    console.error('Chart container not found.');
  }
};

// 销毁图表
const destroyChart = () => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
};

// 监听msg的变化
watch(
  msg,
  (newMessage) => {
    const rawMessage = toRaw(newMessage);
    if (!rawMessage) return;

    if (rawMessage.type === 1) {
      const temperature = rawMessage.data[3];
      dataEnv1.value.push(temperature);
 
      const currentTime = dayjs().format('HH:mm:ss');
      timestamps.value.push(currentTime);
      if (timestamps.value.length > 5) timestamps.value.shift();
      if (dataEnv1.value.length > 5) dataEnv1.value.shift();
    } else if (rawMessage.type === 2) {
      const temperature = rawMessage.data[3];
      dataEnv2.value.push(temperature);
      if (dataEnv2.value.length > 5) dataEnv2.value.shift();
    } else if (rawMessage.type === 3) {
      const temperature = rawMessage.data[3];
      dataEnv3.value.push(temperature);
      if (dataEnv3.value.length > 5) dataEnv3.value.shift();
    }

    renderChart(dataEnv1.value, dataEnv2.value, dataEnv3.value, timestamps.value);
  },
  { immediate: true }
);

// 生命周期
onMounted(() => {
  initChart();
});
onBeforeUnmount(() => destroyChart());

// 切换回来时重新初始化图表
onActivated(() => {
  if (!myChart) {
    initChart();
  }
});

// 监听窗口大小变化
const onResize = () => {
  if (myChart) {
    myChart.resize();
  }
};
window.addEventListener('resize', onResize);
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
}
</style>
