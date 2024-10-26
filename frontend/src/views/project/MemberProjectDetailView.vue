<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import MemberProjectDetail from '@/components/project/MemberProjectDetail.vue';
import TeamDetail from "@/views/team/TeamDetailView.vue";

// 상태 관리
const project = ref(null);
const route = useRoute();
const router = useRouter();

// 프로젝트 ID 가져오기
const projectSeq = route.params.id;
const projectTeamList = ref([]);
const firstTeamSeq = ref(0);

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

const fetchProjectTeamDetail = async () => {
  try {
    const projectTeamResponse = await axios.get(`http://localhost:8086/api/v1/team/project/${projectSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    projectTeamList.value = projectTeamResponse.data.data;
    firstTeamSeq.value = projectTeamList.value.length > 0 ? projectTeamList.value[0].teamSeq : 0;

  } catch (error) {
    console.error('팀 정보를 불러오는 중 에러가 발생했습니다.', error);
  }
}

// 페이지가 로드될 때 API 호출
onMounted(() => {
  fetchProjectDetail()
  fetchProjectTeamDetail()
});
</script>

<template>
  <template v-if="projectTeamList && project">
    <div class="row card-container">
      <MemberProjectDetail :project="project" class="card" />
      <div class="col-md-6">
        <b-card class="h-100">
          <template v-if="firstTeamSeq !== 0">
            <TeamDetail :isAdmin="false" :team-seq="firstTeamSeq" :projectStatus="project.projectStatus" class="card" />
          </template>
          <template v-else>
            <div class="no-team-container text-center">
              <!-- 경고 아이콘 -->
              <div class="warning-icon">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </div>
              <!-- 텍스트 -->
              <p class="mt-3">
                진행 중인 팀이 존재하지 않습니다.
                <br />
                강사님이 팀을 정해주신 이후 내가 속한 팀의 정보를 확인하실 수 있습니다.
              </p>
            </div>
          </template>
        </b-card>
      </div>
    </div>
  </template>
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

.no-team-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 1200px;
  height: 100%; /* 카드 안에서 전체 높이 차지 */
}

.warning-icon {
  font-size: 50px;
  color: #f0ad4e; /* 경고 색상 */
}
</style>
