<template>
  <div ref="line" class="line" style="height: 100%"></div>
</template>

<script setup>
import * as echarts from "echarts";
import {
  onMounted,
  onBeforeUnmount,
  onActivated,
  ref,
  watch,
  toRaw,
} from "vue";
import useSocketStore from "@/stores/websocket";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";

// 初始化store
const socketStore = useSocketStore();
const { msg } = storeToRefs(socketStore);

// 数据和时间戳
const dataEnv1 = ref([]); // 环境一的数据
const dataEnv2 = ref([]); // 环境二的数据
const timestamps = ref([]); // 时间戳列表

const line = ref(null); // 图表容器DOM
let myChart = null; // ECharts实例

// 初始化图表
const initChart = () => {
  if (line.value) {
    myChart = echarts.init(line.value);
    renderChart(dataEnv1.value, dataEnv2.value, timestamps.value);
  } else {
    console.error("Chart container not found.");
  }
};

// 销毁图表
const destroyChart = () => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
};

// 渲染图表
const renderChart = (data1, data2, timestamps) => {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      top: "0%",
      data: ["环境一", "环境二"],
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: 12,
      },
    },
    grid: {
      left: "0",
      top: "30",
      right: "0",
      bottom: "0",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: timestamps,
        boundaryGap:true,
        axisLabel: { textStyle: { color: "#fff" } },
        splitLine: { show: false },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,.2)",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          textStyle: { color: "#fff" },
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "环境一",
        type: "line",
        smooth: true,
        lineStyle: { color: "#0184d5", width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              { offset: 0, color: "rgba(1, 132, 213, 0.4)" },
              { offset: 0.8, color: "rgba(1, 132, 213, 0.1)" },
            ],
            false
          ),
          shadowColor: "rgba(0, 0, 0, 0.1)",
        },
        symbol: "circle",
        symbolSize: 8,
        showSymbol: false,
        itemStyle: {
          color: "#0184d5",
          borderColor: "rgba(221,220,107,.1)",
          borderWidth: 12,
        },
        emphasis: { focus: "series" },
        data: data1,
      },
      {
        name: "环境二",
        type: "line",
        smooth: true,
        lineStyle: { color: "#00d887", width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              { offset: 0, color: "rgba(0, 216, 135, 0.4)" },
              { offset: 0.8, color: "rgba(0, 216, 135, 0.1)" },
            ],
            false
          ),
          shadowColor: "rgba(0, 0, 0, 0.1)",
        },
        symbol: "circle",
        symbolSize: 8,
        showSymbol: false,
        itemStyle: {
          color: "#00d887",
          borderColor: "rgba(221,220,107,.1)",
          borderWidth: 12,
        },
        emphasis: { focus: "series" },
        data: data2,
      },
    ],
  };

  if (myChart) {
    myChart.setOption(option, { notMerge: true, silent: false });
  }
};

// 监听消息
watch(
  msg,
  (newMessage) => {
    const rawMessage = toRaw(newMessage);
    if (!rawMessage) return;

    // 更新数据
    if (rawMessage.type === 1) {
      // console.log(newMessage)
      dataEnv1.value.push(rawMessage.data[3]);

      // 更新时间戳
      const currentTime = dayjs().format("HH:mm:ss");
      timestamps.value.push(currentTime);
      if (timestamps.value.length > 5) timestamps.value.shift();

      if (dataEnv1.value.length > 5) dataEnv1.value.shift();
    } else if (rawMessage.type === 2) {
      dataEnv2.value.push(rawMessage.data[3]);
      if (dataEnv2.value.length > 5) dataEnv2.value.shift();
    }

    // 渲染图表
    renderChart(dataEnv1.value, dataEnv2.value, timestamps.value);
    // console.log(timestamps.value)
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

// 处理页面切换
onActivated(() => {
  if (!myChart) initChart();
});

// 监听窗口大小变化
const resizeChart = () => {
  if (myChart) myChart.resize();
};
window.addEventListener("resize", resizeChart);

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeChart);
});
</script>

<style scoped>
.line {
  height: 100%;
  width: 100%;
}
</style>
