<template>
 <page-container title="预警记录">
    <!-- 预警表单区域 -->
     <el-form inline>
        <el-form-item>
            <el-input placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item>
            <el-input placeholder="请输入房间号"></el-input>
        </el-form-item>
        <el-form-item label="预警类型">
            <el-select placeholder="请选择预警类型" style="width:200px">
                <el-option label="温度异常"></el-option>
                <el-option label="湿度异常"></el-option>
                <el-option label="电压异常"></el-option>
                <el-option label="环境烟雾浓度异常"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary">导出</el-button>
        </el-form-item>
     </el-form>

     <!-- 表格区域 -->
    <el-table
        v-loading="loading"
        :data="warnList"
        style="width: 100%"
        class="warn_table"
    >
    <el-table-column prop="name" label="设备名称" width="150" />
    <el-table-column prop="home_id" label="房间号" />
    <el-table-column prop="type" label="预警类型" />
    <el-table-column prop="time" label="时间" />
    <el-table-column prop="state" label="状态">
        <template #default="{ row }">
        <span>{{ row.state }}</span>&nbsp;&nbsp;&nbsp;
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

 </page-container>

</template>

<script setup>
import { ref } from 'vue';
const warnList = ref([
    {id:1,name:'',home_id:'',type:'',time:'',state:''},
    {id:2,name:'',home_id:'',type:'',time:'',state:''}
])
</script>

<style lang="scss" scoped>
.list-container{
    background-color: rgba(28, 41, 59, 0.3);
}
::v-deep .el-form-item__label {
    color: white;
}
.warn_table{
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
