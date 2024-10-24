
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
      <div class="col-md-6">
        <b-card class="h-100">
          <b-card-header class="text-start">
            <p style="font-weight: bold">내 프로젝트 상세 조회</p>
          </b-card-header>
          <b-card-body>
            <div class="project-card">
              <div class="image-container mb-3">
                <img :src="project.projectImgUrl" alt="Project Image" class="project-image img-fluid" />
              </div>
              <div class="project-title">
                {{ project.projectTitle }}
                <span class="badge">{{ project.projectStatus === "PROGRESS" ? "진행중" : "종료됨" }}</span>
              </div>
              <p class="mt-2">
                {{ project.projectContent }}
              </p> <br />
              <p><strong>모집 일정 &nbsp; : &nbsp; </strong> {{ project.projectBoardStartDate }} ~ {{ project.projectBoardEndDate }}</p>
              <p><strong>프로젝트 기간 &nbsp; : &nbsp; </strong> {{ project.projectStartDate }} ~ {{ project.projectEndDate }}</p>
              <p><strong>모집 분야 &nbsp; : &nbsp; </strong> 백엔드 / 서버</p>
              <p><strong>참여 인원 &nbsp; : &nbsp;  </strong> {{ project.projectHeadCount }}</p>
            </div>
          </b-card-body>
        </b-card>
      </div>
</template>

<style scoped>
.project-card {
  border: 1px solid #e9ecef;
  padding: 20px;
  background-color: #f8f9fa;
}

.image-container {
  text-align: center;
}

.image-container img {
  max-width: 100%;
}

.project-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  margin-bottom: 20px;
}

.project-title {
  font-weight: bold;
  font-size: 30px;
}

.project-title:after {
  content: "";
  display: block;
  width: 100%;
  border-bottom: 2px solid #000000;
  margin: 20px auto;
}

.badge {
  background-color: #171D8A;
}

h1 {
  margin-bottom: 10px;
  font-size: 2rem;
}

p {
  margin: 5px 0;
  font-size: 1.2rem;
}

strong {
  font-weight: bold;
}
</style>
