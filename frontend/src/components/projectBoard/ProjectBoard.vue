<template>
  <div class="projectBoard-card">
    <img :src="project.projectBoardImgUrl" alt="프로젝트 이미지" class="projectBoard-image" />
    <p class="projectBoard-title">{{ project.projectBoardTitle }}</p>
    <div class="projectBoard-status" :class="{'closed': project.projectBoardStatus === 'CLOSED'}">
      {{ project.projectBoardStatus === 'RECRUITMENT' ? '모집중' : '마감' }}
    </div>
  </div>
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
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: left; /* 왼쪽 정렬 추가 */
}

.projectBoard-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.closed {
  background-color: grey;
}

.projectBoard-title {
  font-size: 20px;
  margin-top: 10px; /* 이미지와 제목 사이 여백 추가 */
}

.projectBoard-status {
  margin-top: 5px; /* 이미지와 간격 추가 */
  padding: 5px 10px; /* 패딩 추가 */
  background-color: #171D8A; /* 배경 색상 */
  color: #ffffff;
  border-radius: 4px; /* 모서리 둥글게 */
  display: inline-block; /* 텍스트에 맞춰 크기 조정 */
  text-align: left; /* 왼쪽 정렬 */
}

</style>
