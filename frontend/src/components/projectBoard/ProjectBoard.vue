<template>
  <router-link :to="`/projectBoards/${project.projectBoardSeq}`" class="projectBoard-card-link">
    <div class="projectBoard-card">
      <img :src="project.projectBoardImgUrl" alt="프로젝트 이미지" class="projectBoard-image" />
      <p class="projectBoard-title">{{ project.projectBoardTitle }}</p>
      <div class="projectBoard-status" :class="{'closed': project.projectBoardStatus === 'DEADLINE'}">
        {{ project.projectBoardStatus === 'RECRUITMENT' ? '모집중' : '마감' }}
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
defineProps({
  project: {
    type: Object,
    required: true,
  }
});
</script>

<style scoped>
.projectBoard-card {
  height: 240px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.projectBoard-card:hover {
  transform: scale(1.02);
}

.projectBoard-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
}

.projectBoard-title {
  color: #262627;
  font-size: 20px;
  margin-top: 5px;
}

.projectBoard-status {
  padding: 4px 10px;
  background-color: #171D8A;
  font-size: 10px;
  color: #ffffff;
  border-radius: 4px;
  display: inline-block;
}

.projectBoard-status.closed {
  background-color: #C4C4C4;
}

.projectBoard-card-link {
  text-decoration: none;
  color: inherit;
}
</style>
