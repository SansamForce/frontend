<script setup>
import ProjectItem from "@/components/project/ProjectItem.vue";

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <b-row>
    <ProjectItem class="project-card" v-for="project in projects" :key="project.projectSeq" :project="project" />
  </b-row>
</template>

<style scoped>
.project-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2개씩 배치 */
  gap: 20px; /* 카드 간격 */
}

.project-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}
</style>