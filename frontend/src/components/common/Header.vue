<template>
  <header class="header">
    <div class="logo">
      <h1><router-link to="/">T-BUILDING</router-link></h1>
    </div>
    <nav class="nav">
      <template v-if="userStore.isAuthenticated">
        <!-- 사용자 권한에 따라 다른 메뉴 표시 -->
        <template v-if="userStore.auth === 'MEMBER' || userStore.auth === 'MENTOR'">
          <router-link to="/projectBoards">BOARD</router-link>
          <router-link to="/projects">PROJECT</router-link>
          <router-link to="/mypage">MYPAGE</router-link>
          <router-link to="/logout" @click.prevent="logout">LOGOUT</router-link>
        </template>
        <template v-if="userStore.auth === 'MANAGER' || userStore.auth === 'SUB_MANAGER'">
          <router-link to="/projectBoards">BOARD</router-link>
          <router-link to="/projects">PROJECT</router-link>
          <router-link to="/member">MEMBER</router-link>
          <router-link to="/logout" @click.prevent="logout">LOGOUT</router-link>
        </template>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/signup">Sign Up</router-link>
      </template>
    </nav>
  </header>
</template>

<script setup lang="js">
import { useUserStore } from '@/stores/UserStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 8px 20px;
  background-color: #222;
  color: #fff;
}

.logo a {
  font-size: 30px;
  color: #fff;
  text-decoration: none;
}

.nav a {
  margin-top: 10px;
  font-size: 25px;
  margin-left: 20px;
  color: #fff;
  text-decoration: none;
}

.nav a:hover {
  color: #3FF3FF;
}
</style>
