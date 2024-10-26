<script setup>
import ProjectList from "@/components/project/ProjectList.vue";
import Pagination from "@/components/project/Pagination.vue";
import {onMounted, computed, ref} from "vue";
import axios from "axios";
// 상태 관리를 위한 반응형 객체 생성

const projectList = ref([]);
const currentPage = ref(1);
const pageSize = ref(8);

// 전체 프로젝트 수
const totalCount = computed(() => projectList.value.length);

// 페이지 수 계산
const totalPage = computed(() => Math.ceil(totalCount.value / pageSize.value));

// API 호출 함수
const fetchProjectList = async () => {
  try {
    const response = await axios.get(`http://localhost:8086/api/v1/project`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    projectList.value = response.data.data.slice(start, end);
  } catch (error) {
    console.error('프로젝트 목록을 불러오는 중 에러가 발생했습니다:', error);
  }
};

// 페이지 변경 함수
const changePage = (page) => {
  currentPage.value = page;
};

onMounted(() => {
  fetchProjectList()
})
</script>

<template>
  <div class="container project-page mt-4">
    <span class="total-project"> 총  <span class="total-project-count">{{ totalCount }}</span> 개의 프로젝트가 등록되어 있습니다.</span>
    <ProjectList :projectList="projectList"/>

    <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="changePage" />
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

.total-project-count {
  color: #171D8A;
  font-weight: bold;
}

</style>