<template>
  <div class="admin-project-detail-container" v-if="projectBoard">
    <!-- Left: Project recruitment post details -->
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

    <!-- Right: Project applicant list -->
    <div class="project-board-right">
      <h3 class="apply-member-header">프로젝트 신청 회원 내역</h3>
      <div class="header-section">
        <p>총 {{ applyMembers.length }}명 신청</p>
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
          <th>개발 분야</th>
          <th>신청 상태</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(member, index) in applyMembers" :key="member.projectApplyMemberSeq">
          <td><input type="checkbox" v-model="selectedMembers" :value="member" /></td>
          <td>{{ index + 1 }}</td>
          <td>{{ member.userName }}</td>
          <td>{{ member.userNickname }}</td>
          <td>{{member.projectMemberDevelopType}}</td>
          <td :class="{ approved: member.applyStatus === 'APPROVED', rejected: member.applyStatus === 'REJECTED' }">{{ member.applyStatus }}</td>
        </tr>
        </tbody>
      </table>

      <!-- 프로젝트 생성 버튼 -->
      <button @click="openCreateProjectModal" class="create-project-btn">프로젝트 생성</button>
    </div>
  </div>

  <!-- Loading or Error Handling -->
  <div v-else-if="loading" class="loading">로딩 중...</div>
  <div v-else-if="error" class="error">{{ error }}</div>

  <!-- Edit Project Modal -->
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


  <!-- Create Project Modal -->
  <div v-if="isCreateProjectModalOpen" class="modal-overlay">
    <div class="modal-content">
      <button class="close-btn" @click="closeCreateProjectModal">×</button>
      <h6><b>프로젝트 생성</b></h6>

      <div class="modal-form-group">
        <label for="projectTitle">프로젝트 제목*</label>
        <input id="projectTitle" v-model="newProjectTitle" required />
      </div>
      <div class="modal-form-group">
        <label for="projectContent">프로젝트 내용*</label>
        <textarea id="projectContent" v-model="newProjectContent" required></textarea>
      </div>
      <div class="date-input">
        <label for="projectStartDates">프로젝트 일정</label>
        <input type="date" v-model="newProjectStartDate" required />
        <input type="date" v-model="newProjectEndDate" required />
      </div>
      <div class="modal-form-group">
        <label for="projectImage">프로젝트 이미지 선택</label>
        <input type="file" id="projectImage" @change="handleImageChange" />
      </div>

      <div class="button-group">
        <button @click="createProject" class="save-btn">생성</button>
        <button @click="closeCreateProjectModal" class="cancel-btn">취소</button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
const router =useRouter();
const route = useRoute();
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
const projectHeadCount = ref(0);  // 프로젝트 게시글의 headcount를 저장하는 변수
const isCreateProjectModalOpen = ref(false);


const newProjectTitle = ref('');
const newProjectContent = ref('');
const newProjectStartDate = ref('');
const newProjectEndDate = ref('');
const newProjectStatus = ref('PROGRESS');
const newImageFile = ref(null);


// 날짜 형식 변환 함수
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// URL에서 projectBoardSeq를 가져와서 API 호출
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
    console("response 값 "+applyMembers.value);
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


// 모달 열기/닫기 함수
const openCreateProjectModal = () => {
  isCreateProjectModalOpen.value = true;
};

const closeCreateProjectModal = () => {
  isCreateProjectModalOpen.value = false;
};

onMounted(async () => {
  const projectBoardSeq = route.params.id;  // 현재 게시글의 ID
  try {
    const projectBoardResponse = await axios.get(`http://localhost:8086/api/v1/admin/project/board/${projectBoardSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    projectBoard.value = projectBoardResponse.data.data;

    // 현재 프로젝트 게시글의 headcount 값을 저장
    projectHeadCount.value = projectBoard.value.projectBoardHeadCount;
  } catch (error) {
    console.error("프로젝트 게시글 데이터를 불러오는 중 오류 발생:", error);
  }
});

// URL에서 projectBoardSeq를 가져와서 API 호출
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


  } catch (err) {
    error.value = '데이터를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});

// 프로젝트 생성 API 호출
// 프로젝트 생성 API 호출
const createProject = async () => {
  try {
    const formData = new FormData();

    // 현재 로그인된 사용자의 userSeq 가져오기
    const userSeq = localStorage.getItem('userSeq'); // 상태 관리에서 가져올 수 있음

    // 날짜 형식 변환
    const formattedProjectStartDate = new Date(newProjectStartDate.value).toISOString();
    const formattedProjectEndDate = new Date(newProjectEndDate.value).toISOString();

    // DTO와 이미지 파일을 FormData로 추가
    formData.append('adminProjectCreateDTO', JSON.stringify({
      projectTitle: newProjectTitle.value,
      projectContent: newProjectContent.value,
      projectStatus: newProjectStatus.value,
      projectHeadCount: projectHeadCount.value,
      projectStartDate: formattedProjectStartDate,
      projectEndDate: formattedProjectEndDate,
      projectImgUrl: '',  // 이미지 URL은 서버에서 처리
      projectAdminSeq: userSeq,
    }));

    if (newImageFile.value) {
      formData.append('projectImage', newImageFile.value);
    } else {
      alert("프로젝트 이미지를 선택해주세요.");
      return;
    }

    const createResponse = await axios.post('http://localhost:8086/api/v1/admin/project', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!createResponse.data.success) {
      alert('프로젝트 생성에 실패했습니다.');
      return;
    }

    alert('프로젝트가 성공적으로 생성되었습니다.');

    // 최신 프로젝트를 가져오는 함수 (projectSeq 기준으로 가장 큰 값 선택)
    const getLatestProject = async () => {
      try {
        const response = await axios.get('http://localhost:8086/api/v1/admin/project', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        const projects = response.data.data;

        // projectSeq 기준으로 정렬하여 가장 큰 값을 가진 프로젝트 선택
        const latestProject = projects.sort((a, b) => b.projectSeq - a.projectSeq)[0];

        console.log('최신 프로젝트:', latestProject);
        return latestProject;
      } catch (error) {
        console.error('프로젝트 목록을 가져오는 중 오류 발생:', error);
        return null;
      }
    };

    // 최신 프로젝트 가져오기
    const latestProject = await getLatestProject();

    if (!latestProject) {
      alert('최신 프로젝트를 가져오지 못했습니다.');
      return;
    }

    // 승인된 회원 필터링
    const approvedMembers = applyMembers.value.filter(
        member => member.applyStatus === 'APPROVED'
    );

    console.log('승인된 회원 목록:', approvedMembers);

    if (approvedMembers.length === 0) {
      alert('승인된 회원이 없습니다.');
      return;
    }

    // 승인된 회원을 해당 프로젝트에 추가
    for (const member of approvedMembers) {
      await axios.post(`http://localhost:8086/api/v1/admin/project/${latestProject.projectSeq}/member`, {
        userSeq: member.userSeq,  // 기존 userSeq
        projectMemberDevelopType: member.projectMemberDevelopType // 추가된 developType 전송
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        }
      });
      console.log("프로젝트 회원 타입"+member.projectMemberDevelopType)
    }

    alert('해당 프로젝트에 승인된 회원이 추가되었습니다.');
    closeCreateProjectModal();
    router.go(0);

  } catch (error) {
    console.error('프로젝트 생성 중 오류 발생:', error);
    alert('프로젝트 생성 중 오류가 발생했습니다.');
  }
};

</script>



<style scoped>
.admin-project-detail-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  min-height: 100vh;
}

/* Left and right panels */
.project-board-left, .project-board-right {
  flex: 1;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Project Image */
.project-board-image {
  display: block;     /* Ensure the image is treated as a block-level element */
  margin: 0 auto;     /* Center the image horizontally */
  width: 700px;   /* Set a maximum width */
  height: 350px;      /* Fixed height */
  object-fit: cover;  /* Cover the area without distortion */
  border-radius: 8px; /* Optional: add a rounded corner effect */
}


/* Project information */
.project-board-info {
  margin-top: 20px;
}

/* Project title and status */
.project-board-header {
  display: flex;
  justify-content: space-between;
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
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  font-size: 14px;
}

.project-status.closed {
  background-color: #dc3545;
}

/* Dropdown styling */
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
  text-align: left;
  width: 100%;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

/* Apply member section header */
.apply-member-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Applicant table and buttons */
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
  font-size: 14px;
  font-weight: bold;
}

.approve-btn {
  background-color: #28a745;
}

.reject-btn {
  background-color: #dc3545;
}

.approve-btn:hover {
  background-color: #218838;
}

.reject-btn:hover {
  background-color: #c82333;
}

.approve-btn:disabled, .reject-btn:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

/* Table styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 14px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

tr:hover {
  background-color: #f1f1f1;
}

tr.selected {
  background-color: #A8F9FF;
}

.approved {
  color: green;
}

.rejected {
  color: red;
}

/* Loading and error messages */
.loading {
  color: blue;
  font-size: 18px;
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
  font-size: 18px;
  text-align: center;
  padding: 20px;
}

/* Modals */
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
  width: 600px;
  max-height: 100vh;
  overflow-y: auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Close button for modals */
button.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

/* Save/Cancel button styles in modal */
button.save-btn, button.cancel-btn {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

button.save-btn {
  background-color: #007bff;
  color: white;
}

button.cancel-btn {
  background-color: #ddd;
  color: #333;
}

button.save-btn:hover {
  background-color: #0056b3;
}

button.cancel-btn:hover {
  background-color: #bbb;
}

.modal-form-group {
  margin-bottom: 20px;
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

/* Date input style */
.date-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

/* File input styling */
input[type="file"] {
  display: block;
  font-size: 14px;
  margin-top: 10px;
}

/* Project creation button */
.create-project-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 14px;
}

.create-project-btn:hover {
  background-color: #218838;
}

/* Project edit thumbnail */
.project-edit-thumbnail-container {
  width: 45%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
}

.project-edit-thumbnail {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.project-image-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.project-board-description{

}

</style>
