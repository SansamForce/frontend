<script setup>

import {ref} from "vue";
import router from "@/router/index.js";

const props = defineProps({
  projectTeamList: {
    type: Array,
    required: true
  },
  projectSeq: {
    type: Number,
    required:true
  }
});

const teamSeq = ref(0);
const emit = defineEmits(['selectTeam'])

const teamSeqToParent = (seq) => {
  teamSeq.value = seq;

  emit('selectTeam', teamSeq.value)
}

// 팀 빌딩 화면으로 이동하는 함수
const navigateToTeamBuilding = () => {
  router.push({ name: 'TeamBuilding', params: { id: props.projectSeq } });
};
</script>

<template>
  <!-- 팀 목록 경고 -->
  <template v-if="projectTeamList.length > 0">
    <h5 class="team-schedule-text">프로젝트 팀 목록 조회</h5>
    <div class="team-list-container">
      <b-button @click="teamSeqToParent(0)" v-if="teamSeq !== 0" variant="dark" style="float: right; height: 35px;">프로젝트 팀 목록 조회하기</b-button>
      <h3>팀 목록</h3>
      <div class="team-list d-flex flex-wrap justify-content-between">
        <!-- 팀 목록 카드 반복 -->
        <div v-for="team in projectTeamList" :key="team.teamSeq" class="team-card">
          <b-card class="h-100">
            <div class="d-flex align-items-center">
              <!-- 좌측 팀 이미지 -->
              <div class="team-image-container me-3">
                <img src="/images/team-image.png" alt="Team Image" class="team-image img-fluid" />
              </div>
              <!-- 우측 팀 정보 -->
              <div class="team-info">
                <h5>{{ team.teamName }}</h5>
                <p><strong>팀 등록 일자</strong></p>
                <p>{{ team.regDate }}</p>
                  <b-button @click="teamSeqToParent(team.teamSeq)" variant="dark" class="float-end">조회</b-button>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>
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
      </p>
      <p>
        T-Building에서 제공하는 자동 팀 빌딩모드로<br />
        지금 바로 팀을 빌딩해 보세요!
      </p>
      <b-button variant="dark" style="float: right; height: 35px;" @click="navigateToTeamBuilding">팀 빌딩하기</b-button>
    </div>
  </template>
</template>

<style scoped>
.warning-icon {
  font-size: 50px;
  color: #f0ad4e; /* 경고 색상 */
}

p {
  font-size: 1em;
  color: #333;
}

.team-schedule-text {
  font-weight: bold;
}

.team-schedule-text:after {
  content: "";
  display: block;
  width: 16%;
  border-bottom: 2px solid #000000;
  margin: 13px 0 13px 0;
}

.team-list-container {
  padding: 10px;
}

.team-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px; /* 카드 사이의 간격 */
}

.team-card {
  width: 48%; /* 카드 크기를 줄임 */
  margin-bottom: 10px; /* 카드 아래 간격 */
  margin-right: 0px; /* 카드 사이의 간격 */
}

.team-image-container {
  width: 80px; /* 이미지 크기 줄임 */
  height: 80px;
  overflow: hidden;
}

.team-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-info {
  flex-grow: 1;
}

h5 {
  font-weight: bold;
  margin-bottom: 10px;
}
</style>