<template>
  <div>
    <main>
      <div class="projectBoard-total-info">
        <div class="projectBoard-info">
          <p>
            총 <span class="projectBoard-count">{{ projectBoards.length }}</span>개의
            프로젝트가 등록되어 있습니다.
            <button v-if="isManager" @click="showCreateAlert" class="create-button">모집글 작성</button>

          </p>

          <!-- 관리자 권한이 있는 경우 '모집글 작성' 버튼 표시 -->

        </div>

        <div class="projectBoards-status-for-select">
          <label for="status-select" class="status-label"></label>
          <select
              id="status-select"
              v-model="selectedStatus"
              @change="filterProjectBoards"
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

    <!-- 모집글 작성 알림창 -->
    <div v-if="isCreateAlertVisible" class="overlay">
        <div class="create-alert">
          <h3>프로젝트 모집글 작성</h3>
          <form @submit.prevent="submitForm">
            <div class="image-upload">
              <label>프로젝트 모집글 썸네일 업로드</label>
              <input type="file" @change="handleImageUpload" />
            </div>
            <label for="title">제목</label>
            <input id="title" v-model="title" required />

            <label for="content">내용</label>
            <textarea id="content" v-model="content" required></textarea>

            <label for="headCount">모집 인원</label>
            <input id="headCount" type="number" v-model="headCount" required />

            <label for="projectDates">프로젝트 일정</label>
            <div class="date-inputs">
              <input type="date" v-model="startDate" />
              <input type="date" v-model="endDate" />
            </div>

            <div class="button-group">
              <button type="submit" class="submit-btn">완료</button>
              <button type="button" @click="closeAlert" class="cancel-btn">취소</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import ProjectBoard from '@/components/projectBoard/ProjectBoard.vue'; // Component import
import { useUserStore } from '@/stores/UserStore'; // 사용자 스토어 import

// Pinia 스토어에서 권한 정보 가져오기
const userStore = useUserStore();
const isManager = computed(() => userStore.auth === 'MANAGER'); // 'manager' 권한 확인


// 프로젝트 데이터 저장
const projectBoards = ref([]);
const selectedStatus = ref('');
const currentPage = ref(1);
const perPage = 8;

// 모집글 작성 알림창 상태
const isCreateAlertVisible = ref(false);
const newProjectBoard = ref({
  title: '',
  content: '',
  headCount: 0,
  startDate: '',
  endDate: '',
});
// 모집글 작성 알림창 열기
const showCreateAlert = () => {
  isCreateAlertVisible.value = true;
};

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


// 모집글 생성 API 호출
const createProjectBoard = async () => {
  try {
    const response = await axios.post(
        'http://localhost:8086/api/v1/admin/project/board/',
        {
          title: newProjectBoard.value.title,
          content: newProjectBoard.value.content,
          headCount: newProjectBoard.value.headCount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
    );
    if (response.data.success) {
      fetchProjectBoards(); // 성공 시 목록 다시 불러오기
      isCreateAlertVisible.value = false; // 알림창 닫기
    }
  } catch (error) {
    console.error('Error creating project board:', error);
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
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  display: flex; /* Flexbox 사용 */
  justify-content: space-between; /* 양쪽 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  margin-top: 15px;
}

.projectBoard-info {
  margin-left: 30px;
}

.projectBoards-status-for-select {
  margin-bottom: 10px;
  text-align: right;
  display: flex; /* Flexbox 사용 */
  align-items: center; /* 수직 중앙 정렬 */
}

.create-button {
  margin-left: 20px; /* 버튼과 텍스트 사이에 20px 여백 추가 */
  padding: 8px 15px;
  background-color: #171D8A;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-button:hover {
  background-color: #0e145e; /* Hover 효과 */
}

.projectBoard-count {
  color: #171D8A;
  font-weight: bold;
}

.projectBoards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, auto); /* 2 rows */
  gap: 20px;
  padding: 0 10px;
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


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.create-alert {
  width: 500px;
  background-color: white;
  padding: 30px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 1000;
}

.create-alert h3 {
  margin-bottom: 20px;
}

.create-alert form {
  display: flex;
  flex-direction: column;
}

.create-alert input,
.create-alert textarea {
  margin-bottom: 15px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.image-upload {
  margin-bottom: 15px;
}

.date-inputs {
  display: flex;
  gap: 10px;
}

.create-alert .button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #171D8A;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 20px;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #ddd;
  color: #333;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
</style>