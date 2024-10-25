<template>
  <div>
    <main>
      <div class="projectBoard-total-info">
        <div class="projectBoard-info">
          <p>
            총 <span class="projectBoard-count">{{ appliedProjects.length }}</span>개의
            프로젝트에 신청하셨습니다.
          </p>
        </div>

        <div class="projectBoards-status-for-select">
          <label for="status-select" class="status-label"></label>
          <select
              id="status-select"
              v-model="selectedStatus"
              @change="filterAppliedProjects"
              class="status-select"
          >
            <option value="">모집 상태</option>
            <option value="RECRUITMENT">모집중</option>
            <option value="DEADLINE">마감</option>
          </select>
        </div>
      </div>

      <div class="projectBoards-grid">
        <ProjectBoard
            v-for="(project, index) in currentAppliedProjects"
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
import ProjectBoard from '@/components/projectBoard/ProjectBoard.vue'; // 컴포넌트 가져오기

// 신청한 프로젝트 데이터
const appliedProjects = ref([]);
const selectedStatus = ref('');
const currentPage = ref(1);
const perPage = 8;

// 페이지가 로드될 때 신청한 프로젝트 불러오기
const fetchAppliedProjects = async () => {
  try {
    // 주어진 엔드포인트 형식으로 요청
    const applyResponse = await axios.get(`http://localhost:8086/api/v1/project/board/apply`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (applyResponse.data.success) {
      appliedProjects.value = applyResponse.data.data;
    }
  } catch (error) {
    console.error("Error fetching applied projects:", error);
  }
};

// 페이지 마운트 시 신청한 프로젝트 목록 가져오기
onMounted(() => {
  fetchAppliedProjects();
});

// 필터링된 프로젝트
const filteredProjects = computed(() => {
  let filtered = appliedProjects.value;
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
const currentAppliedProjects = computed(() => {
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
const filterAppliedProjects = () => {
  currentPage.value = 1; // 필터 변경 시 첫 페이지로 이동
};
</script>

<style scoped>
/* 이전에 보내주신 세 번째 파일의 스타일 유지 */
.projectBoard-total-info {
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  margin-left: 20px;
}

.projectBoards-status-for-select {
  margin-bottom: 10px;
  text-align: right;
  display: flex;
  align-items: center;
}

.projectBoard-count {
  color: #171D8A;
  font-weight: bold;
}

.projectBoards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 20px;
  padding: 0 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
}

.status-select {
  margin-right: 20px;
  padding: 8px 15px;
  font-size: 15px;
}
</style>
