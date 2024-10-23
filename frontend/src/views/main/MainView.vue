<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="text-center">
    <h1>Welcome to My App</h1>
    <RouterLink to="/projects" class="btn btn-primary">MY PROJECT LIST</RouterLink>

    <RouterLink to="/projectBoards" class="btn btn-primary">PROJECT BOARD LIST</RouterLink>
  </div>
</template>

<style scoped>
.text-center {
  margin-top: 50px;
}
</style>