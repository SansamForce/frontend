<template>
  <div>
    <main>
      <div class="project-total-info">
        <div class="project-info">
          <p>총 <span class="project-count">{{ projects.length }}</span>개의 프로젝트가 등록되어 있습니다.</p>
        </div>

        <div class="project-status-for-select">
          <label for="status-select" class="status-label"></label>
          <select id="status-select" v-model="selectedStatus" @change="filterProjects" class="status-select">
            <option value="">모집 상태</option>
            <option value="모집중">모집중</option>
            <option value="마감">마감</option>
          </select>
        </div>
      </div>

      <div class="projects-grid">
        <div v-for="(project, index) in currentProjects" :key="index" class="project-card">
          <img :src="project.image" alt="프로젝트 이미지" class="project-image" />
          <p class="project-title">{{ project.title }}</p>
          <div class="project-status" :class="{'closed': project.status === '마감'}">
            {{ project.status }}
          </div>
        </div>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import hanwhaImage from '@/images/hanwha-project-board.jpg';

// 더미 데이터
const projects = ref([
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '모집중', image: hanwhaImage },
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '마감', image: hanwhaImage },
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '모집중', image: hanwhaImage },
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '마감', image: hanwhaImage },
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '모집중', image: hanwhaImage },
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '모집중', image: hanwhaImage },
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '마감', image: hanwhaImage },
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '모집중', image: hanwhaImage },
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '모집중', image: hanwhaImage },
  { title: '한화시스템 BEYOND SW 캠프 10기', status: '모집중', image: hanwhaImage }
]);

const selectedStatus = ref('');
const currentPage = ref(1);
const perPage = 8;

// 필터링된 프로젝트
const filteredProjects = computed(() => {
  let filtered = projects.value;
  if (selectedStatus.value) {
    filtered = filtered.filter(project => project.status === selectedStatus.value);
  }
  return filtered;
});

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / perPage);
});

// 현재 페이지의 프로젝트 반환
const currentProjects = computed(() => {
  return filteredProjects.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage);
});

// 페이지 전환 함수
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// 필터링 후 첫 페이지로 이동
const filterProjects = () => {
  currentPage.value = 1; // 필터 변경 시 첫 페이지로
};
</script>

<style scoped>
.nav a {
  font-size: 20px;
  margin-left: 20px;
  color: #fff;
  text-decoration: none;
}

.nav a:hover {
  color: #3FF3FF;
}

.project-total-info {
  font-size: 20px;
  display: flex; /* Flexbox 사용 */
  justify-content: space-between; /* 양쪽 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  margin: 20px 30px; /* 상하 여백 및 왼쪽/오른쪽 여백 추가 */
}

.project-status {
  margin-top: 5px; /* 이미지와 간격 추가 */
  padding: 5px 10px; /* 패딩 추가 */
  background-color: #171D8A; /* 배경 색상 */
  color: #ffffff;
  border-radius: 4px; /* 모서리 둥글게 */
  display: inline-block; /* 텍스트에 맞춰 크기 조정 */
  text-align: left; /* 왼쪽 정렬 */
}

.project-info {
  margin-left: 30px;
}

.project-status-for-select {
  margin-bottom: 20px;
  text-align: right;
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 수직 중앙 정렬 */
}

.status-label {
  font-size: 20px; /* 라벨 크기 조정 */
}

.project-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.project-count {
  color: #171D8A;
  font-weight: bold;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 0 20px;
}

.project-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: left; /* 왼쪽 정렬 추가 */
}

.project-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.closed {
  background-color: grey;
}

.project-title {
  margin-top: 10px; /* 이미지와 제목 사이 여백 추가 */
}

.pagination {
  margin-top: 20px;
  display: flex; /* Flexbox 사용 */
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}

.pagination button {
  margin: 0 10px; /* 버튼 사이의 간격 */
}

/* Select Box 스타일 추가 */
.status-select {
  font-size: 18px; /* 글자 크기 조정 */
  padding: 10px; /* 패딩 추가 */
  width: 180px; /* 너비 조정 */
  height: 50px; /* 높이 조정 */
  border: 1px solid #ddd; /* 테두리 */
  border-radius: 4px; /* 모서리 둥글게 */
  cursor: pointer; /* 커서 변경 */
}
</style>
