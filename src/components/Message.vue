<template>
      <el-button plain @click="open">警告提醒</el-button>
</template>

<script setup>
const open = () => {
  ElNotification({
    title: '警告',
    message: '设备电压异常',
    type: 'error',
    offset: 500,
  })
}
</script>