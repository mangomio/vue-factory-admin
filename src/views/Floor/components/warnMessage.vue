<template>
  <el-card class="warn-message-card">
    <template #header>
      <div class="card-header">
        <span>预警记录</span>
      </div>
    </template>
    <el-timeline class="warn-message-timeline">
      <el-timeline-item
        v-for="(activity, index) in formattedWarnMessages"
        :key="index"
        :timestamp="activity.timestamp"
         :hollow="activity.hollow"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

// 定义 props
const props = defineProps({
  warnMessages: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// 转换时间戳为日期格式，并限制只展示最新的5条数据
const formattedWarnMessages = computed(() => {
  // 倒序处理
  const sortedMessages = [...props.warnMessages].sort(
    (a, b) => b.warnTime - a.warnTime
  );

  // 只返回最新的5条数据
  return sortedMessages.slice(0, 5).map((message) => ({
    ...message,
    timestamp: dayjs(message.warnTime).format("YYYY-MM-DD HH:mm:ss"),
    content: message.detail,
  }));
});
</script>

<style lang="scss" scoped>
.warn-message-card {
  max-width: 480px;
  max-height: 500px;
  font-size: 20px;
  font-weight: 400;
  margin-top: 20px;
  background-color: rgba(28, 41, 59, 0.3);
  color: #fff;
  border: none;
  .card-header {
    margin-bottom: 0;
  }
  .warn-message-timeline {
    color: #fff;
    ::v-deep .el-timeline-item__content {
      color: #fff;
    }
  }
}
</style>
