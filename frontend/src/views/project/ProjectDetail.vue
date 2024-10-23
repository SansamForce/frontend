<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import ProjectDetail from '@/components/project/ProjectDetail.vue';
import TeamDetail from "@/views/team/TeamDetail.vue";

// 상태 관리
const project = ref(null);
const route = useRoute();
const router = useRouter();

// 프로젝트 ID 가져오기
const projectSeq = route.params.id;

// API 호출 함수
const fetchProjectDetail = async () => {
  try {
    const projectResponse = await axios.get(`http://localhost:8086/api/v1/project/${projectSeq}`, {
      headers: {
        "Authorization" : `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoia29va29uZzIiLCJhdXRoIjoiTUVNQkVSIiwiaWF0IjoxNzI5NjA3OTY2LCJleHAiOjE3Mjk2OTQzNjZ9.wFKIqsaevEnf8g-6RhwhrWu9oMsaob4SLEI-0PLI00E`
      }
    });
    project.value = projectResponse.data.data;
    console.log(project.value.teamSeq);
  } catch (error) {
    console.error('프로젝트 정보를 불러오는 중 에러가 발생했습니다:', error);
  }
};

// 페이지가 로드될 때 API 호출
onMounted(fetchProjectDetail);
</script>

<template>
  <div class="container mt-4">
    <div class="row" v-if="project">
      <ProjectDetail :project="project" />
      <TeamDetail :team-seq="project.teamSeq"/>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped>

</style>
