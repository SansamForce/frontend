<script setup>

import {onMounted, ref, reactive, watch} from "vue";
import axios from "axios";
import TeamChatComponent from "@/components/team/TeamChatComponent.vue";

const props = defineProps({
  teamChatResponse: {
    type: Object,
    required: true
  }
})

let teamChatMessageList = ref(null);
const teamChatRoom = ref(null);
const newMessage = ref(null);

const fetchTeamChatDetail = async () => {
  try {
    const teamChatRoomResponse = await axios.get(`http://localhost:8086/api/v1/team/${props.teamChatResponse.teamSeq}/chat/${props.teamChatResponse.teamChatSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    teamChatRoom.value = teamChatRoomResponse.data.data;
    teamChatMessageList = teamChatRoomResponse.data.data.teamChatMessageList;
  } catch (error) {
    console.error('팀 채팅 정보를 불러오는 중 에러가 발생했습니다.');
  }
}

watch(teamChatRoom, (newValue) => {
  if (newValue && newValue.teamChatSeq) {
    connect();
  }
});

defineExpose({
  teamChatMessageList,
  teamChatRoom
})
onMounted(() => fetchTeamChatDetail());
</script>

<template>
  <!-- 채팅방 섹션 -->
  <b-card v-if="teamChatResponse">
    <h5>{{teamChatResponse.teamChatName}}</h5>
    <h6>{{teamChatResponse.teamChatComment}}</h6>
    <p><strong>채팅방 생성일 : </strong>{{teamChatResponse.regDate}}</p>

    <!-- 스크롤 가능한 채팅창 -->
<!--    <div class="chat-window" v-if="teamChatRoom.teamChatMessageList">
      <TeamChatComponent :team-chat-message-list="teamChatMessageList" />
    </div>-->

    <!-- 채팅 입력란 -->
    <div class="chat-input d-flex">
      <b-form-input v-model="newMessage" placeholder="메시지를 입력하세요..."></b-form-input>
      <b-button variant="primary" class="ml-2" @click="sendMessage">전송</b-button>
    </div>
  </b-card>
  <div v-else>
    Loading...
  </div>
</template>

<script>

export default {
  mounted() {
    console.log("@");
    this.connect();
    console.log("@@");
  }
  , methods : {
    connect() {
      console.log(`${teamChatRoom.value.teamChatSeq}`)

      this.socket = new WebSocket(`ws://localhost:8086/ws/chat/${teamChatRoom.value.teamChatSeq}`);

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.messages.push({
          sender: message.sender,
          text: message.text,
          time: new Date().toLocaleTimeString(),
        });
      };

      // 연결이 끊겼을 때 처리하는 부분
      this.socket.onclose = () => {
        console.log('웹 소켓 연결이 끊겼습니다.');
      };

      // 오류 처리
      this.socket.onerror = (error) => {
        console.error('웹 소켓 오류:', error);
      };

    }, sendMessage() {
      if(this.message.trim()) {
        const chatMessage = {
          teamChatSeq : this.teamChatSeq,
          teamMemberSeq : this.teamMemberSeq,
          message : this.message,
          messageType : "TALK"
        }

        this.socket.send(JSON.stringify(chatMessage))
        this.teamChatMessageList.push(chatMessage.message)
      }
    }
  }, beforeUnmount() {
    // 컴포넌트가 해제되기 전 웹 소켓 연결 해제
    if (this.socket) {
      this.socket.close();
    }
  },
}

</script>

<style scoped>
.chat-window {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  padding: 10px;
  margin-bottom: 10px;
}

.chat-input {
  margin-top: 10px;
}
</style>