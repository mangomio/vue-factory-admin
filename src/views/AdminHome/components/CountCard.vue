<template>
  <div class="visits-card">
    <div class="icon">
      <img :src="icon"  />
    </div>
    <div class="content">
      <div class="label">{{ title }}</div>
      <div class="value">{{ count }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';

const props = defineProps({
  icon: String,
  title: String,
  count: [String, Number],
});

onMounted(() => {
  console.log(props.icon); // 检查 icon 是否正确传递
});
</script>

<style scoped lang="scss">
.visits-card {
  width: 330px;
  height: 130px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  padding: 10px 20px;
  background-color: #f0f4f8;
  border-radius: 8px;
}

.icon {
  width: 50px;
  height: 50px;
//   background-color: #a8dadc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  img {
    width: 100% ;
    height: 100%;
  }
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.label {
  font-size: 20px;
  color: #333;
  margin-bottom: 4px;
  color: rgba(0, 0, 0, .45);;
}

.value {
  font-size: 24px;
  font-weight: bold;
  color: #1a73e8;
}
</style>
