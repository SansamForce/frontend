<template>
  <div>
    <main>
      <div class="projectBoard-total-info">
        <div class="projectBoard-info">
          <p>총 <span class="projectBoard-count">{{ projectBoards.length }}</span>개의 프로젝트가 등록되어 있습니다.</p>
        </div>

        <div class="projectBoards-status-for-select">
          <label for="status-select" class="status-label"></label>
          <select id="status-select" v-model="selectedStatus" @change="filterProjectBoards" class="status-select">
            <option value="">모집 상태</option>
            <option value="RECRUITMENT">모집중</option>
            <option value="DEADLINE">마감</option>
          </select>
        </div>
      </div>

      <div class="projectBoards-grid">
        <ProjectBoard
            v-for="(project, index) in currentProjectBoards"
            :key="index"
            :project="project"
        />
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import ProjectBoard from '@/components/projectBoard/ProjectBoard.vue'; // Component import

// 프로젝트 데이터 저장
const projectBoards = ref([]);
const selectedStatus = ref('');
const currentPage = ref(1);
const perPage = 8;

// API 호출로 프로젝트 게시물 조회
const fetchProjectBoards = async () => {
  try {
    const response = await axios.get('http://localhost:8086/api/v1/project/board', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoia29va29uZzIiLCJhdXRoIjoiTUVNQkVSIiwiaWF0IjoxNzI5NjA3OTY2LCJleHAiOjE3Mjk2OTQzNjZ9.wFKIqsaevEnf8g-6RhwhrWu9oMsaob4SLEI-0PLI00E'
      }
    });
    if (response.data.success) {
      projectBoards.value = response.data.data;
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

// 페이지 마운트 시 프로젝트 데이터 가져오기
onMounted(() => {
  fetchProjectBoards();
});

// 필터링된 프로젝트
const filteredProjects = computed(() => {
  let filtered = projectBoards.value;
  if (selectedStatus.value) {
    filtered = filtered.filter(project => project.projectBoardStatus === selectedStatus.value);
  }
  return filtered;
});

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / perPage);
});

// 현재 페이지의 프로젝트 반환
const currentProjectBoards = computed(() => {
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
/* Include the same styles here for the project grid and layout */
.nav a {
  font-size: 20px;
  margin-left: 20px;
  color: #fff;
  text-decoration: none;
}

.nav a:hover {
  color: #3FF3FF;
}

.projectBoard-total-info {
  font-size: 20px;
  display: flex; /* Flexbox 사용 */
  justify-content: space-between; /* 양쪽 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  margin: 20px 30px; /* 상하 여백 및 왼쪽/오른쪽 여백 추가 */
}



.projectBoard-info {
  margin-left: 30px;
}

.projectBoards-status-for-select {
  margin-bottom: 20px;
  text-align: right;
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 수직 중앙 정렬 */
}

.status-label {
  font-size: 20px; /* 라벨 크기 조정 */
}

.projectBoard-total-info {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.projectBoard-count {
  color: #171D8A;
  font-weight: bold;
}

.projectBoards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 0 20px;
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
