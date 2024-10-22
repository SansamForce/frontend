<script setup>

</script>

<template>
  <div>
    <div class="messages">
      <div v-for="(message, index) in teamChatMessageList" :key="index">
        <strong>{{ message.user }}:</strong> {{ message.text }}
      </div>
    </div>
    <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message..." />
  </div>
</template>-

<script>
  export default {

    data() {
      return {
        teamChatMessageList : [],
        teamChatSeq : "",
        message : "",
        teamMemberSeq : "1",

      }
    }, created() {
      this.connect();
    }, methods : {
      connect() {
        this.socket = new WebSocket("ws://localhost:8086/ws/chat/1");

        this.socket.onmessage = (event) => {
          console.log("@");
          const message = JSON.parse(event.data);
          this.teamChatMessageList.push(message)
        }
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
          this.message = "";
        }
      }
    }
  }
</script>

<style scoped>
.messages {
  height: 400px;
  overflow-y: scroll;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>