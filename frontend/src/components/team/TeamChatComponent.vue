<script setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = defineProps({
  teamChatMessageList: {
    type: Array,
    required: false,
    default: () => []
  },
  teamChatSeq: {
    type: BigInt,
    required: false
  },
  teamSeq: {
    type: BigInt,
    required: false
  },
  teamChatMember: {
    type: Object,
    required: false
  }
});

const teamMemberSeq = props.teamChatMember.teamMemberSeq;

// 상태 관리
const newMessage = ref(""); // 새 메시지
let socket = null; // WebSocket 객체

// WebSocket 연결 함수
const connectWebSocket = () => {
  socket = new WebSocket(`ws://localhost:8086/ws/chat/${props.teamChatSeq}`); // WebSocket 서버 URL

  // WebSocket 이벤트 핸들링
  socket.onopen = () => {
    console.log("WebSocket 연결 성공");

    const messageJson = createMessageJson("ENTER", `${props.teamChatMember.teamMemberNickname}님이 입장하였습니다.`);
    socket.send(JSON.stringify(messageJson));
  };

  socket.onmessage = (event) => {
    console.log("타인의 메시지가 도착했습니다.", event.data);
    const receivedMessage = JSON.parse(event.data);
    props.teamChatMessageList.push(receivedMessage);

    nextTick(() => {
      scrollToBottom();
    });
  };

  socket.onclose = () => {
    console.log("WebSocket 연결이 종료되었습니다.");
  };

  socket.onerror = (error) => {
    console.error("WebSocket 오류 발생:", error);
  };
};

// 메시지 전송 함수
const sendMessage = () => {
  console.log(`${props.teamChatMember.teamMemberSeq}`);
  if (newMessage.value.trim() && socket && socket.readyState === WebSocket.OPEN) {

    const messageJson = createMessageJson("TALK", newMessage.value);

    socket.send(JSON.stringify(messageJson)); // 서버에 메시지 전송
    console.log("메시지를 전송했습니다.");

    /*props.teamChatMessageList.push(messageJson); // 로컬에서 메시지 추가*/
    newMessage.value = ""; // 입력창 초기화

    // 전송 후 DOM 업데이트 후 스크롤 하단으로 이동
    nextTick(() => {
      scrollToBottom();
    });
  }
};

function createMessageJson(messageType, message) {
  const now = new Date();
  const years = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return {
    messageType: messageType,
    teamChatSeq: `${props.teamChatSeq}`, // 임의의 사용자 이름
    teamMemberSeq: `${props.teamChatMember.teamMemberSeq}`,
    message: message,
    regDate: `${years}-${month}-${day} ${hours}:${minutes}:${seconds}`
  };

}

const chatWindow = ref(null); // 채팅창을 참조하기 위한 ref

// 채팅창을 스크롤 하단으로 이동하는 함수
const scrollToBottom = () => {
  chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
};

// props가 준비되었을 때 WebSocket 연결
watch(
    [() => props.teamChatSeq, () => props.teamChatMember],
    ([newTeamChatSeq, newTeamChatMember]) => {
      if (newTeamChatSeq && newTeamChatMember) {
        connectWebSocket();
        scrollToBottom();
      }
    }
);

// 컴포넌트가 해제될 때 WebSocket 연결 해제
onBeforeUnmount(() => {
  if (socket) {
    socket.close();
  }
});
</script>

<template>
  <!-- 스크롤 가능한 채팅창 -->
  <div ref="chatWindow" class="chat-window">
    <template v-for="(message, index) in teamChatMessageList" :key="index" >

      <!-- 시스템 메시지 (입장/퇴장 알림 등) -->
      <div v-if="message.messageType === 'ENTER'" class="system-message">
        <p>{{ message.message }}</p>
      </div>

      <div class="chat-message my-message" v-else-if="message.teamMemberSeq == teamChatMember.teamMemberSeq">
        <b-avatar variant= "primary">{{ message.teamMemberSeq }}</b-avatar>
        <div class="message-content align-self-end">
          <p>{{ message.message }}</p>
          <small class="message-time text-right">{{ message.regDate }}</small>
        </div>
      </div>

      <div class="chat-message" v-else>
        <b-avatar variant= "primary">{{ message.teamMemberSeq }}</b-avatar>
        <div class="message-content">
          <p>{{ message.message }}</p>
          <small>{{ message.regDate }}</small>
        </div>
      </div>

    </template>
  </div>

  <!-- 채팅 입력란 -->
  <div class="chat-input d-flex">
    <b-form-input v-model="newMessage" @keyup.enter.native="sendMessage('TALK')" placeholder="메시지를 입력하세요"></b-form-input>
    <b-button variant="primary" class="ml-2" @click="sendMessage('TALK')"><i class="bi bi-send"></i></b-button>
  </div>
</template>

<style scoped>
/* 시스템 메시지 스타일 */
.system-message {
  text-align: center;
  margin: 10px 0;
  font-weight: bold;
  color: #555;
  font-size: 0.9rem;
}
.message-content {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 15px;
  max-width: 75%;
  margin-left: 10px;
}
.message-time {
  display: block;
  margin-top: 5px;
}

.text-right {
  text-align: right;
}

.my-message {
  justify-content: flex-end;
}

.message-content.align-self-end {
  background-color: #007bff;
  color: white;
}

.chat-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.chat-window {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  padding: 10px;
  margin-bottom: 20px;
}

.chat-input {
  margin-top: 10px;
}
</style>