<script setup>
import axios from "axios";
import {onMounted, ref, watch} from "vue";
import TeamMember from "@/components/team/TeamMember.vue";
import TeamSchedule from "@/components/team/TeamSchedule.vue";
import TeamMemberSchedule from "@/components/team/TeamMemberSchedule.vue";
import TeamChat from "@/views/team/TeamChatView.vue";

const props = defineProps({
  teamSeq: {
    type: Number,
    required: false
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  projectStatus: {
    type: String,
    required: true
  }
})

// teamSeq가 변경될 때 로직 추가 (필요한 경우)
watch(() => props.teamSeq, (newSeq) => {
  console.log(newSeq);
  fetchTeamDetail();
  fetchTeamMemberSchedule();
  // 필요에 따라 추가 로직
});

const team = ref(null);
const teamMemberSchedule = ref(null);

const fetchTeamDetail = async () => {
  try {
    if(props.teamSeq > 0) {
      const teamResponse = await axios.get(`http://localhost:8086/api/v1/team/${props.teamSeq}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      team.value = teamResponse.data.data;
    }
  } catch (error) {
    console.error('팀 정보를 불러오는 중 에러가 발생했습니다.');
  }
}

const fetchTeamMemberSchedule = async () => {
  try {
    const memberSchedule = await axios.get(`http://localhost:8086/api/v1/team/${props.teamSeq}/memberSchedule`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    teamMemberSchedule.value = memberSchedule.data.data;
  } catch (error) {
    console.error('팀 정보를 불러오는 중 에러가 발생했습니다.');
  }
}

onMounted(() => {
  fetchTeamDetail();
  fetchTeamMemberSchedule();
});

</script>

<template>
  <div class="row container fixed-header" v-if="team">
      <b-card-header class="text-start d-flex justify-content-between align-items-center">
        <span style="font-weight: bold; font-size: 1.2rem;">프로젝트 팀 조회</span>
        <b-button variant="dark" style="float: right; height: 35px;">팀 이름 변경</b-button>
      </b-card-header>
    <div class="scroll-container">
      <b-card-body>
        <div class="project-card">
        <h4 class="team-name">{{team.teamName}}</h4>
        <TeamMember v-if="team.teamMemberList" :team-member-list="team.teamMemberList" :projectStatus="projectStatus" :teamSeq="team.teamSeq"/> <br />
        <TeamSchedule v-if="team.teamScheduleList" :team-schedule-list="team.teamScheduleList" :team-seq="team.teamSeq" />
        <TeamMemberSchedule v-if="teamMemberSchedule" :team-member-schedule-list="teamMemberSchedule" :team-schedule-list="team.teamScheduleList" :team-seq="team.teamSeq"/>
        <TeamChat v-if="team.teamChatResponse && !isAdmin" :team-chat-response="team.teamChatResponse"/>
        </div>
      </b-card-body>
    </div>
  </div>
</template>

<style scoped>

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
</style>