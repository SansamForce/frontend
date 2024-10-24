<script setup>

// 데이터를 가져오는 로직을 여기에 넣기
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";

const props = defineProps({
  teamChatMessageList: {
    type: Array,
    required: false,
    default: () => []
  },
  teamChatSeq : {
    type: BigInt,
    required: false
  },
  teamSeq : {
    type: BigInt,
    required: false
  }
})

// 상태 관리
const newMessage = ref(''); // 새 메시지
let socket = null; // WebSocket 객체

// WebSocket 연결 함수
const connectWebSocket = () => {
  socket = new WebSocket(`ws://localhost:8086/ws/chat/${props.teamChatSeq}`); // WebSocket 서버 URL

  // WebSocket 이벤트 핸들링
  socket.onopen = () => {
    console.log('WebSocket 연결 성공');
  };

  socket.onmessage = (event) => {
    console.log('타인의 메시지가 도착했습니다.')
    const receivedMessage = JSON.parse(event.data);
    props.teamChatMessageList.push(receivedMessage);
  };

  socket.onclose = () => {
    console.log('WebSocket 연결이 종료되었습니다.');
  };

  socket.onerror = (error) => {
    console.error('WebSocket 오류 발생:', error);
  };
};

// 메시지 전송 함수
const sendMessage = () => {
  if (newMessage.value.trim() && socket && socket.readyState === WebSocket.OPEN) {
    const message = {
      messageType : "TALK",
      teamChatSeq : `${props.teamChatSeq}`, // 임의의 사용자 이름
      teamMemberSeq : `${props.teamSeq}`,
      message : newMessage.value
    };
    socket.send(JSON.stringify(message)); // 서버에 메시지 전송
    console.log('메시지를 전송했습니다.')

    props.teamChatMessageList.push(message); // 로컬에서 메시지 추가
    newMessage.value = ''; // 입력창 초기화

    nextTick(() => {
      scrollToBottom();
    });
  }
};

const chatWindow = ref(null); // 채팅창을 참조하기 위한 ref

const scrollToBottom = () => {
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  }
};

// 컴포넌트가 마운트될 때 WebSocket 연결
onMounted(() => {
  connectWebSocket();
  nextTick(() => {
    scrollToBottom();
  });

});


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
      <div class="chat-message">
        <b-avatar variant= "primary">{{ message.teamMemberSeq }}</b-avatar>
        <div class="message-content">
          <p>{{ message.message }}</p>
          <small>{{ message.regDate }}</small>
        </div>
      </div>
      <div class="chat-message my-message">
        <b-avatar variant= "primary">{{ message.teamMemberSeq }}</b-avatar>
        <div class="message-content align-self-end">
          <p>{{ message.message }}</p>
          <small class="message-time text-right">{{ message.regDate }}</small>
        </div>
      </div>
    </template>
  </div>

  <!-- 채팅 입력란 -->
  <div class="chat-input d-flex">
    <b-form-input v-model="newMessage" placeholder="메시지를 입력하세요"></b-form-input>
    <b-button variant="primary" class="ml-2" @click="sendMessage"><i class="bi bi-send"></i></b-button>
  </div>

</template>

<script>

</script>
<style scoped>
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