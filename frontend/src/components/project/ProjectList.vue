<script setup>
import ProjectItem from "@/components/project/ProjectItem.vue";

const props = defineProps({
  projectList: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <b-row>
    <ProjectItem v-if="projectList" class="project-card" v-for="project in projectList" :key="project.projectSeq" :project="project" />
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