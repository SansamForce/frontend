<template>
  <header class="header">
    <div class="logo">
      <h1><a href="@/App.vue">T-BUILDING</a></h1>
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