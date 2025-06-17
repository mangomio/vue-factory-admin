<template>
  <page-container title="环境警告列表">
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="警告类型：" >
        <el-select placeholder="请输入类型" v-model="searchType" style="width: 200px">
          <el-option label="火灾预警" value="火灾预警"></el-option>
          <el-option label="烟雾报警" value="烟雾报警"></el-option>
          <el-option label="温度异常" value="温度异常"></el-option>
          <el-option label="湿度异常" value="湿度异常"></el-option>
          <el-option label="电压异常" value="电压异常"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发生位置：">
        <el-input v-model="searchLocation" placeholder="请输入位置"></el-input>
      </el-form-item>
      <el-form-item label="警告级别：">
        <el-select
          v-model="searchLevel"
          placeholder="请选择"
          style="width: 100px"
        >
          <el-option label="高" value="高"></el-option>
          <el-option label="中" value="中"></el-option>
          <el-option label="低" value="低"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="warningList"
      style="width: 100%"
    >
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="detail" label="警告类型" />
      <el-table-column prop="deviceId" label="发生位置" />
      <el-table-column prop="level" label="警告级别" />
       <el-table-column prop="createTime" label="创建时间">
        <template #default="{ row }">
          {{ formatTime(row.warnTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="onViewDetails(row)">
            查看详情
          </el-button>
          <el-button size="small" type="danger" @click="onDelWarning(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无警告信息" />
      </template>
    </el-table>

    <!-- 分页控件 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="onSizeChange"
      @current-change="getData"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 警告详情对话框 -->
    <el-dialog
  v-model="dialogVisible"
  title="警告详情"
  width="500px"
>
      <el-form label-width="100px">
        <el-form-item label="警告类型">
          <el-input v-model="currentWarning.type" disabled />
        </el-form-item>
        <el-form-item label="发生位置">
          <el-input v-model="currentWarning.location" disabled />
        </el-form-item>
        <el-form-item label="警告级别">
          <el-input v-model="currentWarning.level" disabled />
        </el-form-item>
        <el-form-item label="发生时间">
          <el-input v-model="currentWarning.time" disabled />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </page-container>
</template>

<script setup>
import { ref, computed,onMounted} from 'vue'
import { pageWarnList,delWarn,searchWarn} from '@/apis/warn'
import { useUserStore } from '@/stores/user';
import { formatTime } from '@/utlis/format';

const warningList = ref([])
const total = ref(0); // 数据总条数
const searchType = ref('')
const searchLocation = ref('')
const searchLevel = ref('')
const loading = ref(false)
const dialogVisible = ref(false)
const currentWarning = ref({})

const userStore = useUserStore();
const token = userStore.userInfo.token;
// 分页参数
const currentPage = ref(1); // 当前页码
const pageSize = ref(5); // 每页显示条数

// 搜索警告
const onSearch = async () => {
  try {
    const res = await searchWarn(searchType.value, searchLocation.value, searchLevel.value, token);
    console.log(res.data)
    warningList.value = res.data || []; // 修正变量名
    total.value = res.total || 0; // 确保使用正确的总条数字段
  } catch (error) {
    console.error("搜索失败:", error);
  }
};

// 过滤后的警告列表
const filteredWarningList = computed(() => {
  return warningList.value.filter((warning) => {
    return (
      (!searchType.value || warning.type.includes(searchType.value)) &&
      (!searchLocation.value || warning.location.includes(searchLocation.value)) &&
      (!searchLevel.value || warning.level === searchLevel.value)
    )
  })
})

// 分页后的警告列表
const paginatedWarningList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = currentPage.value * pageSize.value
  return filteredWarningList.value.slice(start, end)
})

// 获取分页数据
const getData = async (pageNo = 1) => {
  loading.value = true;
  try {
    const res = await pageWarnList(pageNo, pageSize.value, token);
    console.log(res)
    warningList.value = res.data || []; // 更新当前页数据
    total.value = res.type || 0; // 更新总条数
  } catch (error) {
    console.error("获取分页数据失败:", error);
  } finally {
    loading.value = false;
  }
};

// 每页显示条数变化时触发
const onSizeChange = (newSize) => {
  pageSize.value = newSize;
  getData(1); // 每次改变每页条数时，回到第一页
};

// 查看详情
const onViewDetails = (row) => {
  currentWarning.value = {
    type: row.detail, // 警告类型
    location: row.deviceId, // 发生位置
    level: row.level, // 警告级别
    time: formatTime(row.warnTime) // 发生时间
  };
  dialogVisible.value = true; // 显示详情对话框
};

// 删除设备
const onDelWarning = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  });
  await delWarn(row.id,token); // 删除设备
  await getData(); // 重新获取设备列表
  ElMessage.success('删除成功');
};

// 初始化数据
onMounted(() => {
  getData(); // 初始化分页数据
});
</script>

<style lang="scss" scoped></style>
