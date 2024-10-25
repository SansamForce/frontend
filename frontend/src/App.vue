<script setup>
import Header from '@/components/common/Header.vue';
import { useUserStore } from '@/stores/UserStore';
import { onMounted } from 'vue';

const userStore = useUserStore();

// 컴포넌트가 마운트될 때 상태 복원 처리
onMounted(() => {
  userStore.initialize(); // Store에서 초기화 로직 호출
});
</script>

<template>
  <div class="bg-gray-900" style="font-family: 'Instrument Sans', sans-serif">
    <Header />
    <router-view />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans&display=swap');

.container {
  margin-top: 20px;
}

body {
  font-family: Georgia, "돋움", serif;
  user-select: none;
}

* {
  user-select: none; /* 모든 요소에 적용 */
}
</style>
