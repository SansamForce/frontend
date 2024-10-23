<script setup>
import ProjectList from "@/components/project/ProjectList.vue";
import Pagination from "@/components/project/Pagination.vue";
import {reactive, onMounted, computed} from "vue";
import axios from "axios";
// 상태 관리를 위한 반응형 객체 생성
const state = reactive({
  projects: [],
  projectName: '',
  currentPage: 1,
  pageSize: 8
});

// 전체 프로젝트 수
const totalProjects = computed(() => state.projects.length);

// 페이지 수 계산
const totalPages = computed(() => Math.ceil(totalProjects.value / state.pageSize));

// 현재 페이지에 보여줄 프로젝트
const paginatedProjects = computed(() => {
  const start = (state.currentPage - 1) * state.pageSize;
  const end = start + state.pageSize;
  return state.projects.slice(start, end);
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

// 페이지 변경 함수
const changePage = (page) => {
  state.currentPage = page;
};

onMounted(() => fetchProjects());
</script>

<template>
  <div class="container project-page mt-4">
<!--    <b-row class="mb-4">
      <b-col cols="12" class="d-flex justify-content-between align-items-center" style="margin-left: 88%">
          <b-dropdown text="모집 상태" variant="outline-secondary">
            <b-dropdown-item @click="changeProjectStatus('ALL')">전체</b-dropdown-item>
            <b-dropdown-item @click="changeProjectStatus('PROGRESS')">진행중</b-dropdown-item>
            <b-dropdown-item @click="changeProjectStatus('END')">종료됨</b-dropdown-item>
          </b-dropdown>
      </b-col>
    </b-row>-->

    <span class="total-project"> 총 {{ totalProjects }} 개의 프로젝트가 등록되어 있습니다.</span>
    <ProjectList :projects="paginatedProjects"/>

    <Pagination :totalPages="totalPages" :currentPage="state.currentPage" @changePage="changePage" />


  </div>
</template>

<style scoped>

 .project-page {
   max-width: 1280px;
   margin: 0 auto;
 }

h5 {
  font-size: 24px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
}

button {
  margin: 0 5px;
}

.total-project {
  color: #222222;

}

</style>