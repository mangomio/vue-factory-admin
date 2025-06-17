<template>
  <page-container title="人员管理">
    <template #extra>
      <el-button @click="onAddPerson">添加</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item class="people_from" label="姓名：">
        <el-input v-model="searchName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onAddPerson">添加</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table
      class="people_table"
      v-loading="loading"
      :data="filteredPersonList"
      style="width: 100%"
    >
      <el-table-column type="index" label="编号" width="150" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="message" label="信息" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="onEditPerson(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="onDelPerson(row)">
            删除
          </el-button>
        </template>
      </el-table-column>

      <!-- 空状态 -->
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

    <!-- 引入弹层子组件 Edit-Prop 并传递数据 -->
    <Edit-Prop
      ref="dialog"
      :modelValue="dialogVisible"
      :formData="currentPerson"
      @sucess="onSuccess"
      @submit="handleSubmit"
      @update:modelValue="dialogVisible = $event"
    />

  </page-container>
</template>

<script setup>
import { delPerson, getPerson } from '@/apis/person';
import { ref, computed } from 'vue'
// import { personListService } from '@/api/person.js'

const personList = ref([
  { id: 1, name: '员工1', message: '2023-01-01' },
  { id: 2, name: '员工2', message: '2023-12-15' }
]) 
const params = ref({
  page: 1,
  // pagesize=5,
  message:''
})
const total = ref(0)
const getPersonList = async () => {
  // const res = awiat personListService(params.value)
  personList.value = res.data.data
  total.value=res.data.total
}

const searchName = ref('')
const loading = ref(false)
const dialog=ref()
const dialogVisible = ref(false)
const currentPerson = ref({}) // 当前选中的人员，用于传递给子组件

// 搜索人员
const onSearch = () => {
  // 可以根据姓名来进行搜索，这里仅简单示范
}

// 过滤后的人员列表
const filteredPersonList = computed(() => {
  if (!searchName.value) {
    return personList.value
  }
  return personList.value.filter((person) =>
    person.name.includes(searchName.value)
  )
})

// 添加人员
const onAddPerson = () => {
  // currentPerson.value = { id: null, name: '', message: '' } // 清空表单，表示添加新人员
  dialog.value.open({})
  // dialogVisible.value = true
}

// 编辑人员
const onEditPerson = (row) => {
  // currentPerson.value = { ...row } // 将选中行的数据传给表单，准备编辑
  dialog.value.open(row)
  // dialogVisible.value = true
}
const onSuccess = () => {
  // getPerson()
}
// 删除人员
const onDelPerson = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  personList.value = personList.value.filter((person) => person.id !== row.id) // 删除数据

  // await delPerson(row.id)
  ElMessage.success('删除成功')
  // getPerson()
}

// 处理提交的数据
const handleSubmit = (formData) => {
  if (formData.id) {
    // 如果存在 id，表示是编辑操作，更新对应数据
    const index = personList.value.findIndex((item) => item.id === formData.id)
    if (index >= 0) {
      personList.value.splice(index, 1, formData)
    }
  } else {
    // 如果没有 id，表示是新增数据
    formData.id = new Date().getTime() // 为新数据生成唯一 id
    personList.value.push(formData)
  }
  dialogVisible.value = false // 关闭对话框
}
</script>

<style lang="scss" scoped>
.people_from ::v-deep .el-form-item__label {
  color: white;
}

.people_table{
  --el-table-header-bg-color:#0a548c;
  --el-table-tr-bg-color: #06416b;
  --el-table-border-color: none;
  --el-table-row-hover-bg-color:#032956;
  color: white;
}

.pagination{
  justify-content: end;
  background-color: transparent !important;
}
</style>
