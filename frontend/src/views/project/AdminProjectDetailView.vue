<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import TeamDetail from "@/views/team/TeamDetailView.vue";
import AdminProjectDetail from "@/components/project/AdminProjectDetail.vue";
import AdminProjectTeamListView from "@/views/project/AdminProjectTeamListView.vue";
import ProjectMemberListView from "@/views/project/ProjectMemberListView.vue";
import ProjectUpdateModal from "@/components/project/ProjectUpdateModal.vue";

const route = useRoute(); // 라우터 호출 시 ${seq} 값을 가져오기 위함
// 프로젝트 ID 가져오기
const projectSeq = route.params.id; // ${seq} 값 저장

// 상태 관리
const project = ref(null);
const projectTeamList = ref(null);

// API 호출 함수
const fetchProjectDetail = async () => {
  try {
    const projectResponse = await axios.get(`http://localhost:8086/api/v1/admin/project/${projectSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    project.value = projectResponse.data.data;
  } catch (error) {
    console.error('프로젝트 정보를 불러오는 중 에러가 발생했습니다:', error);
  }
};

const fetchProjectTeamList = async () => {
  try {
    const projectTeamResponse = await axios.get(`http://localhost:8086/api/v1/team/project/${projectSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    projectTeamList.value = projectTeamResponse.data.data;
    // 첫 번째 팀 시퀀스 안전하게 가져오는 계산된 속성
  } catch (error) {
    console.error('팀 정보를 불러오는 중 에러가 발생했습니다.', error);
  }
}

// 자식으로부터 값을 받는 함수
// teamSeq 값이 0이면 프로젝트 멤버 리스트 조회
// teamSeq 값이 0이 아니면 해당 팀의 팀 정보 조회
const teamSeq = ref(0);
const receiveTeamSeqFromChild = (value) => {
  teamSeq.value = value; // 자식으로부터 받은 값을 저장
};

const isEditModalOpen = ref(false);
const receiveModalOpenFromChild = (value) => {
  isEditModalOpen.value = value
}

const receiveModalCloseFromChild = (value) => {

  isEditModalOpen.value = value
}

// 페이지가 로드될 때 API 호출
onMounted(() => {
  fetchProjectDetail()
  fetchProjectTeamList()
})

</script>

<template>
  <div class="row card-container" v-if="projectTeamList && project">
    <div class="col-md-6">
      <b-card class="h-100">
        <AdminProjectDetail :project="project" class="card"
                            @openModal="receiveModalOpenFromChild"/>
        <AdminProjectTeamListView :project-team-list="projectTeamList"
                             @selectTeam="receiveTeamSeqFromChild"/>
      </b-card>
    </div>
    <ProjectMemberListView v-if="teamSeq === 0" :project-seq="projectSeq" :isAdmin="true"/>
    <TeamDetail v-else :team-seq="teamSeq" :isAdmin="true" class="card" />
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
  <ProjectUpdateModal v-if="project"
                      :is-edit-modal-open="isEditModalOpen"
                      :project="project"
                      @closeModal="receiveModalCloseFromChild"/>
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
