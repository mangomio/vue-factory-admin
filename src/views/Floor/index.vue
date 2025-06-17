<template>
  <div class="container">
    <el-card class="floor_select">
      <template #header>
        <div class="header">
          <span>楼层选择</span>
        </div>
      </template>
      <el-scrollbar height="600px">
        <el-tree
          style="max-width: 600px"
          default-expand-all
          :data="room"
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </el-scrollbar>
    </el-card>
    <el-card class="echarts_container">
      <template #header>
        <div class="header">
          <span>详细信息</span>
        </div>
      </template>
      <div class="content-columns">
        <div class="left-column">
          <h4>房间温度、湿度</h4>
          <div ref="bar" class="bar"></div>
          <div class="gauge-row">
            <div ref="gauge1" class="line"></div>
            <div ref="gauge2" class="line"></div>
          </div>
        </div>
        <!-- 右侧列：表格 -->
        <div class="right-column">
          <div class="table-container">
            <table>
              <th>房间设备</th>
              <tr>
                <td>{{ deviceName }}</td>
                <td>{{ deviceStatus }}</td>
              </tr>
            </table>
            <div class="table-fire">
              <div class="fire-title">
                <img src="@/assets/images/hj.png" />
                火源检测
              </div>
              <div class="fire-content">{{ firestate }}到火源</div>
              <div>
                <warnMessage :warnMessages="warnDetailList"></warnMessage>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import {
  onMounted,
  onUnmounted,
  ref,
  watch,
  nextTick,
  onBeforeMount,
} from "vue";
import useSocketStore from "@/stores/websocket";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import warnMessage from "./components/warnMessage.vue";
import { GetRoomAPI } from "@/apis/floor";

const currentRoom = ref("房号 1-1-1");
// 定义树的属性
const defaultProps = {
  children: "children",
  label: "label",
};

const room = ref([]);
const socketStore = useSocketStore();
const { msg } = storeToRefs(socketStore);

const bar = ref(null);
const gauge1 = ref(null);
const gauge2 = ref(null);

let url = `ws://ytt2wx.natappfree.cc/webSocket`;
let myChart = null;
let myChart2 = null;
let myChart3 = null;

const temp = ref([]);
const humi = ref([]);
const timestamps = ref([]);
const deviceName = ref("");
const deviceStatus = ref("");
const firestate = ref("");
const warnDetailList = ref([]);

const renderChart = (temp, humi, timestamps) => {
  if (!myChart) {
    console.error("ECharts instance myChart is not initialized.");
    return;
  }
  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    grid: {
      top: "20%",
      right: "50",
      bottom: "20",
      left: "30",
    },
    xAxis: [
      {
        type: "category",
        data: timestamps,
        axisLine: { lineStyle: { color: "rgba(255,255,255,.1)" } },
        axisLabel: {
          textStyle: { color: "rgba(255,255,255,.7)", fontSize: "14" },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "",
        axisTick: { show: false },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          fontSize: 14,
          color: "rgba(255,255,255,.6)",
        },
        axisLine: {
          min: 0,
          max: 10,
          lineStyle: { color: "rgba(255,255,255,.1)" },
        }, //左线色
      },
      {
        type: "value",
        name: "",
        show: true,
        axisLabel: {
          show: true,
          fontSize: 14,
          formatter: "{value} ",
          color: "rgba(255,255,255,.6)",
        },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "rgba(255,255,255,.1)" } }, //右线色
        splitLine: { show: true, lineStyle: { color: "rgba(255,255,255,.1)" } }, //x轴线
      },
    ],
    series: [
      {
        name: "温度",
        type: "bar",
        data: temp,
        barWidth: "15%",
        itemStyle: {
          barBorderRadius: 15,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#248ff7" },
            { offset: 1, color: "#6851f1" },
          ]),
        },
      },
      {
        name: "湿度",
        type: "line",
        yAxisIndex: 1,
        data: humi,
        lineStyle: {
          width: 2,
        },
        itemStyle: {
          color: "#73b0ac",
        },
        smooth: true,
      },
    ],
  };
  myChart.setOption(option);
};

const render = (smoke) => {
  if (!myChart2) {
    console.error("ECharts instance myChart2 is not initialized.");
    return;
  }
  let option = {
    tooltip: {
      formatter: "{a} <br/>{b} : {c}",
    },
    series: [
      {
        name: "Pressure",
        type: "gauge",
        min: 0,
        max: 4000,
        splitNumber: 10,
        progress: {
          show: true,
        },
        detail: {
          fontSize: 20,
          valueAnimation: true,
          formatter: "{value}",
          textStyle: {
            color: "#fff",
          },
        },
        axisLine: {
          // 刻度线
          lineStyle: {
            width: 10,
            color: [
              [0.5, "#00FF00"],
              [1, "#ffffff"],
            ], // 外圈颜色渐变
          },
        },
        axisLabel: {
          // 刻度标签
          formatter: "{value}",
          textStyle: {
            color: "#fff", // 刻度值文字颜色为黑色
          },
        },
        title: {
          // 调整“环境烟雾”的样式
          color: "#FFFFFF", // 设置文字颜色为白色
          fontSize: 16, // 可根据需要调整字体大小
        },
        data: [
          {
            value: smoke,
            name: "环境烟雾",
            fontSize: 12,
          },
        ],
      },
    ],
  };
  myChart2.setOption(option);
};

const render_gauge = (voltage) => {
  if (!myChart3) {
    console.error("ECharts instance myChart3 is not initialized.");
    return;
  }
  let option = {
    tooltip: {
      formatter: "{a} <br/>{b} : {c}",
    },
    series: [
      {
        min: 0,
        max: 300,
        splitNumber: 10,
        name: "Pressure",
        type: "gauge",
        progress: {
          show: true,
        },
        detail: {
          fontSize: 20,
          valueAnimation: true,
          formatter: "{value}",
          // 设置数据显示部分的文字颜色
          textStyle: {
            color: "#fff",
          },
        },
        axisLine: {
          // 刻度线
          lineStyle: {
            width: 10,
          },
        },
        axisLabel: {
          // 刻度标签
          formatter: "{value}",
          textStyle: {
            color: "#fff", // 刻度值文字颜色为黑色
          },
        },
        title: {
          color: "#FFFFFF",
          fontSize: 16,
        },
        data: [
          {
            value: voltage,
            name: "设备电压",
            color: "#000",
          },
        ],
      },
    ],
  };
  myChart3.setOption(option);
};

const updateCharts = async (roomLabel) => {
  try {
    // 发送房间号到 WebSocket 服务器
    socketStore.sendMsg(roomLabel);

    // 等待服务器返回数据
    const response = await new Promise((resolve, reject) => {
      const handleResponse = (msg) => {
        if (msg.type === "roomData" && msg.room === roomLabel) {
          clearTimeout(timeout);
          resolve(msg.data);
        }
      };
    });
    // 更新图表数据
    if (response) {
      temp.value = response.temp;
      humi.value = response.humi;
      timestamps.value = response.timestamps;

      // 渲染图表
      renderChart(temp.value, humi.value, timestamps.value);
    }
  } catch (error) {
    console.error("Failed to update charts:", error);
    ElNotification({
      title: "错误",
      message: `无法获取房间数据: ${error.message}`,
      type: "error",
    });
  }
};

// 房号选择事件
const handleNodeClick = (nodeData) => {
  currentRoom.value = nodeData.label;
  updateCharts(nodeData.label);
  socketStore.closeWs();
  socketStore.connection(url);
  socketStore.sendMsg(nodeData.label);
  // console.log(nodeData.label);
};

onBeforeMount(() => {
  //重新建立websocket连接
  // socketStore.connection(url);
  socketStore.sendMsg("房号 1-1-1");
});

onMounted(async () => {
//   onMounted(() => {
//   socketStore.connection(url); // 建立 WebSocket 连接
//   socketStore.onConnected(() => { // 确保连接建立后再发送消息
//     socketStore.sendMsg("房号 1-1-1");
//   });
// });
  await GetRoomAPI().then((res) => {
    room.value = res;
  });

  nextTick(() => {
    myChart = echarts.init(bar.value);
    myChart2 = echarts.init(gauge1.value);
    myChart3 = echarts.init(gauge2.value);

    renderChart(temp.value, humi.value, timestamps.value);
    render_gauge(220); // 初始电压值
    render(3000); // 初始烟雾值
  });

  updateCharts("房号 1-1-1"); // 初始加载房间数据
});

const safeRanges = {
  temp: { min: 18, max: 40 }, // 温度安全范围
  humi: { min: 10, max: 70 }, // 湿度安全范围
  voltage: { min: 210, max: 230 }, // 电压安全范围
  smoke: { max: 4000 }, // 烟雾安全范围（假设超过1000为异常）
};

watch(
  msg,
  (newMessage) => {
    // 检查消息是否有效
    if (!newMessage) return;

    // 处理警告消息（type === 7）
    if (newMessage.type === 7) {
      const data = newMessage.data;
      console.log("处理警告消息:", newMessage.type);

      if (data.deviceId === currentRoom.value.slice(3)) {
        ElNotification({
          title: "警告",
          message: `${data.detail}`,
          type: "error",
          offset: 500,
        });
      }
      return; // 处理完警告消息后直接返回，不再执行后续逻辑
    }

    // 处理设备状态更新消息
    if (newMessage.type === currentRoom.value.slice(3)) {
      const data = newMessage.data;
      console.log(data)
      // 更新数据
      warnDetailList.value = data.warnDetailList || [];
      deviceName.value = data.name || "";
      deviceStatus.value = data.status === 1 ? "在线" : "离线";
      firestate.value = data.fire === 0 ? "未检测" : "检测";

      // 清理多余数据
      if (temp.value.length >= 5) {
        temp.value.shift();
      }
      if (humi.value.length >= 5) {
        humi.value.shift();
      }
      if (timestamps.value.length >= 5) {
        timestamps.value.shift();
      }

      // 推送新数据
      temp.value.push(data.temp || 0);
      humi.value.push(data.humi || 0);
      timestamps.value.push(dayjs().format("HH:mm:ss"));

      // 更新图表
      renderChart(temp.value, humi.value, timestamps.value);

      // 更新其他图表
      render_gauge(data.voltage || 0);
      render(data.smoke || 0);

      // 检查异常并发送通知
      // if (
      //   (data.temp < safeRanges.temp.min || data.temp > safeRanges.temp.max) &&
      //   data.temp !== undefined
      // ) {
      //   ElNotification({
      //     title: "警告",
      //     message: `温度异常`,
      //     type: "error",
      //     offset: 500,
      //   });
      // }

    //   if (
    //     (data.humi < safeRanges.humi.min || data.humi > safeRanges.humi.max) &&
    //     data.humi !== undefined
    //   ) {
    //     ElNotification({
    //       title: "警告",
    //       message: `湿度异常`,
    //       type: "error",
    //       offset: 500,
    //     });
    //   }

    //   if (
    //     (data.voltage < safeRanges.voltage.min ||
    //       data.voltage > safeRanges.voltage.max) &&
    //     data.voltage !== undefined
    //   ) {
    //     ElNotification({
    //       title: "警告",
    //       message: `电压异常`,
    //       type: "error",
    //       offset: 500,
    //     });
    //   }

    //   if (data.smoke > safeRanges.smoke.max && data.smoke !== undefined) {
    //     ElNotification({
    //       title: "警告",
    //       message: `烟雾浓度过高`,
    //       type: "error",
    //       offset: 500,
    //     });
    //   }
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  window.removeEventListener("resize", () => {
    if (myChart) myChart.resize();
    if (myChart2) myChart2.resize();
    if (myChart3) myChart3.resize();
  });

  if (myChart) myChart.dispose();
  if (myChart2) myChart2.dispose();
  if (myChart3) myChart3.dispose();
   if (socketStore.socket) {
    socketStore.socket.close(); // 关闭 WebSocket 连接
  }
});

</script>

<style lang="scss">
.container {
  display: flex;
  height: 92vh;
  overflow: hidden;
  .floor_select {
    width: 3.8961rem;
    margin: 20px 50px;
    background-color: rgba(28, 41, 59, 0.3);
    color: white;
    font-size: 18px;
    border: none;
    min-height: 3.8961rem;
    .el-card__header {
      border-bottom: 1px solid transparent;
    }
    .el-tree {
      background: transparent;
      color: #e0dbdb;
      --el-tree-node-hover-bg-color: #a8abb224;
    }
  }
  .echarts_container {
    width: 80%;
    margin: 20px 50px;
    background-color: rgba(28, 41, 59, 0.3);
    color: white;
    font-size: 18px;
    border: none;
    .el-card__header {
      border-bottom: 1px solid transparent;
    }
  }

  .content-columns {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    width: 60%;
  }

  .right-column {
    width: 40%;
    display: flex;
    justify-content: flex-start;
    margin-top: 60px;
    margin-left: 80px;
  }

  .bar {
    width: 100%;
    height: 5rem;
    margin-bottom: 20px;
  }

  .gauge-row {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .line {
    width: 5rem;
    height: 5rem;
    margin: 0 10px;
  }

  .table-container {
    width: 100%;
  }
  .table-fire {
    margin-top: 20px;
    padding: 10px;
    font-size: 20px;
    font-weight: 700;
    img {
      margin-right: 20px;
      width: 30px;
      height: 35px;
    }
    .fire-content {
      margin-top: 20px;
      font-size: 18px;
    }
  }
  table {
    width: 90%;
    border-collapse: collapse;
  }

  th {
    padding: 10px;
    text-align: left;
    width: 50px;
    font-size: 20px;
  }
  td {
    padding: 10px;
    text-align: left;
    width: 50px;
  }
}
</style>
