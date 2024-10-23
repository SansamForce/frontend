<script setup>
import Header from '@/components/common/Header.vue';
import ProjectBoard from "@/components/projectBoard/ProjectBoard.vue";
</script>

<template>
  <div class="bg-gray-900 text-white">
    <Header />
    <router-view />
  </div>
  <ProjectBoard />
</template>


<style scoped>

</style>
