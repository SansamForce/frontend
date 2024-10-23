<template>
  <div v-if="projectBoard" class="project-board-detail-page">
    <!-- 프로젝트 모집글 상세 -->
    <div>프로젝트 게시물 상세 조회</div>
    <br>
    <div class="project-board-content">
      <!-- 프로젝트 제목 -->
      <div class="project-board-header">
        <h5 class="project-board-title">{{ projectBoard.projectBoardTitle }}</h5>
      </div>

      <!-- 사진과 우측 모집 정보 -->
      <div class="project-board-info">
        <div class="project-board-detail-left">
          <img :src="projectBoard.projectBoardImgUrl" alt="프로젝트 이미지" class="project-board-image" />
        </div>
        <!-- 우측 프로젝트 모집 정보 -->
        <div class="project-board-detail-right">
          <div class="recruitment-status" :class="{ 'closed': projectBoard.projectBoardStatus === 'DEADLINE' }">
            {{ projectBoard.projectBoardStatus === 'RECRUITMENT' ? '모집중' : '마감' }}
          </div>
          <div class="project-info-list">
            <p class="project-info-item"><strong>모집 일정:</strong> {{ formatDate(projectBoard.projectBoardStartDate) }} - {{ formatDate(projectBoard.projectBoardEndDate) }}</p>
            <br>
            <p class="project-info-item"><strong>프로젝트 기간:</strong> {{ formatDate(projectBoard.projectStartDate) }} - {{ formatDate(projectBoard.projectEndDate) }}</p>
            <br>
            <p class="project-info-item"><strong>모집 인원:</strong> {{ projectBoard.projectBoardHeadCount }}명</p>
             </div>
          <button class="apply-btn">신청하기</button>
        </div>
      </div>

      <!-- 프로젝트 제목과 내용 -->
      <div class="project-board-details">
        <h2 class="project-board-title">{{ projectBoard.projectBoardTitle }}</h2>
        <div class="project-board-description">
          <p>{{ projectBoard.projectBoardContent }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 로딩 중일 때 -->
  <div v-else class="loading">Loading...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// 모집글 데이터를 저장하는 ref
const projectBoard = ref(null);

// URL에서 projectBoardSeq를 가져오기
const route = useRoute();

// 날짜 형식 변환 함수
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// API 호출로 프로젝트 모집글 데이터를 가져오는 로직
onMounted(async () => {
  try {
    const projectBoardSeq = route.params.id;  // URL 파라미터에서 모집글 ID 추출
    const response = await axios.get(`http://localhost:8086/api/v1/project/board/${projectBoardSeq}`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoia29va29uZzIiLCJhdXRoIjoiTUVNQkVSIiwiaWF0IjoxNzI5NjA3OTY2LCJleHAiOjE3Mjk2OTQzNjZ9.wFKIqsaevEnf8g-6RhwhrWu9oMsaob4SLEI-0PLI00E'
      }
    });
    projectBoard.value = response.data.data;
  } catch (error) {
    console.error("프로젝트 모집글 정보를 불러오는 중 오류가 발생했습니다:", error);
  }
});
</script>

<style scoped>
.project-board-detail-page {
  padding: 20px;
}

.project-board-header {
  margin-bottom: 20px;
}

.recruitment-status {
  padding: 5px 10px;
  background-color: #171D8A;
  color: #ffffff;
  border-radius: 5px;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 20px; /* 위쪽과 간격 추가 */
}

.recruitment-status.closed {
  background-color: #C4C4C4; /* 마감일 때 색 변경 */
}

.project-board-content {
  display: flex;
  flex-direction: column;
}

.project-board-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.project-board-detail-left {
  width: 40%; /* 이미지 크기 줄이기 */
  padding-right: 20px;
}

.project-board-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.project-board-detail-right {
  width: 55%;
  padding: 20px;
  border-left: 1px solid #ddd;
  position: relative; /* 버튼을 고정 배치하기 위한 설정 */
}

.project-info-list {
  margin-bottom: 30px;
}

.project-info-item {
  margin-bottom: 15px; /* 각 정보 항목 간 여백 */
  font-size: 18px;
}

.project-board-details {
  margin-top: 20px;
}

.project-board-description {
  font-size: 16px;
  line-height: 1.6;
}

.apply-btn {
  padding: 12px 25px;
  background-color: #000000; /* 검은색 배경 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute; /* 버튼을 오른쪽 하단에 고정 */
  bottom: 20px;
  right: 20px;
}

.loading {
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
}
</style>
