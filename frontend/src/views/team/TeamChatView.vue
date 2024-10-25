<script setup>

import {onMounted, ref, reactive, watch} from "vue";
import axios from "axios";
import TeamChatComponent from "@/components/team/TeamChat.vue";

const props = defineProps({
  teamChatResponse: {
    type: Object,
    required: true
  }
})

const teamChatMessageList = ref([]);
const teamChatMemberList = ref([]);
const teamChatMember = ref({});

const fetchTeamChatDetail = async () => {
  try {
    const teamChatRoomResponse = await axios.get(`http://localhost:8086/api/v1/team/${props.teamChatResponse.teamSeq}/chat/${props.teamChatResponse.teamChatSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    teamChatMember.value = teamChatRoomResponse.data.data;
    teamChatMemberList.value = teamChatRoomResponse.data.data.teamChatMemberList;
    teamChatMessageList.value = teamChatRoomResponse.data.data.teamChatMessageList;
  } catch (error) {
    console.error('팀 채팅 정보를 불러오는 중 에러가 발생했습니다.');
  }
}

onMounted(() => fetchTeamChatDetail());
</script>

<template>
  <!-- 채팅방 섹션 -->
  <h6>팀 채팅</h6>
  <b-card v-if="teamChatResponse">
    <h5>{{teamChatResponse.teamChatName}}</h5>
    <h6>{{teamChatResponse.teamChatComment}}</h6>
    <p><strong>채팅방 생성일 : </strong>{{teamChatResponse.regDate}}</p>

    <TeamChatComponent v-if="teamChatMember != null"
                       :team-chat-message-list="teamChatMessageList"
                       :team-chat-seq="teamChatResponse.teamChatSeq"
                       :team-seq="teamChatResponse.teamSeq"
                       :team-chat-member="teamChatMember"
                       :team-chat-member-list="teamChatMemberList"/>
  </b-card>
  <div v-else>
    Loading...
  </div>
</template>

<style scoped>

</style>