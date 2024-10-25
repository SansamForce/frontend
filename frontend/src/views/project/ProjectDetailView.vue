<script setup>
import {ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import MemberProjectDetail from '@/components/project/MemberProjectDetail.vue';
import TeamDetail from "@/views/team/TeamDetailView.vue";
import MentorProjectDetail from "@/components/project/MentorProjectDetail.vue";
import MentorProjectTeamList from "@/views/project/ProjectTeamListView.vue";
import ProjectMemberListView from "@/views/project/ProjectMemberListView.vue";
// 상태 관리
const project = ref(null);
const route = useRoute();
const router = useRouter();

// 프로젝트 ID 가져오기
const projectSeq = route.params.id;
const projectTeamList = ref([]);
const isProjectListSelectYn = ref("Y");

// API 호출 함수
const fetchProjectDetail = async () => {
  try {
    const projectResponse = await axios.get(`http://localhost:8086/api/v1/project/${projectSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    project.value = projectResponse.data.data;
    console.log("project : ", project.value)

    try {
      const projectTeamResponse = await axios.get(`http://localhost:8086/api/v1/team/project/${projectSeq}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      projectTeamList.value = projectTeamResponse.data.data;
      console.log(projectTeamList.value);
    } catch (error) {
      console.error('팀 정보를 불러오는 중 에러가 발생했습니다.', error);
    }
  } catch (error) {
    console.error('프로젝트 정보를 불러오는 중 에러가 발생했습니다:', error);
  }
};

// 페이지가 로드될 때 API 호출
onMounted(fetchProjectDetail);

// 팀 빌딩 화면으로 이동하는 함수
const navigateToTeamBuilding = () => {
  router.push({ name: 'TeamBuilding', params: { id: projectSeq } });
};
</script>

<template>
  <template v-if="projectTeamList && project">
    <div class="row card-container" v-if="project.projectMentorYn === 'Y'">
      <div class="col-md-6">
        <b-card class="h-100">
          <MentorProjectDetail :project="project" class="card" />
          <div v-if="projectTeamList.length > 0">
            <MentorProjectTeamList :project-team-list="projectTeamList" />
          </div>
          <div class="no-team-container text-center" v-else>
            <!-- 경고 아이콘 -->
            <div class="warning-icon">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </div>
            <!-- 텍스트 -->
            <p class="mt-3">
              진행 중인 팀이 존재하지 않습니다.
            </p>
            <p>
              T-Building에서 제공하는 자동 팀 빌딩모드로<br />
              지금 바로 팀을 빌딩해 보세요!
            </p>
            <b-button variant="dark" @click="navigateToTeamBuilding" style="float: right; height: 35px;">팀 빌딩하기</b-button>
          </div>
        </b-card>
      </div>
      <ProjectMemberListView v-if="isProjectListSelectYn === 'Y'" :project-seq="projectSeq" />
      <TeamDetail v-if="isProjectListSelectYn === 'N'" :team-seq="project.teamSeq" class="card" />
    </div>
    <div class="row card-container" v-else>
      <MemberProjectDetail :project="project" class="card" />
      <TeamDetail v-if="projectTeamList.length === 1" :team-seq="project.teamSeq" class="card" />
    </div>
  </template>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  justify-content: space-between;
}

.card {
  border-color: white;
  flex: 1;/* 각 카드는 동일한 너비를 차지 */
  margin: 0 10px; /* 카드 간의 여백 */
  display: flex;
  flex-direction: column;
}

.no-team-container {
  display: flex;
  flex-direction: column; /* 카드 안의 요소들을 수직으로 배치 */
  align-items: center;
  justify-content: center;
  height: 50vh; /* 화면 중앙에 배치 */
  text-align: center;
}

.warning-icon {
  font-size: 50px;
  color: #f0ad4e; /* 경고 색상 */
}

.team-button {
  margin-left: auto;
}

</style>
