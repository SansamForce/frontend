<script setup>
import Header from '@/components/common/Header.vue';
</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans&display=swap" rel="stylesheet">
  <div class="bg-gray-900" style="font-family: 'Instrument Sans', sans-serif">
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
