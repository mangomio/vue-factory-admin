<template>
  <page-container title="首页">
    <div class="header-card">
      <CountCard icon="/visit.png" title="访问量" :count="visit" />
      <CountCard icon="/user.png" title="现有用户" :count="user" />
      <CountCard icon="/warndevice.png" title="设备总数" :count="device" />
      <CountCard icon="/warnlist.png" title="警报总数" :count="warn" />
    </div>
    <!-- <div class="home-chart" ref="chart"></div> -->
    <el-empty class="empty" description="暂无更多" />
  </page-container>
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import CountCard from "./components/CountCard.vue";
import { getHomeList } from "@/apis/home";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const token = userStore.userInfo.token;
const visit = ref();
const user = ref();
const device = ref();
const warn = ref();
const chart = ref("");

onMounted(async () => {
  try {
    let res = await getHomeList(token);
    visit.value = res.visit;
    user.value = res.user;
    device.value = res.device;
    warn.value = res.warn;

    const myChart = echarts.init(chart.value);
    myChart.setOption({
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: res.chartData || [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          smooth: true,
        },
      ],
    });
  } catch (error) {
    console.error("Failed to fetch home data:", error);
  }
});
</script>

<style scoped lang="scss">
.header-card {
  display: flex;
  justify-content: space-around;
}
.home-chart {
  height: 400px;
  width: 900px;
  max-width: 600px;
  margin: 20px auto;
}
.empty{
  height: 55vh;
}
</style>
