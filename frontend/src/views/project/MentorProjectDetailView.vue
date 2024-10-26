<script setup>
import {ref, onMounted, reactive, computed} from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import MemberProjectDetail from '@/components/project/MemberProjectDetail.vue';
import TeamDetail from "@/views/team/TeamDetailView.vue";
import MentorProjectDetail from "@/components/project/MentorProjectDetail.vue";
import ProjectTeamListView from "@/views/project/ProjectTeamListView.vue";
import ProjectMemberListView from "@/views/project/ProjectMemberListView.vue";
// 상태 관리
const route = useRoute();

// 프로젝트 ID 가져오기
const projectSeq = route.params.id;

const project = ref(null);
const projectTeamList = ref([]);

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

  } catch (error) {
    console.error('프로젝트 정보를 불러오는 중 에러가 발생했습니다:', error);
  }
};

const fetchProjectTeamList = async () => {
  try {
    const projectTeamResponse = await axios.get(`http://localhost:8086/api/v1/project/${projectSeq}/team`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    projectTeamList.value = projectTeamResponse.data.data;

    // 첫 번째 팀 시퀀스 안전하게 가져오는 계산된 속성
    console.log(projectTeamList.value);
  } catch (error) {
    console.error('팀 정보를 불러오는 중 에러가 발생했습니다.', error);
  }
}

const teamSeq = ref(0);

// 자식으로부터 값을 받는 함수
const receiveTeamSeqFromChild = (value) => {
  teamSeq.value = value; // 자식으로부터 받은 값을 저장
};

onMounted(() => {
  fetchProjectDetail()
  fetchProjectTeamList()
})
</script>

<template>
  <template v-if="projectTeamList && project">
    <div class="row card-container">
      <div class="col-md-6">
        <b-card class="h-100">
          <MentorProjectDetail :project="project" class="card"/>
          <ProjectTeamListView :projectSeq="projectSeq" :projectTeamList="projectTeamList"
                               @selectTeam="receiveTeamSeqFromChild"/>
        </b-card>
      </div>
      <ProjectMemberListView v-if="teamSeq === 0" :projectSeq="projectSeq" :isAdmin="false"/>
      <TeamDetail v-if="teamSeq !== 0" :isAdmin="project.projectMentorYn=== 'Y'" :teamSeq="teamSeq" class="card" />
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
</style>
