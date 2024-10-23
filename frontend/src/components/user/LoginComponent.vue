<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="no-cursor">T-BUILDING에</h1>
      <h2 class="no-cursor">오신 것을 환영합니다.</h2>

      <div class="login-form">
        <label class="no-cursor" for="username">아이디</label>
        <div class="input-container">
          <input
            id="username"
            type="text"
            placeholder="Username"
          />
          <i class="fas fa-user"></i>
        </div>

        <label class="no-cursor" for="password">비밀번호</label>
        <div class="input-container">
          <input
            id="password"
            type="password"
            placeholder="**********"
          />
          <i class="fas fa-lock"></i>
        </div>

        <button class="login-btn">
          LOGIN
        </button>
      </div>

      <div class="divider no-cursor">OR</div>

      <div class="extra-options">
        <button class="signup-btn no-cursor">회원 가입</button>
        <button class="find-btn no-cursor">ID/PW 찾기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
};
</script>

<style scoped>
/* 전체 화면 중앙 정렬 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a1a;
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

/* 텍스트 선택을 비활성화하는 클래스 */
.no-cursor {
  user-select: none; /* 텍스트를 선택할 수 없게 설정 */
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
