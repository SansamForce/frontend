<template>
  <div class="signup-container">
    <div class="signup-box">
      <h1 class="signup-title">T-BUILDING에</h1>
      <h2 class="signup-subtitle">오신것을 환영합니다.</h2>
      
      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <label for="id">아이디</label>
          <div class="input-group">
            <input id="id" v-model="id" type="text" placeholder="아이디" />
            <button @click.prevent="checkId">중복 확인</button>
          </div>
          <p class="input-message">{{ idMessage }}</p>
        </div>
        
        <div class="form-group">
          <label for="pw">비밀번호</label>
          <input id="pw" v-model="pw" type="password" placeholder="비밀번호" />
        </div>

        <div class="form-group">
          <label for="pwConfirm">비밀번호 확인</label>
          <input id="pwConfirm" v-model="pwConfirm" type="password" placeholder="비밀번호 확인" />
          <p v-if="pwError" class="input-message error">{{ pwError }}</p>
        </div>

        <div class="form-group">
          <label for="email">이메일</label>
          <input id="email" v-model="email" type="email" placeholder="이메일" />
        </div>

        <div class="form-group">
          <label for="name">이름</label>
          <input id="name" v-model="name" type="text" placeholder="이름" />
        </div>

        <div class="form-group">
          <label for="phone">전화번호</label>
          <input id="phone" v-model="phone" type="text" placeholder="전화번호" />
        </div>

        <button type="submit" class="submit-btn">시작하기</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const id = ref('');
const pw = ref('');
const pwConfirm = ref('');
const email = ref('');
const name = ref('');
const phone = ref('');

const idMessage = ref(''); // 아이디 중복 체크 메시지
const pwError = ref(''); // 비밀번호 불일치 오류 메시지

const handleSignup = () => {
  if (pw.value !== pwConfirm.value) {
    pwError.value = '비밀번호가 일치하지 않습니다.';
    return;
  }

  // 회원가입 처리 로직 (API 요청 등)
  console.log('회원가입 처리', { id: id.value, pw: pw.value, email: email.value, name: name.value, phone: phone.value });
};

const checkId = () => {
  // 아이디 중복 확인 로직
  idMessage.value = '사용 가능한 아이디입니다.'; // 예시 메시지
};
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 화면 전체 높이를 차지 */
  background-color: #1a1a1a; /* 전체 배경색을 적용 */
  padding-top: 50px; /* 상단에 여백 추가 */
}

.signup-box {
  background-color: #333;
  padding: 40px;
  border-radius: 10px;
  width: 500px; /* 박스의 너비를 넓게 설정 */
  text-align: center;
}

.signup-title {
  color: #3FF3FF;
  font-size: 36px;
  margin-bottom: 10px;
}

.signup-subtitle {
  color: #fff;
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  color: #ccc;
  font-size: 16px;
  display: block;
  margin-bottom: 5px;
}

.input-group {
  display: flex;
}

.input-group input {
  flex: 1;
  padding: 10px;
  border-top-left-radius: 4px; /* 왼쪽 라운드 */
  border-bottom-left-radius: 4px; /* 왼쪽 라운드 */
  border: none;
  margin-right: 10px; /* 아이디 입력과 중복 확인 버튼 사이에 여백 추가 */
}

.input-group button {
  padding: 10px;
  background-color: #00cccc;
  color: #fff;
  border-top-right-radius: 4px; /* 오른쪽 라운드 */
  border-bottom-right-radius: 4px; /* 오른쪽 라운드 */
  border: none;
  cursor: pointer;
}

.input-group button:hover {
  background-color: #00b3b3;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #00cccc;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
}

.submit-btn:hover {
  background-color: #00b3b3;
}

.input-message {
  margin-top: 5px;
  color: #3FF3FF;
  font-size: 12px;
}

.error {
  color: red;
}
</style>
