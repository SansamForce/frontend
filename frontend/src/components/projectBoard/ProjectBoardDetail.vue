<template>
  <div class="project-board-card">
    <img :src="projectBoard.projectBoardImgUrl" alt="프로젝트 이미지" class="project-board-image" />
    <div class="project-board-details">
      <h2>{{ projectBoard.projectBoardTitle }}</h2>
      <p>{{ projectBoard.projectBoardContent }}</p>
      <div class="project-board-status" :class="{ 'closed': projectBoard.projectBoardStatus === 'DEADLINE' }">
        {{ projectBoard.projectBoardStatus === 'RECRUITMENT' ? '모집중' : '마감' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  projectBoard: {
    type: Object,
    required: true,
  }
});
</script>

<style scoped>
.project-board-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.project-board-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 15px;
}

.project-board-details {
  margin-top: 10px;
}

.project-board-status {
  padding: 4px 10px;
  background-color: #171D8A;
  font-size: 12px;
  color: #ffffff;
  border-radius: 4px;
  display: inline-block;
}

.project-board-status.closed {
  background-color: #C4C4C4;
}
</style>
