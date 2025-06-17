<template>
    <div class="table-container">
        <table>
            <tr>
                <th>设备名称</th>
                <th>设备状态</th>
                <th>设备位置</th>
            </tr>
            <tr v-for="item in displayedDevices" :key="item.deviceId">
                <td>{{ item.name }}</td>
                <td>{{ item.status === 1 ? '在线' : '下线' }}</td>
                <td>{{ item.location || '一层' }}</td>
            </tr>    
        </table>
    </div>
</template>

<script setup>
import useSocketStore from '@/stores/websocket';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';

// 初始化store
const socketStore = useSocketStore();
const { msg } = storeToRefs(socketStore);

// 设备列表
const deviceList = ref([]);

// 只展示5条数据
const displayedDevices = ref([]);

// 监听 WebSocket 消息变化
watch(msg, (newMessage) => {
  if (newMessage && newMessage.type === 10) {
    //  console.log(newMessage)
    deviceList.value = newMessage.data.map(item => ({
      name: item.name || `设备${item.deviceId}`, // 默认设备名称
      status: item.status, // 假设 1 表示在线，其他值表示离线
      location: item.location || '一层', // 默认位置为一层
      deviceId: item.deviceId // 假设每个设备有一个唯一的 deviceId
    }));

    // 限制只显示5条数据
    displayedDevices.value = deviceList.value.slice(0, 5);
  }
}, { immediate: true }); // 立即执行一次以捕获初始值
</script>

<style lang="scss" scoped>
.table-container {
  table {
    width: 100%; 
    border-collapse: collapse; 
  }
  th, td {
    padding: .2078rem .3896rem;
    color: #fff;
    font-size: .1875rem;
    text-align: center; 
  }
}
</style>