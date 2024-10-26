<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="no-cursor">T-BUILDING에</h1>
      <h2 class="no-cursor">오신 것을 환영합니다.</h2>

      <form @submit.prevent="handleLogin">
        <div class="login-form">
          <label class="no-cursor" for="id">아이디</label>
          <div class="input-container">
            <input
              id="id"
              type="text"
              v-model="id"
              placeholder="ID"
            />
            <i class="fas fa-user"></i>
          </div>

          <label class="no-cursor" for="pw">비밀번호</label>
          <div class="input-container">
            <input
              id="pw"
              type="password"
              v-model="pwd"
              placeholder="**********"
            />
            <i class="fas fa-lock"></i>
          </div>

          <button type="submit" class="login-btn">
            LOGIN
          </button>
        </div>
      </form>

      <!-- 로그인 실패 시 오류 메시지 표시 -->
      <div v-if="userStore.error" class="error-message">
        {{ userStore.error }}
      </div>

      <div class="divider no-cursor">OR</div>

      <div class="extra-options">
        <button class="signup-btn no-cursor">회원 가입</button>
        <button class="find-btn no-cursor">ID/PW 찾기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router'; // Vue Router 사용

const id = ref(''); // 아이디 입력값
const pwd = ref(''); // 비밀번호 입력값
const userStore = useUserStore();
const router = useRouter(); // useRouter로 라우터 객체 사용

const handleLogin = async () => {
  await userStore.login(id.value, pwd.value); // Pinia의 로그인 액션 호출
  if (userStore.isAuthenticated) {
    // 로그인 성공 시 메인 페이지로 이동
    router.push('/');
  } else {
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

/* 배경색을 화면 전체에 적용 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 화면 전체 높이를 차지 */
  background-color: #1a1a1a; /* 전체 배경색 적용 */
  padding-top: 50px; /* 상단에 여백 추가 */
  
}

.login-box {
  background-color: #333;
  padding: 60px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  width: 500px;
  text-align: center;
}

.login-box h1 {
  color: #3FF3FF;
  font-size: 42px;
  margin-bottom: 20px;
}

.login-box h2 {
  color: #fff;
  font-size: 24px;
  margin-bottom: 40px;
}

.no-cursor {
  user-select: none;
}

.login-form label {
  display: block;
  color: #ccc;
  font-size: 18px;
  margin-bottom: 10px;
}

.input-container {
  position: relative;
  margin-bottom: 30px;
}

.input-container input {
  width: 100%;
  padding: 15px 50px 15px 15px;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  background-color: #e0e0e0;
}

.input-container i {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background-color: #00cccc;
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover {
  background-color: #00b3b3;
}

.divider {
  margin-top: 30px;
  margin-bottom: 30px;
  color: #ccc;
  font-size: 18px;
}

.extra-options {
  display: flex;
  justify-content: space-between;
}

.signup-btn, .find-btn {
  background: none;
  border: none;
  color: #3FF3FF;
  font-size: 18px;
  text-decoration: underline;
}
</style>
