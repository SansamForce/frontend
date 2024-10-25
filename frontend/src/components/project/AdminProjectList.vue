<script setup>
import AdminProjectItem from "@/components/project/AdminProjectItem.vue";

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <b-row>
    <AdminProjectItem class="project-card" v-for="project in projects" :key="project.projectSeq" :project="project" />
  </b-row>
</template>

<style scoped>
.project-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}
</style>