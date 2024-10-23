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
        <div class="auth-links">
          <router-link to="/login">Login</router-link>
          <router-link to="/signup">Sign Up</router-link>
        </div>
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
  align-items: center;
  padding: 16px 30px;
  background-color: #222;
  color: #fff;
}

.logo a {
  font-size: 2.5vw;
  color: #fff;
  text-decoration: none;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%; /* 메뉴가 전체 화면의 절반을 차지 */
}

.nav a {
  font-size: 1.8vw;
  color: #fff;
  text-decoration: none;
  text-align: center;
  flex-grow: 1;
}

.nav a:hover {
  color: #3FF3FF;
}

/* 로그인 및 회원가입 버튼을 오른쪽에 배치 */
.auth-links {
  margin-left: auto; /* Login과 Sign Up을 오른쪽으로 붙이기 */
}

.auth-links a {
  margin-left: 2vw; /* 두 항목 간 간격 */
}

/* 미디어 쿼리: 작은 화면을 위한 반응형 스타일 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;
  }

  .logo a {
    font-size: 5vw;
  }

  .nav {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .nav a {
    font-size: 4vw;
    margin-bottom: 10px;
    margin-left: 0;
  }

  .auth-links {
    margin-left: 0;
  }

  .auth-links a {
    font-size: 4vw;
    margin-left: 10px;
  }
}

/* 미디어 쿼리: 더 작은 화면 (모바일) */
@media (max-width: 480px) {
  .header {
    padding: 8px 15px;
  }

  .logo a {
    font-size: 6vw;
  }

  .nav a {
    font-size: 5vw;
  }

  .auth-links a {
    font-size: 5vw;
  }
}
</style>
