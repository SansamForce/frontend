<template>
  <div v-if="projectBoard" class="project-apply-member-page">
    <!-- 프로젝트 모집글 정보 -->
    <div class="project-board-left">
      <h3 class="apply-member-header">프로젝트 모집글 상세</h3>
      <img v-if="projectBoard.projectBoardImgUrl" :src="projectBoard.projectBoardImgUrl" alt="프로젝트 이미지" class="project-board-image" />
      <div class="project-board-info">
        <div class="project-board-header">
          <div class="title-and-status">
            <h3 class="project-board-title">{{ projectBoard.projectBoardTitle }}</h3>
            <span class="project-status" :class="{'closed': projectBoard.projectBoardStatus === 'DEADLINE'}">
              {{ projectBoard.projectBoardStatus === 'RECRUITMENT' ? '모집중' : '마감' }}
            </span>
          </div>
          <div class="dropdown">
            <button @click="toggleDropdown" class="dropdown-btn">...</button>
            <div v-if="showDropdown" class="dropdown-content">
              <button @click="openEditModal" class="dropdown-item">수정</button>
              <button @click="deleteProject" class="dropdown-item">삭제</button>
            </div>
          </div>
        </div>
        <p class="project-board-description">{{ projectBoard.projectBoardContent }}</p>
        <p><strong>모집 일정:</strong> {{ formatDate(projectBoard.projectBoardStartDate) }} - {{ formatDate(projectBoard.projectBoardEndDate) }}</p>
        <p><strong>프로젝트 기간:</strong> {{ formatDate(projectBoard.projectStartDate) }} - {{ formatDate(projectBoard.projectEndDate) }}</p>
        <p><strong>모집 인원:</strong> {{ projectBoard.projectBoardHeadCount }}명</p>
      </div>
    </div>

    <!-- 프로젝트 신청 회원 내역 -->
    <div class="project-board-right">
      <h3 class="apply-member-header">프로젝트 신청 회원 내역</h3>
      <div class="header-section">
        <p>{{ selectedMembers.length }}명 선택됨</p>
        <div class="button-group">
          <button class="approve-btn" @click="updateMemberStatus('APPROVED')" :disabled="!selectedMembers.length">신청 승인</button>
          <button class="reject-btn" @click="updateMemberStatus('REJECTED')" :disabled="!selectedMembers.length">신청 거부</button>
        </div>
      </div>
      <table>
        <thead>
        <tr>
          <th><input type="checkbox" @change="selectAllMembers" /></th>
          <th>No.</th>
          <th>이름</th>
          <th>닉네임</th>
          <th>신청 상태</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(member, index) in applyMembers" :key="member.projectApplyMemberSeq" :class="{ selected: selectedMembers.includes(member) }">
          <td><input type="checkbox" v-model="selectedMembers" :value="member" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ member.userName }}</td>
          <td>{{ member.userNickname }}</td>
          <td>{{ member.applyStatus }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 로딩 및 에러 상태 -->
    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 모달창 UI -->
    <div v-if="isEditModalOpen" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="closeEditModal">×</button>
        <h6><b>프로젝트 모집글 수정</b></h6>

        <!-- 이미지 썸네일과 모집 상태 나란히 배치 -->
        <div class="project-image-status-row">
          <!-- 이미지 썸네일 -->
          <div class="project-edit-thumbnail-container">
            <img :src="projectBoard.projectBoardImgUrl" class="project-edit-thumbnail" />
          </div>

          <!-- 모집 상태 -->
          <div class="modal-form-group status-group">
            <label for="status">모집 상태</label>
            <select id="status" v-model="editStatus">
              <option value="RECRUITMENT">모집중</option>
              <option value="DEADLINE">마감</option>
            </select>
          </div>
        </div>

        <!-- 파일 선택 -->
        <div class="modal-form-group">
          <label for="file">프로젝트 이미지 변경</label>
          <input type="file" id="file" @change="handleImageChange" />
        </div>

        <!-- 제목 -->
        <div class="modal-form-group">
          <label for="title">제목*</label>
          <input id="title" v-model="editTitle" required />
        </div>

        <!-- 내용 -->
        <div class="modal-form-group">
          <label for="content">내용*</label>
          <textarea id="content" v-model="editContent" required></textarea>
        </div>

        <!-- 모집 일정 -->
        <div class="date-input">
          <label for="projectBoardDates">모집 일정</label>
          <input type="date" v-model="editBoardStartDate" required />
          <input type="date" v-model="editBoardEndDate" required />
        </div>

        <!-- 프로젝트 일정 -->
        <div class="date-input">
          <label for="projectDates">프로젝트 일정</label>
          <input type="date" v-model="editProjectStartDate" required />
          <input type="date" v-model="editProjectEndDate" required />
        </div>

        <!-- 버튼 그룹 -->
        <div class="button-group">
          <button @click="updateProject" class="save-btn">수정</button>
          <button @click="closeEditModal" class="cancel-btn">취소</button>
        </div>
      </div>
    </div>
  </div>


  <!-- 로딩 중일 때 -->
  <div v-else class="loading">로딩 중...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const projectBoard = ref(null);
const applyMembers = ref([]);
const selectedMembers = ref([]);
const showDropdown = ref(false);
const isEditModalOpen = ref(false);
const loading = ref(false);
const error = ref(null);
const editTitle = ref('');
const editContent = ref('');
const editStatus = ref('RECRUITMENT');
const editBoardStartDate = ref('');
const editBoardEndDate = ref('');
const editProjectStartDate = ref('');
const editProjectEndDate = ref('');
const newImageFile = ref(null);
const router = useRouter();

// 날짜 형식 변환 함수
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// URL에서 projectBoardSeq를 가져와서 API 호출
const route = useRoute();
onMounted(async () => {
  const projectBoardSeq = route.params.id;
  loading.value = true;

  try {
    // 프로젝트 모집글 정보 불러오기
    const projectBoardResponse = await axios.get(`http://localhost:8086/api/v1/admin/project/board/${projectBoardSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    projectBoard.value = projectBoardResponse.data.data;

    // 신청 회원 리스트 불러오기
    const applyMemberResponse = await axios.get(`http://localhost:8086/api/v1/admin/project/board/${projectBoardSeq}/apply-member`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    applyMembers.value = applyMemberResponse.data.data;

    // 수정 폼에 기본 값 세팅
    editTitle.value = projectBoard.value.projectBoardTitle;
    editContent.value = projectBoard.value.projectBoardContent;
    editStatus.value = projectBoard.value.projectBoardStatus;
  } catch (err) {
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});

// 모든 회원 선택/해제
const selectAllMembers = (event) => {
  if (event.target.checked) {
    selectedMembers.value = [...applyMembers.value];
  } else {
    selectedMembers.value = [];
  }
};

// 회원 상태 업데이트 함수 (신청 승인, 거부)
const updateMemberStatus = async (status) => {
  const projectBoardSeq = route.params.id;
  try {
    for (const member of selectedMembers.value) {
      await axios.put(
          `http://localhost:8086/api/v1/admin/project/board/${projectBoardSeq}/apply-member/${member.projectApplyMemberSeq}`,
          {
            projectBoardSeq,
            projectMemberDevelopType: member.projectMemberDevelopType,
            applyStatus: status, // APPLIED or REJECTED
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json',
            }
          }
      );
    }
    alert(`선택된 회원의 상태가 ${status === 'APPROVED' ? '승인' : '거부'}되었습니다.`);
    selectedMembers.value = []; // 선택 초기화
    router.go(0); // 페이지 새로고침
  } catch (error) {
    alert(`상태 업데이트 중 오류가 발생했습니다.`);
    console.error(error);
  }
};

// 드롭다운 메뉴 토글
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// 수정 모달 열기
const openEditModal = () => {
  isEditModalOpen.value = true;
  showDropdown.value = false;
};

// 수정 모달 닫기
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// 이미지 변경 핸들링
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    newImageFile.value = file;
  }
};
// 프로젝트 수정 API 호출 함수
// 데이터 로드 시 기본 값 세팅
onMounted(async () => {
  const projectBoardSeq = route.params.id;
  loading.value = true;

  try {
    const projectBoardResponse = await axios.get(`http://localhost:8086/api/v1/project/board/${projectBoardSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    projectBoard.value = projectBoardResponse.data.data;

    // 수정 폼에 기본 값 세팅
    editTitle.value = projectBoard.value.projectBoardTitle;
    editContent.value = projectBoard.value.projectBoardContent;
    editStatus.value = projectBoard.value.projectBoardStatus;
    editBoardStartDate.value = projectBoard.value.projectBoardStartDate;
    editBoardEndDate.value = projectBoard.value.projectBoardEndDate;
    editProjectStartDate.value = projectBoard.value.projectStartDate;
    editProjectEndDate.value = projectBoard.value.projectEndDate;
  } catch (err) {
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});


const updateProject = async () => {
  try {
    console.log('editStatus:', editStatus.value); // editStatus 값 확인

    const projectBoardSeq = route.params.id;
    const formData = new FormData();

    // 날짜 변환
    const formattedRecruitStartDate = new Date(editBoardStartDate.value).toISOString();
    const formattedRecruitEndDate = new Date(editBoardEndDate.value).toISOString();
    const formattedProjectStartDate = new Date(editProjectStartDate.value).toISOString();
    const formattedProjectEndDate = new Date(editProjectEndDate.value).toISOString();

    formData.append('adminProjectBoardUpdateDTO', JSON.stringify({
      projectBoardTitle: editTitle.value,
      projectBoardContent: editContent.value,
      projectBoardStatus: editStatus.value, // 여기서 editStatus가 전달됨
      projectBoardStartDate: formattedRecruitStartDate,
      projectBoardEndDate: formattedRecruitEndDate,
      projectStartDate: formattedProjectStartDate,
      projectEndDate: formattedProjectEndDate,
    }));

    if (newImageFile.value) {
      formData.append('projectBoardImage', newImageFile.value);
    }

    await axios.put(`http://localhost:8086/api/v1/admin/project/board/${projectBoardSeq}`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'multipart/form-data',
      }
    });

    alert('프로젝트 모집글이 수정되었습니다.');
    closeEditModal();
    router.go(0);
  } catch (error) {
    alert('프로젝트 수정 중 오류가 발생했습니다.');
    console.error(error);
  }
};



// 프로젝트 삭제
const deleteProject = async () => {
  const projectBoardSeq = route.params.id;
  if (applyMembers.value.length > 0) {
    alert('프로젝트에 신청한 회원이 존재하므로 삭제할 수 없습니다.');
    return;
  }

  if (confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
    try {
      await axios.delete(`http://localhost:8086/api/v1/admin/project/board/${projectBoardSeq}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      alert("프로젝트가 삭제되었습니다.");
      router.push('/projectBoards'); // 삭제 후 목록으로 이동
    } catch (error) {
      alert("프로젝트 삭제 중 오류가 발생했습니다.");
      console.error(error);
    }
  }
};
</script>


<style scoped>

/* 전체 페이지 스타일 */
.project-apply-member-page {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  min-height: 100vh;
}

/* 좌우 영역 스타일 */
.project-board-left, .project-board-right {
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
}

/* 프로젝트 이미지 */
.project-board-image {
  width: 100%;
  height: 50%;
  object-fit: cover;
}

/* 프로젝트 정보 */
.project-board-info {
  margin-top: 20px;
}

/* 프로젝트 제목과 상태 */
.project-board-header {
  display: flex;
  justify-content: space-between; /* 제목과 드롭다운 버튼을 양 끝으로 배치 */
  align-items: center;
}

.title-and-status {
  display: flex;
  align-items: center;
}


.project-board-title {
  margin-right: 15px;
}

.project-status {
  padding: 4px 8px;
  background-color: #052c65;
  color: white;
  border-radius: 5px;
  font-size: 14px;
}

.project-status.closed {
  background-color: #F44336;
}

/* 드롭다운 스타일 */
.dropdown {
  position: relative;
}

.dropdown-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.dropdown-content {
  position: absolute;
  right: 0;
  top: 30px;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1;
  width: 100px;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

/* 회원 신청 리스트 헤더 */
.apply-member-header {
  font-size: 16px;
  font-weight: bold;
}

/* 테이블 상단 버튼 그룹 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 15px;
}

.approve-btn, .reject-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.approve-btn {
  background-color: #4CAF50;
}

.reject-btn {
  background-color: #F44336;
}

.approve-btn:hover {
  background-color: #45a049;
}

.reject-btn:hover {
  background-color: #d32f2f;
}

.approve-btn:disabled, .reject-btn:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse; /* 테두리 겹치지 않게 */
  margin-top: 10px;
  font-size: 14px; /* 테이블 폰트 크기 */
}

th, td {
  padding: 8px; /* 셀 내부 여백 조정 */
  border: 1px solid #ddd; /* 셀 테두리 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

th {
  background-color: #f0f0f0; /* 테이블 헤더 배경색 */
  font-weight: bold; /* 헤더 텍스트 굵게 */
}

tr:nth-child(even) {
  background-color: #f9f9f9; /* 짝수 행 배경색 */
}

tr:hover {
  background-color: #f1f1f1; /* 마우스 오버 시 배경색 */
}

tr.selected {
  background-color: #A8F9FF; /* 선택된 행의 배경색 */
}

/* 로딩 및 에러 상태 */
.loading {
  color: blue;
}

.error {
  color: red;
}

/* 모달 스타일 */
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
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 600px; /* 모달 창 크기를 줄여서 내부 요소들이 잘 맞게 */
  max-height: 90vh; /* 높이를 최대 높이에 맞게 설정 */
  overflow-y: auto; /* 넘치는 경우 스크롤을 추가 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.project-edit-thumbnail-container {
  width: 45%; /* 썸네일 크기를 줄임 */
  height: 100px; /* 높이 줄이기 */
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
}

.project-edit-thumbnail {
  max-width: 100%; /* 이미지가 컨테이너 내에서 넘치지 않도록 조정 */
  max-height: 100%; /* 이미지의 높이를 고정 */
  object-fit: cover; /* 이미지 비율을 유지하며 구역을 채우도록 설정 */
}

.status-group {
  width: 45%; /* 모집 상태 크기 조정 */
}

button.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
}

button.save-btn, button.cancel-btn {
  padding: 5px 11px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

button.save-btn {
  background-color: #262627;
  color: white;
}

button.cancel-btn {
  background-color: #ddd;
  color: #333;
}

.modal-form-group {
  margin-bottom: 15px;
}

.modal-form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.modal-form-group input,
.modal-form-group textarea,
.modal-form-group select {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}


/* 모집 상태 선택 상자의 크기를 텍스트 크기에 맞게 설정 */
.modal-form-group select {
  width: auto;
  padding: 5px; /* 선택 상자의 내부 여백을 조금 추가 */
  font-size: 14px; /* 텍스트 크기 조정 */
  border: 1px solid #ddd;
  border-radius: 4px;
}

.project-image-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.date-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

input[type="file"] {
  display: block;
  font-size: 14px;
  margin-top: 10px;
}


</style>
