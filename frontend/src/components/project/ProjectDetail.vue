
<script setup>
const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="container mt-4">
    <div class="row">
      <!-- 프로젝트 상세 조회 -->
      <div class="col-md-6">
        <b-card class="h-100">
          <b-card-header class="text-start">
            <h5>내 프로젝트 상세 조회</h5>
          </b-card-header>
          <b-card-body>
            <div class="project-card">
              <div class="image-container mb-3">
                <img :src="project.projectImgUrl" alt="Project Image" class="project-image img-fluid" />
              </div>
              <h4>{{ project.projectTitle }}</h4>
              <span class="badge bg-primary">{{ project.projectStatus === "PROGRESS" ? "진행중" : "종료됨" }}</span>
              <p class="mt-2">
                {{ project.projectContent }}
              </p>
              <p><strong>모집 일정  :</strong> {{ project.projectStartDate }} ~ {{ project.projectEndDate }}</p>
              <p><strong>참여 인원 : </strong> {{ project.projectHeadCount }}</p>
            </div>
          </b-card-body>
      <div class="project-detail">

        <h1 class="mt-3">프로젝트 제목 : {{ project.projectTitle }} {{ project.projectStatus }}</h1>
        {{ project.projectContent }}

        <p><strong>모집 일정  :</strong> {{ project.projectStartDate }} ~ {{ project.projectEndDate }}</p>
        <p><strong>참여 인원 : </strong> {{ project.projectHeadCount }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.project-image {
  width: 300px;
  height: auto;
  object-fit: cover;
  margin-bottom: 20px;
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
