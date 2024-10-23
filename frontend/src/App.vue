<script setup>
import Header from '@/components/common/Header.vue';
</script>

<template>
  <div class="bg-gray-900 text-white">
    <Header />
    <router-view />
  </div>
</template>

<style scoped>
.container {
  margin-top: 20px;
}
body {
  font-family: Georgia, "돋움", serif;
}
</style>
