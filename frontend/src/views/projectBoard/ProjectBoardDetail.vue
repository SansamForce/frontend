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
          <!-- 신청 / 취소 버튼 -->
          <button class="apply-btn" @click="hasApplied ? cancelApplication() : openApplyModal()">
            {{ hasApplied ? '신청 취소' : '신청하기' }}
          </button>
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

    <!-- Modal for selecting the development field -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="closeApplyModal">×</button>
        <h3>해당 프로젝트 참여 시 관심 분야를 선택해주세요.</h3>
        <div class="field-options">
          <label>
            <input type="radio" v-model="selectedField" value="FRONTEND" /> FRONTEND
          </label>

          <label>
            <input type="radio" v-model="selectedField" value="BACKEND" /> BACKEND
          </label>
        </div>
        <div class="modal-buttons">
          <button @click="closeApplyModal" class="cancel-btn">취소</button>
          <button @click="applyForProject" class="confirm-btn">확인</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 로딩 중일 때 -->
  <div v-else class="loading">Loading...</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const projectBoard = ref(null);
const isLoading = ref(true);  // 로딩 상태 관리
const isModalOpen = ref(false);
const selectedField = ref('');
const hasApplied = ref(false);
const projectApplyMemberSeq = ref(null);

const route = useRoute();

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(async () => {
  await loadProjectBoardData(route.params.id);
});

const loadProjectBoardData = async (projectBoardSeq) => {
  try {
    isLoading.value = true;

    const response = await axios.get(`http://localhost:8086/api/v1/project/board/${projectBoardSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    projectBoard.value = response.data.data;

    const applyResponse = await axios.get(`http://localhost:8086/api/v1/project/board/${projectBoard.value.projectBoardSeq}/apply`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const appliedProject = applyResponse.data.data.find(project => 
      Number(project.projectBoardSeq) === Number(projectBoardSeq)
    );

    if (appliedProject) {
      hasApplied.value = true;
      projectApplyMemberSeq.value = appliedProject.projectApplyMemberSeq;
    } else {
      hasApplied.value = false;
    }

  } catch (error) {
    console.error("데이터 로드 중 오류 발생:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => route.params.id, async (newProjectBoardSeq) => {
  await loadProjectBoardData(newProjectBoardSeq);
});

const applyForProject = async () => {


  // 로그인 여부를 체크
  const authToken = localStorage.getItem('authToken');
  
  if (!authToken) {
    // 로그인되지 않은 경우
    alert("프로젝트 신청을 하려면 회원가입이 필요합니다. 로그인 페이지로 이동합니다.");
    // 로그인 페이지로 이동
    window.location.href = "/login";
    return;
  }

  // 로그인된 경우
  if (!selectedField.value) {
    alert("지원 분야를 선택해주세요.");
    return;
  }

  try {
    const projectBoardSeq = route.params.id;
    const response = await axios.post(
        `http://localhost:8086/api/v1/project/board/${projectBoardSeq}/apply`,
        {
          projectBoardSeq,
          projectMemberDevelopType: selectedField.value,
          applyStatus: 'APPLIED'
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
    );

    if (response.data.success) {
      alert("프로젝트 모집 신청이 성공적으로 완료되었습니다.");
      projectApplyMemberSeq.value = response.data.data.projectApplyMemberSeq;
      hasApplied.value = true;
      closeApplyModal();
    }
  } catch (error) {
    console.error("프로젝트 모집 신청 중 오류가 발생했습니다:", error);
  }
};

const cancelApplication = async () => {
  if (!projectApplyMemberSeq.value) {
    alert("취소할 신청 정보가 없습니다.");
    return;
  }

  try {
    const response = await axios.delete(
      `http://localhost:8086/api/v1/project/board/${projectBoard.value.projectBoardSeq}/apply/${projectApplyMemberSeq.value}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );

    if (response.data.success) {
      alert("프로젝트 모집 신청이 취소되었습니다.");
      hasApplied.value = false;
      projectApplyMemberSeq.value = null;
    }
  } catch (error) {
    console.error("프로젝트 모집 신청 취소 중 오류가 발생했습니다:", error);
  }
};

const openApplyModal = () => {
  if (projectBoard.value.projectBoardStatus === 'DEADLINE') {
    alert('프로젝트가 마감되었습니다. 신청할 수 없습니다.');
    return;  // 마감된 상태에서는 함수를 종료하고 모달을 열지 않음
  }
  isModalOpen.value = true;  // 프로젝트가 마감되지 않았을 때만 모달을 열기
};



const closeApplyModal = () => {
  isModalOpen.value = false;
};
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
  margin-bottom: 20px;
}

.recruitment-status.closed {
  background-color: #C4C4C4;
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
  width: 40%;
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
  position: relative;
}

.project-info-list {
  margin-bottom: 30px;
}

.project-info-item {
  margin-bottom: 15px;
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
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

/* Modal styling */
.modal-overlay {
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

.modal-content {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  width: 500px;
  text-align: center;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-bottom: 30px;
  font-size: 18px;
  font-weight: bold;
}

.field-options {
  display: flex;
  margin-bottom: 30px;
  gap: 10px;
  font-size:15px;
  font-weight:bold;
}

.field-options label {
  font-size: 16px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-btn, .cancel-btn {
  padding: 8px 17px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.confirm-btn {
  background-color: #000;
  color: white;
}

.cancel-btn {
  background-color: #ddd;
  color: #333;
}

/* Close button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #aaa;
}

.close-btn:hover {
  color: #000;
}

</style>
