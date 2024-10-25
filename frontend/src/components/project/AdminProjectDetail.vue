<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});
</script>

<template>
    <!-- 프로젝트 상세 조회 -->
    <b-card-header class="text-start">
      <p style="font-weight: bold">프로젝트 정보</p>
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
</style>
