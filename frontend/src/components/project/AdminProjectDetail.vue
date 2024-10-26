<script setup>
import {ref} from "vue";
import axios from "axios";
import ProjectUpdateModal from "@/components/project/ProjectUpdateModal.vue";
import router from "@/router/index.js";

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const showDropdown = ref(false);
const isEditModalOpen = ref(false);
// 드롭다운 메뉴 토글
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// 수정 모달 열기
const openEditModal = () => {
  isEditModalOpen.value = true;
  showDropdown.value = false;
  emit('openModal', isEditModalOpen.value)
};

const emit = defineEmits(['openModal'])

const deleteProject = async() => {
  if (confirm(`정말로 ${props.project.projectTitle} 프로젝트를 삭제하시겠습니까?\n삭제한 프로젝트는 복원할 수 없습니다.`)) {
    try {
      await axios.delete(`http://localhost:8086/api/v1/admin/project/${props.project.projectSeq}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      alert("프로젝트가 삭제되었습니다.");
      router.push('/admin/projects'); // 삭제 후 목록으로 이동
    } catch (error) {
      alert("프로젝트 삭제 중 오류가 발생했습니다.");
      console.error(error);
    }
  }
}
</script>

<template>
    <!-- 프로젝트 상세 조회 -->
    <b-card-header class="text-start">
      <div class="project-info-header">
        <p style="font-weight: bold">프로젝트 정보</p>
        <div class="dropdown">
          <button @click="toggleDropdown" class="dropdown-btn more-button">· · ·</button>
          <div v-if="showDropdown" class="dropdown-content">
            <button @click="openEditModal" class="dropdown-item">수정</button>
            <button @click="deleteProject" class="dropdown-item">삭제</button>
          </div>
        </div>
      </div>
    </b-card-header>
    <b-card-body>
      <div class="project-card d-flex align-items-start">
        <div class="image-container me-4">
          <img :src="project.projectImgUrl" alt="Project Image" class="project-image img-fluid" />
        </div>
        <div class="project-details">
          <div class="project-title">
            {{ project.projectTitle }}
            <span class="badge">{{ project.projectStatus === "PROGRESS" ? "진행중" : "종료됨" }}</span>
          </div>
          <p class="mt-2">{{ project.projectContent }}</p><br>
          <p><strong>프로젝트 기간 &nbsp; : &nbsp; </strong>{{ project.projectStartDate }} ~ {{ project.projectEndDate }}</p>
          <p><strong>참여 인원 &nbsp; : &nbsp; </strong>{{ project.projectHeadCount }}</p>
        </div>
      </div>

    </b-card-body>
</template>


<style scoped>
.project-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9; /* 배경색 예시 */
  padding: 10px;
  border-radius: 4px;
}

.more-button {
  background: none;
  color : black;
  border: none;
  font-size: 1.2em; /* 크기 조절 */
  cursor: pointer;
}

/* Flexbox를 사용하여 이미지와 텍스트를 나란히 배치 */
.project-card {
  display: flex;
  align-items: flex-start;
  gap: 20px; /* 이미지와 텍스트 사이의 간격 */
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

/* 좌측 이미지 */
.image-container {
  flex-shrink: 0;
  width: 40%; /* 이미지의 너비를 40%로 설정 */
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 우측 텍스트 */
.project-details {
  width: 60%; /* 나머지 공간을 텍스트가 차지 */
}

.project-title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 10px;
}

.project-title:after {
  content: "";
  display: block;
  width: 100%;
  border-bottom: 2px solid #000;
  margin: 10px auto;
}

.badge {
  background-color: #171d8a;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
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
  top: 25px; /* 위치 조정 */
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1;
  width: 80px; /* 너비를 줄임 */
  padding: 5px 0; /* 내용에 맞춰 패딩 조정 */
}

.dropdown-item {
  padding: 8px 12px; /* 줄어든 드롭다운 너비에 맞게 패딩 조정 */
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
  font-size: 0.9em; /* 텍스트 크기 조정 */
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

</style>
