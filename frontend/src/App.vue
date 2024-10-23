<script setup>
import Header from '@/components/common/Header.vue';
import ProjectBoard from "@/views/projectBoard/ProjectBoardList.vue";
</script>

<template>
  <div class="bg-gray-900 text-white">
    <Header />
    <router-view />
  </div>
  <ProjectBoard />
</template>


<style scoped>
.container {
  margin-top: 20px;
}
body {
  font-family: Georgia, "돋움", serif;
}
</style>
