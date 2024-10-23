<script setup>
import Header from '@/components/common/Header.vue';
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
}
</style>
