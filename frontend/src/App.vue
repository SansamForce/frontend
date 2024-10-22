<script setup>
import Header from '@/components/common/Header.vue';
</script>

<template>
  <div class="container">
    <Header/>
    <RouterView/>
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
