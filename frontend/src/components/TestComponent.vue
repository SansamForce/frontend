<script setup>

import { onMounted } from "vue";
    onMounted(() => {
      console.log('Hello Vue!');
    });

</script>

<template>
  <div>
    <h1>TestComponent</h1>
  </div>
</template>

<style scoped>
  h1 {
    color : red;
  }
</style>