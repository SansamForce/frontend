<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import TeamMember from "@/components/team/TeamMember.vue";
import TeamSchedule from "@/components/team/TeamSchedule.vue";
import TeamChat from "@/views/team/TeamChatView.vue";

const props = defineProps({
  teamSeq: {
    type: BigInt,
    required: false
  }
})

const team = ref(null);

const fetchTeamDetail = async () => {
  try {
    const teamResponse = await axios.get(`http://localhost:8086/api/v1/team/${props.teamSeq}`, {
      headers: {
        "Authorization" : `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwidXNlcklkIjoia29va29uZzIiLCJhdXRoIjoiTUVNQkVSIiwiaWF0IjoxNzI5NjA3OTY2LCJleHAiOjE3Mjk2OTQzNjZ9.wFKIqsaevEnf8g-6RhwhrWu9oMsaob4SLEI-0PLI00E`
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
            <b-card-header class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">내 프로젝트 팀 조회</h5>
              <b-button variant="dark">팀 이름 변경</b-button>
            </b-card-header>
          <div class="scroll-container">
            <b-card-body>
              <h6>{{team.teamName}}</h6>
              <TeamMember v-if="team.teamMemberList" :team-member-list="team.teamMemberList"/>
              <TeamSchedule v-if="team.teamScheduleList" :team-schedule-list="team.teamScheduleList"/>
              <TeamChat v-if="team.teamChatResponse" :team-chat-response="team.teamChatResponse"/>
            </b-card-body>
          </div>
        </div>
        <div class="row" v-else>
          진행 중인 팀이 존재하지 않습니다.
          <p>강사님이 팀을 정해주신 이후 내가 속한 팀의 정보를 확인하실 수 있습니다.</p>
        </div>
      </b-card>

  </div>

</template>

<style scoped>
.scroll-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  padding: 10px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

</style>