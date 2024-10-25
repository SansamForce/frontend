<template>
  <header class="header">
    <div class="logo">
      <h1><router-link to="/">T-BUILDING</router-link></h1>
    </div>
    <nav class="nav">
      <template v-if="userStore.isAuthenticated">
        
        <template v-if="userStore.auth === 'MEMBER' || userStore.auth === 'MENTOR'">

          <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
            <router-link to="/projectBoards" class="dropdown-toggle hover-text">BOARD</router-link>
            <div v-if="dropdownVisible" class="dropdown-content">
              <router-link to="/projectboards" class="hover-bg">모집중인 프로젝트</router-link>
              <router-link to="/projectboards/apply" class="hover-bg">신청한 프로젝트</router-link>
            </div>
          </div>
          
          <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
            <router-link to="/projects" class="dropdown-toggle hover-text">PROJECT</router-link>
            <div v-if="dropdownVisible" class="dropdown-content">
              <router-link to="/projects" class="hover-bg">내 프로젝트</router-link>
            </div>
          </div>

          <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
            <router-link to="/mypage" class="dropdown-toggle hover-text">MYPAGE</router-link>
            <div v-if="dropdownVisible" class="dropdown-content">
              <router-link to="/mypage" class="hover-bg">내 정보</router-link>
              <router-link to="/review" class="hover-bg">평가 내역 보기</router-link>
            </div>
          </div>
          
          <router-link to="/logout" @click.prevent="logout" class="hover-text">LOGOUT</router-link>
        </template>

        <!-- 관리자 또는 부관리자일 때 -->
        <template v-if="userStore.auth === 'MANAGER' || userStore.auth === 'SUB_MANAGER'">
          <router-link to="/projectBoards" class="hover-text">BOARD</router-link>
          <router-link to="/projects" class="hover-text">PROJECT</router-link>
          <router-link to="/member" class="hover-text">MEMBER</router-link>
          <router-link to="/logout" @click.prevent="logout" class="hover-text">LOGOUT</router-link>
        </template>
      </template>

      <!-- 비로그인 상태일 때 -->
      <template v-else>
        <div class="auth-links">
          <router-link to="/login" class="hover-text">Login</router-link>
          <router-link to="/signup" class="hover-text">Sign Up</router-link>
        </div>
      </template>
    </nav>
  </header>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const dropdownVisible = ref(false);

const showDropdown = () => {
  dropdownVisible.value = true;
};

const hideDropdown = () => {
  dropdownVisible.value = false;
};

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
  width: 50%; /* nav 너비를 50%로 설정 */
}

.nav a {
  font-size: 1.8vw;
  color: #fff;
  text-decoration: none;
  margin-right: 30px; /* 링크 간 간격을 30px로 설정 */
}

.nav a:hover {
  color: #3FF3FF;
}

/* 드롭다운 메뉴 */
.dropdown {
  position: relative;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f0f0f0;
  min-width: 160px;
  width: 100%;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  color: #000;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-size: 1vw;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid #eee;
}

.dropdown-content a:last-child {
  border-bottom: none;
}

.dropdown-content a:hover {
  background-color: #3FF3FF;
  color: #000;
}

/* 로그인 및 회원가입 버튼을 오른쪽에 배치 */
.auth-links {
  display: flex;
  gap: 30px; /* 로그인 및 회원가입 간격 설정 */
}

.auth-links a {
  font-size: 1.8vw;
  color: #fff;
  text-decoration: none;
}

.auth-links a:hover {
  color: #3FF3FF;
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
