<script setup>
import {ref, onMounted, reactive, computed} from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import MemberProjectDetail from '@/components/project/MemberProjectDetail.vue';
import TeamDetail from "@/views/team/TeamDetailView.vue";
import MentorProjectDetail from "@/components/project/MentorProjectDetail.vue";
import ProjectTeamListView from "@/views/project/ProjectTeamListView.vue";
import ProjectMemberListView from "@/views/project/ProjectMemberListView.vue";
// 상태 관리
const project = ref(null);
const route = useRoute();
const router = useRouter();

// 프로젝트 ID 가져오기
const projectSeq = route.params.id;
const projectTeamList = ref([]);
const isProjectMemberList = ref(true);
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
    console.log("project : ", project.value)

    try {
      const projectTeamResponse = await axios.get(`http://localhost:8086/api/v1/team/project/${projectSeq}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      projectTeamList.value = projectTeamResponse.data.data;
      firstTeamSeq.value = projectTeamList.value.length > 0 ? projectTeamList.value[0].teamSeq : 0;

      // 첫 번째 팀 시퀀스 안전하게 가져오는 계산된 속성
      console.log(projectTeamList.value);
    } catch (error) {
      console.error('팀 정보를 불러오는 중 에러가 발생했습니다.', error);
    }
  } catch (error) {
    console.error('프로젝트 정보를 불러오는 중 에러가 발생했습니다:', error);
  }
};


const teamSeq = ref(0);

// 자식으로부터 값을 받는 함수
const receiveTeamSeqFromChild = (value) => {
  teamSeq.value = value; // 자식으로부터 받은 값을 저장
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
    <div class="row card-container" v-if="project.projectMentorYn=== 'Y'">
      <div class="col-md-6">
        <b-card class="h-100">
          <MentorProjectDetail :project="project" class="card"/>

          <div v-if="projectTeamList.length> 0">
            <ProjectTeamListView :project-team-list="projectTeamList"
                                 @selectTeam="receiveTeamSeqFromChild"/>
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
            <b-button variant="dark" style="float: right; height: 35px;" @click="navigateToTeamBuilding">
              팀 빌딩하기
            </b-button>

          </div>
        </b-card>
      </div>
      <ProjectMemberListView v-if="teamSeq === 0" :project-seq="projectSeq"/>
      <TeamDetail v-if="teamSeq !== 0" :is-admin="project.projectMentorYn=== 'Y'" :team-seq="teamSeq" class="card" />
    </div>
    <div class="row card-container" v-else>
      <MemberProjectDetail :project="project" class="card" />
      <div class="col-md-6">
        <b-card class="h-100">
          <TeamDetail v-if="firstTeamSeq !== 0" :is-admin="project.projectMentorYn=== 'Y'" :team-seq="firstTeamSeq" class="card" />
          <div class="no-team-container2 text-center" v-else>
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
  height: 50vh; /* 화면 중앙에 배치 */
  text-align: center;
}

.no-team-container2 {
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


.team-button {
  margin-left: auto;
}

</style>
