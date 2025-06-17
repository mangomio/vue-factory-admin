<template>
  <page-container title="设备列表">
    <!-- <template #extra>
      <el-button @click="onAddDevice">添加</el-button>
    </template> -->
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="设备名称：">
        <el-input v-model="searchName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="设备类型：">
        <el-input v-model="searchType" placeholder="请输入类型"></el-input>
      </el-form-item>
      <el-form-item label="设备状态：">
        <el-select
          v-model="searchState"
          placeholder="请选择"
          style="width: 100px"
        >
          <el-option label="在线" value="在线"></el-option>
          <el-option label="下线" value="下线"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onAddDevice">添加</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
  <el-table
  v-loading="loading"
  :data="filteredDeviceList"
  style="width: 100%"
  class="device_table"
>
  <el-table-column type="index" label="编号" width="150" />
  <el-table-column prop="name" label="名称" />
  <el-table-column prop="place" label="位置" />
  <el-table-column prop="type" label="情况" />
  <el-table-column prop="state" label="状态">
    <template #default="{ row }">
      <span>{{ row.state }}</span>&nbsp;&nbsp;&nbsp;
      <!-- <el-switch
        v-model="row.state"
        active-value="在线"
        inactive-value="下线"
        @change="handleStateChange(row)"
      ></el-switch> -->
    </template>
  </el-table-column>
  <!-- <el-table-column label="操作">
    <template #default="{ row }">
      <el-button size="small" type="primary" @click="onEditDevice(row)">
        编辑
      </el-button>
      <el-button size="small" type="danger" @click="onDelDevice(row)">
        删除
      </el-button>
    </template>
  </el-table-column> -->
  <template #empty>
    <el-empty description="暂无数据" />
  </template>
  </el-table>

  <!-- 分页 -->
   <el-pagination
      :total="5"
      class="pagination"
      layout="prev, pager, next"
      background
      size="small"
    />

    <!-- 引入子组件 Device-Edit 并传递数据 -->
    <Device-Edit
      ref="dialog"
      :modelValue="dialogVisible"
      :formData="currentDevice"
      dialogTitle="编辑设备"
      @submit="handleSubmit"
      @update:modelValue="dialogVisible = $event"
    />
    
  </page-container>

  <!-- <Message></Message> -->
</template>

<script setup>
import { ref, computed,onMounted } from 'vue'
// import { deviceListService } from '@/api/device.js'
onMounted(()=> {
    console.log(filteredDeviceList.value[1].state)
    console.log(deviceList.value[1].state)
})
const deviceList = ref([
  { id: 1, name: '设备1',place:'楼层一,房间一',type: '正常', state: '在线' },
  { id: 2, name: '设备2', place: '楼层一,房间二', type: '正常', state: '下线' },
  { id: 3, name: '设备1',place:'楼层一,房间一',type: '正常', state: '在线' },
  { id: 4, name: '设备2', place: '楼层一,房间二', type: '正常', state: '下线' },
  { id: 5, name: '设备1',place:'楼层一,房间一',type: '正常', state: '在线' },
  { id: 6, name: '设备2',place:'楼层一,房间二',type: '正常', state: '下线' }
]) 

const searchName = ref('')
const searchType = ref('')
const searchState = ref('')
const loading = ref(false)
const dialogVisible = ref(false)
const currentDevice = ref({}) // 当前选中的设备，用于传递给子组件

// 搜索设备
const onSearch = () => {
  // 可以根据设备名称、类型和状态来进行搜索，这里仅简单示范
}

// 过滤后的设备列表
const filteredDeviceList = computed(() => {
  return deviceList.value.filter((device) => {
    return (
      (!searchName.value || device.name.includes(searchName.value)) &&
      (!searchType.value || device.type.includes(searchType.value)) &&
      (!searchState.value || device.state === searchState.value)
    )
  })
})


const handleStateChange = (row) => {
    console.log(`设备 ${row.name} 的状态更改为 ${row.state}`);
    console.log(deviceList.value[1].state)
}

// 添加设备
const onAddDevice = () => {
  currentDevice.value = { id: null, name: '', type: '', state: '' } // 清空表单，表示添加新设备
  dialogVisible.value = true
}

// 编辑设备
const onEditDevice = (row) => {
  currentDevice.value = { ...row } // 将选中行的数据传给表单，准备编辑
  dialogVisible.value = true
}

// 删除设备
const onDelDevice = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  deviceList.value = deviceList.value.filter((device) => device.id !== row.id) // 删除数据
  ElMessage.success('删除成功')
}

// 处理提交的数据
const handleSubmit = (formData) => {
  if (formData.id) {
    // 如果存在 id，表示是编辑操作，更新对应数据
    const index = deviceList.value.findIndex((item) => item.id === formData.id)
    if (index >= 0) {
      deviceList.value.splice(index, 1, formData)
    }
  } else {
    // 如果没有 id，表示是新增数据
    formData.id = new Date().getTime() // 为新数据生成唯一 id
    deviceList.value.push(formData)
  }
  dialogVisible.value = false // 关闭对话框
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
    color: white;
}
.device_table{
  --el-table-header-bg-color:#0a548c;
  --el-table-tr-bg-color: #06416b;
  --el-table-border-color: none;
  --el-table-row-hover-bg-color:#032956;
  color: white;
}

.pagination{
  justify-content: end;
}
</style>
