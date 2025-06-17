<template>
  <div ref="bar" class="bar" style="height: 100%; width: 100%"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, onActivated, ref, watch, toRaw } from 'vue';
import useSocketStore from '@/stores/websocket';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';

// 初始化store
const socketStore = useSocketStore();
const { msg } = storeToRefs(socketStore);

// 初始数据和时间戳
const data = ref([]);
const timestamps = ref([]);

// ECharts实例和DOM引用
const bar = ref(null);
let myChart = null;

// 渲染图表函数
const renderChart = (data, timestamps) => {
  if (!myChart) {
    console.error('ECharts instance is not initialized.');
    return;
  }

  const option = {
    color: ['skyblue'],
    grid: {
      left: '10',
      top: '30',
      right: '10',
      bottom: '0',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      axisLabel: { textStyle: { color: '#fff' } },
      data: timestamps,
    },
    yAxis: {
      type: 'value',
      axisLabel: { textStyle: { color: '#fff' } },
      splitLine: { show: false },
    },
    series: [
      {
        data: data,
        type: 'bar',
        barWidth: 18,
        label: {
          show: true,
          position: 'top',
          textStyle: { color: '#fff' },
        },
        itemStyle: {
          barBorderRadius: 7,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'blue' },
              { offset: 1, color: 'skyblue' },
            ],
          },
        },
      },
    ],
  };

  myChart.setOption(option, { notMerge: true, silent: false });
};

// 初始化图表
const initChart = () => {
  if (bar.value) {
    myChart = echarts.init(bar.value);
    renderChart(data.value, timestamps.value);
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

// 监听msg变化，更新数据并重新渲染图表
watch(
  msg,
  (newMessage) => {
    if (!newMessage) return; // 确保 newMessage 不为 null 或 undefined

    if (newMessage.type === 1) {
       console.log(newMessage)
      const temperature = newMessage.data[1];
      data.value.push(temperature);

      const currentTime = dayjs().format('HH:mm:ss');
      timestamps.value.push(currentTime);

      if (timestamps.value.length > 5) timestamps.value.shift();
      if (data.value.length > 5) data.value.shift();

      renderChart(data.value, timestamps.value);
    }
  },
  { immediate: true }
);

// 生命周期管理
onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  destroyChart();
});

onActivated(() => {
  if (!myChart) {
    initChart();
  }
});

// 监听窗口大小变化
const resizeChart = () => {
  if (myChart) {
    myChart.resize();
  }
};
window.addEventListener('resize', resizeChart);

// 清理全局事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
});
</script>

<style scoped>
.bar {
  height: 100%;
  width: 100%;
}
</style>
