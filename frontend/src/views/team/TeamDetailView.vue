<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import TeamMember from "@/components/team/TeamMember.vue";
import TeamSchedule from "@/components/team/TeamSchedule.vue";
import TeamChat from "@/views/team/TeamChatView.vue";

const props = defineProps({
  teamSeq: {
    type: Number,
    required: false
  }
})

const team = ref(null);

const fetchTeamDetail = async () => {
  try {
    const teamResponse = await axios.get(`http://localhost:8086/api/v1/team/${props.teamSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    team.value = teamResponse.data.data;
  } catch (error) {
    console.error('팀 정보를 불러오는 중 에러가 발생했습니다.');
  }
}

onMounted(fetchTeamDetail);

</script>

<template>
  <div class="col-md-6">

      <b-card class="h-100">
        <div class="row container fixed-header" v-if="team">
            <b-card-header class="text-start d-flex justify-content-between align-items-center">
              <span style="font-weight: bold; font-size: 1.2rem;">내 프로젝트 팀 조회</span>
              <b-button variant="dark" style="float: right; height: 35px;">팀 이름 변경</b-button>
            </b-card-header>
          <div class="scroll-container">
            <b-card-body>
              <div class="project-card">
              <h4 class="team-name">{{team.teamName}}</h4>
              <TeamMember v-if="team.teamMemberList" :team-member-list="team.teamMemberList"/> <br />
              <TeamSchedule v-if="team.teamScheduleList" :team-schedule-list="team.teamScheduleList" :team-seq="team.teamSeq" />
              <TeamChat v-if="team.teamChatResponse" :team-chat-response="team.teamChatResponse"/>
              </div>
            </b-card-body>
          </div>
        </div>

        <div class="no-team-container text-center" v-else>
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

</template>

<style scoped>

.no-team-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh; /* 화면 중앙에 배치 */
  text-align: center;
  max-width: 1200px;
}

.warning-icon {
  font-size: 50px;
  color: #f0ad4e; /* 경고 색상 */
}

p {
  font-size: 1em;
  color: #333;
}

.scroll-container {
  max-height: 820px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  padding: 10px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.team-name {
  font-weight: bold;
}

.team-name:after {
  content: "";
  display: block;
  width: 22%;
  border-bottom: 2px solid #000000;
  margin: 13px 0 13px 0;
}

.fc-event-resizer {
  width: 10px !important;
  height: 10px !important;
  background: #000 !important;
  cursor: ew-resize !important;
}

</style>