<script setup>
import ProjectList from "@/components/project/ProjectList.vue";
import { reactive, onMounted } from "vue";
import axios from "axios";
// 상태 관리를 위한 반응형 객체 생성
const state = reactive({
  projects: [],
  projectName: ''
});

// API 호출 함수
const fetchProjects = async (page = 1) => {
  try {
    const response = await axios.get(`http://localhost:8086/api/v1/project`, {
      headers: {
        "Authorization" : `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoia29va29uZzIiLCJhdXRoIjoiTUVNQkVSIiwiaWF0IjoxNzI5NjA3OTY2LCJleHAiOjE3Mjk2OTQzNjZ9.wFKIqsaevEnf8g-6RhwhrWu9oMsaob4SLEI-0PLI00E`
      },
      params: {
        // page,
        // categoryCode: state.categoryCode || null,
        // productName: state.productName || null
      }
    });
    console.log(response);
    state.projects = response.data.data;
  } catch (error) {
    console.error('프로젝트 목록을 불러오는 중 에러가 발생했습니다:', error);
  }
};

onMounted(() => fetchProjects());
</script>

<template>
  <div class="container project-page mt-4">
    <b-row class="mb-4">
      <b-col cols="12" class="d-flex justify-content-between align-items-center">
        <h5>내 프로젝트 조회</h5>
        <b-input-group style="width: 30%">
          <b-form-input placeholder="프로젝트 이름으로 검색" v-model="state.projectName"/>
          <b-dropdown text="구분" variant="outline-secondary">
            <b-dropdown-item @click="changeProjectStatus('ALL')">전체</b-dropdown-item>
            <b-dropdown-item @click="changeProjectStatus('PROGRESS')">진행중</b-dropdown-item>
            <b-dropdown-item @click="changeProjectStatus('END')">종료됨</b-dropdown-item>
          </b-dropdown>
        </b-input-group>
      </b-col>
    </b-row>

    <ProjectList :projects="state.projects"/>
</div>
</template>

<script>

</script>

<style scoped>
.project-page {
  max-width: 2580px;
  margin: 0 auto;
}

h2 {
  font-size: 24px;
}
</style>