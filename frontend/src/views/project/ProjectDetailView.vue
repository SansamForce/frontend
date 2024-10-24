<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import ProjectDetail from '@/components/project/ProjectDetail.vue';
import TeamDetail from "@/views/team/TeamDetailView.vue";

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
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    project.value = projectResponse.data.data;
  } catch (error) {
    console.error('프로젝트 정보를 불러오는 중 에러가 발생했습니다:', error);
  }
};

// 페이지가 로드될 때 API 호출
onMounted(fetchProjectDetail);
</script>

<template>
    <div class="row card-container" v-if="project">
      <ProjectDetail :project="project" class="card" />
      <TeamDetail :team-seq="project.teamSeq" class="card" />
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
</template>

<style scoped>
.card-container {
  display: flex;          /* 카드들을 수평으로 배치 */
  justify-content: space-between; /* 카드 간의 간격을 조절 */
}

.card {
  border-color : white;
  flex: 1;                /* 각 카드는 동일한 너비를 차지 */
  margin: 0 10px;         /* 카드 간의 여백 */
  display: flex;
  flex-direction: column; /* 카드 안의 요소들을 수직으로 배치 */
}

</style>
