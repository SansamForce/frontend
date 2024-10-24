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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// 모집글 데이터를 저장하는 ref
const projectBoard = ref(null);
const isModalOpen = ref(false);  // Modal open/close state
const selectedField = ref('');   // Selected field value
const hasApplied = ref(false);   // 신청 상태 관리
const projectApplyMemberSeq = ref(null);  // 신청 ID 저장

// URL에서 projectBoardSeq를 가져오기
const route = useRoute();

// 날짜 형식 변환 함수
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// 신청 목록을 가져오는 로직
onMounted(async () => {
  try {
    const projectBoardSeq = route.params.id;  // URL 파라미터에서 모집글 ID 추출

    // 프로젝트 모집글 데이터 불러오기
    const response = await axios.get(`http://localhost:8086/api/v1/project/board/${projectBoardSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    projectBoard.value = response.data.data;

    // 신청한 프로젝트 목록 불러오기
    const applyResponse = await axios.get(`http://localhost:8086/api/v1/project/board/${projectBoardSeq}/apply`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    // 신청 목록에서 현재 프로젝트에 대한 신청만 필터링
    const appliedProject = applyResponse.data.data.find(project => project.projectBoardSeq === projectBoardSeq);

    if (appliedProject) {
      hasApplied.value = true;  // 이미 신청한 상태
      projectApplyMemberSeq.value = appliedProject.projectApplyMemberSeq;  // 해당 프로젝트에 대한 신청 ID 저장
      console.log("projectApplyMemberSeq:", projectApplyMemberSeq.value);  // 디버깅용 로그
    } else {
      hasApplied.value = false;  // 신청 내역이 없을 경우
    }
  } catch (error) {
    console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
  }
});

// 신청 처리
const applyForProject = async () => {
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
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }
    );

    if (response.data.success) {
      alert("프로젝트 모집 신청이 성공적으로 완료되었습니다.");
      // 신청 후 반환된 projectApplyMemberSeq 저장
      projectApplyMemberSeq.value = response.data.data.projectApplyMemberSeq;
      hasApplied.value = true;  // 신청 완료 후 상태 변경
      closeApplyModal();
    }
  } catch (error) {
    console.error("프로젝트 모집 신청 중 오류가 발생했습니다:", error);
  }
};

// 신청 취소 처리
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
      hasApplied.value = false;  // 취소 후 상태 변경
      projectApplyMemberSeq.value = null;  // 취소 후 seq 값 초기화
    }
  } catch (error) {
    console.error("프로젝트 모집 신청 취소 중 오류가 발생했습니다:", error);
  }
};

// Open and close modal
const openApplyModal = () => {
  isModalOpen.value = true;
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
