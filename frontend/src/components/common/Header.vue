<template>
  <header class="header">
    <div class="logo">
      <h1><a href="/">T-BUILDING</a></h1>
    </div>
    <nav class="nav">
<!--      <template v-if="member.auth == 'MEMBER' || member.auth == 'MENTOR'">
        <router-link to="#">BOARD</router-link>
        <router-link to="#">PROJECT</router-link>
        <router-link to="#">MYPAGE</router-link>
        <router-link to="#">LOGOUT</router-link>
      </template>-->
<!--      <template v-if="member.auth == 'MANAGER' || member.auth == 'SUB_MANAGER'">
        <router-link to="#">BOARD</router-link>
        <router-link to="#">PROJECT</router-link>
        <router-link to="#">MEMBER</router-link>
        <router-link to="#">LOGOUT</router-link>
      </template>-->
<!--      <template v-else>-->
        <router-link to="/login">Login</router-link>
        <router-link to="/signup">Sign Up</router-link>
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

.logo a{
  font-size: 50px;
  color: #fff;
  text-decoration: none;
}

.nav a {
  font-size: 40px;
  margin-left: 20px;
  color: #fff;
  text-decoration: none;
}

.nav a:hover {
  color: #3FF3FF;
}
</style>

<script setup lang="ts">
</script>
