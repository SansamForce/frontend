<template>
  <header class="header">
    <div class="logo">
      <h1>T-BUILDING</h1>
    </div>
    <nav class="nav">
<!--      <template v-if="member.auth == 'MEMBER' || member.auth == 'MENTOR'">
        <a href="#">BOARD</a>
        <a href="#">PROJECT</a>
        <a href="#">MYPAGE</a>
        <a href="#">LOGOUT</a>
      </template>-->
<!--      <template v-if="member.auth == 'MANAGER' || member.auth == 'SUB_MANAGER'">
        <a href="#">BOARD</a>
        <a href="#">PROJECT</a>
        <a href="#">MEMBER</a>
        <a href="#">LOGOUT</a>
      </template>-->
<!--      <template v-else>-->
        <a href="#">Login</a>
        <a href="#">Sign Up</a>
<!--      </template>-->
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #222;
  color: #fff;
}

.nav a {
  margin-top: 15px;
  margin-left: 20px;
  color: #fff;
  text-decoration: none;
}
</style>
<script setup lang="ts">
</script>