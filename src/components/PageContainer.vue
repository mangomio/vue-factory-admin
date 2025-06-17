<template>
  <el-card class="list-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<style lang="scss">
.list-container{
  // min-height: 100%;
  box-sizing: border-box;
  //background-color: rgba(28, 41, 59, 0.3);
  border: none;
  padding: 20px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    color: #000000;
  }
  .el-card__header {
    border-bottom: 1px solid transparent;
  }
}

</style>
