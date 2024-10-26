<script setup>
import {ref} from "vue";
import axios from "axios";

const props = defineProps({
  isEditModalOpen: {
    type: Boolean,
    required: true
  },
  project: {
    type: Object,
    required: true
  }
})

const isModalOpen = ref(true);
// 수정 모달 닫기
const closeEditModal = (event) => {
  isModalOpen.value = event;
  emit('closeModal',  isModalOpen.value)
};

const emit = defineEmits(['closeModal'])

const projectSeq = ref(props.project.projectSeq);
const projectStatus = ref(props.project.projectStatus);
const projectTitle = ref(props.project.projectTitle);
const projectContent = ref(props.project.projectContent);
const projectStartDate = ref(props.project.projectStartDate);
const projectEndDate = ref(props.project.projectEndDate);
const projectHeadCount = ref(props.project.projectHeadCount);
const projectImgUrl = ref(props.project.projectImgUrl);
const loading = ref(false);
const err = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const newImageFile = ref(null);

// 이미지 변경 핸들링
const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    newImageFile.value = file;
  }
};

const updateProject = async() => {
  try {
    console.log(projectSeq.value);
    const jsonData = new FormData();

    const formattedProjectStartDate = new Date(projectStartDate.value).toISOString();
    const formattedProjectEndDate = new Date(projectEndDate.value).toISOString();

    jsonData.append('adminProjectUpdateDTO', JSON.stringify({
      projectTitle: projectTitle.value,
      projectContent: projectContent.value,
      projectStatus: projectStatus.value,
      projectHeadCount: projectHeadCount.value,
      projectImgUrl: projectImgUrl.value,
      projectStartDate: formattedProjectStartDate,
      projectEndDate: formattedProjectEndDate,
    }));

    if (newImageFile.value) {
      jsonData.append('projectImage', newImageFile.value);
    }

    await axios.put(`http://localhost:8086/api/v1/admin/project/${projectSeq.value}`, jsonData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('프로젝트가 성공적으로 수정되었습니다.');

    location.reload(); // 현재 페이지를 새로고침
  } catch (error) {
    console.error('프로젝트를 수정하는 도중 에러가 발생했습니다.', error);
    if (error.response && error.response.data && error.response.data.message) {
      alert(`수정 실패: ${error.response.data.message}`);
    } else {
      alert('프로젝트를 수정하는데 실패했습니다.');
    }
  }
}
</script>

<template>
  <!-- Edit Project Modal -->
  <div v-if="isEditModalOpen" class="modal-overlay">
    <div class="modal-content">
      <button class="close-btn" @click="closeEditModal(false)">×</button>
      <h6><b>프로젝트 수정</b></h6>

      <!-- 이미지 썸네일과 모집 상태 나란히 배치 -->
      <div class="project-image-status-row">
        <!-- 이미지 썸네일 -->
        <div class="project-edit-thumbnail-container">
          <img :src="project.projectImgUrl" class="project-edit-thumbnail" />
        </div>

        <!-- 모집 상태 -->
        <div class="modal-form-group status-group">
          <label for="status">모집 상태</label>
          <select id="status" v-model="projectStatus">
            <option value="PROGRESS">진행중</option>
            <option value="END">종료됨</option>
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
        <input id="title" v-model="projectTitle" required />
      </div>

      <div class="modal-form-group">
        <label for="headCount">모집 인원</label>
        <input id="headCount" type="number" v-model="projectHeadCount" required />
      </div>

      <!-- 내용 -->
      <div class="modal-form-group">
        <label for="content">내용*</label>
        <textarea id="content" v-model="projectContent" required></textarea>
      </div>

      <!-- 프로젝트 일정 -->
      <div class="date-input">
        <label for="projectBoardDates">프로젝트 일정</label>
        <input type="date" v-model="projectStartDate" required /> ~
        <input type="date" v-model="projectEndDate" required />
      </div>

      <!-- 버튼 그룹 -->
      <div class="button-group">
        <button @click="updateProject" class="save-btn">수정</button>
        <button @click="closeEditModal(false)" class="cancel-btn">취소</button>
      </div>
    </div>
  </div>
  <!-- Loading or Error Handling -->
  <div v-else-if="loading" class="loading">로딩 중...</div>
  <div v-else-if="err" class="error">{{ errorMessage }}</div>
</template>

<style scoped>


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
.modal-form-group select {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.modal-form-group textarea {
  height: 300px;
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

</style>