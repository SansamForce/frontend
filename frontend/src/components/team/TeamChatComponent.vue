<script setup>

const props = defineProps({
  teamChatMessageList: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <!-- 스크롤 가능한 채팅창 -->
  <div v-for="(message, index) in teamChatMessageList" :key="index" class="chat-message">
    <b-avatar variant="primary">{{ message.teamChatMessageSeq }}</b-avatar>
    <div class="message-content">
      <b>{{ message.teamChatMessageSeq }}</b>
      <p>{{ message.message }}</p>
      <small>{{ message.regDate }}</small>
    </div>
  </div>
</template>-

<script>

</script>
<style scoped>
.chat-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.message-content {
  margin-left: 10px;
}
</style>