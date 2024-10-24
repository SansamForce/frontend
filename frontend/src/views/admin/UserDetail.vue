<template>
  <div class="user-detail" v-if="user">
    <button class="icon-button cancel-button" @click="$router.push('/member')">목록으로 돌아가기</button>
    <div class="user-info">
      <div class="left-panel">
        <h3>회원 정보</h3>
        <div class="profile-container">
          <img :src="user.userProfileImg || defaultImage" alt="Profile Image" class="profile-img-square" />
        </div>
        <p class="form-group"><strong>이름</strong> <span>{{ user.userName || '정보 없음' }}</span></p>
        <p class="form-group"><strong>아이디</strong> <span>{{ user.userId || '정보 없음' }}</span></p>
        <p class="form-group"><strong>닉네임</strong> <span>{{ user.userNickname || '정보 없음' }}</span></p>
        <p class="form-group">
          <strong>이메일</strong>
          <input type="email" v-model="user.userEmail" placeholder="이메일을 입력하세요" class="email-input" />
        </p>
        <p class="form-group">
          <strong>회원 유형</strong>
          <select v-model="user.userAuth" class="type-input">
            <option value="MEMBER">일반 회원</option>
            <option value="MANAGER">관리자</option>
          </select>
        </p>
        <p class="form-group">
          <strong>상태</strong>
          <!-- 서버에서 허용하는 상태 값으로 수정 -->
          <select v-model="user.userStatus" class="status-input">
            <option value="ACTIVE">활동중</option>
            <option value="BAN">정지</option> <!-- SUSPENDED 대신 BAN 사용 -->
            <option value="DELETE">탈퇴</option>
          </select>
        </p>
      </div>

      <div class="right-panel">
        <h3>상세 정보</h3>
        <div class="form-group"><strong>가입일</strong> <span>{{ user.regDate || '정보 없음' }}</span></div>
        <div class="form-group"><strong>전화번호</strong><input type="text" v-model="user.userPhone" placeholder="전화번호를 입력하세요" class="phone-input" /></div>
        <div class="form-group"><strong>생년월일</strong><input type="date" v-model="user.userBirthDate" class="date-input" /></div>
        <div class="form-group"><strong>성별</strong><select v-model="user.userGender" class="gender-select"><option value="FEMALE">여</option><option value="MALE">남</option></select></div>
        <div class="form-group"><strong>전공</strong><input type="text" v-model="user.userMajor" placeholder="전공을 입력하세요" class="major-input" /></div>
        <div class="form-group"><strong>경력 일수</strong><input type="text" v-model="user.userCareerYears" placeholder="경력 일수를 입력하세요" class="experience-input" /></div>
        <div class="form-group"><strong>깃허브 아이디</strong><input type="text" v-model="user.userGithubId" placeholder="깃허브 아이디를 입력하세요" class="github-input" /></div>
      </div>
    </div>

    <div class="buttons">
      <button class="icon-button save-button" @click="saveUser" :disabled="loading">
        <span v-if="!loading">저장</span>
        <span v-else>저장 중...</span>
      </button>
      <button class="icon-button cancel-button" @click="$router.push('/member')">취소</button>
    </div>

    <!-- 성공 및 실패 메시지 표시 -->
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
  <div v-else>정보 없음</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// 변수 초기화
const user = ref(null);
const router = useRouter();
const defaultImage = '/src/assets/기본화면.png'; // 기본 프로필 이미지
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// 라우트에서 userSeq 파라미터 받아오기
const route = useRoute();
const userSeq = route.params.userSeq;

console.log('userSeq:', userSeq); // userSeq 값 확인

// 사용자 정보 조회
const fetchUser = async (userSeq) => {
  try {
    const response = await axios.get(`http://localhost:8086/api/v1/admin/user/${userSeq}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    user.value = response.data.data; // API에서 받은 데이터 설정
  } catch (error) {
    console.error('사용자 정보를 불러오는 도중 에러가 발생했습니다.', error);
    errorMessage.value = '사용자 정보를 불러오는데 실패했습니다.';
  }
};

// 사용자 정보 저장
const saveUser = async () => {
  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    // 데이터 전송 전 로그 출력 (디버깅용)
    console.log('보내는 데이터:', JSON.stringify(user.value));

    await axios.put(`http://localhost:8086/api/v1/admin/user/${userSeq}`, user.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    successMessage.value = '사용자 정보가 성공적으로 저장되었습니다.';
    router.push('/member'); // 저장 후 목록으로 이동
  } catch (error) {
    console.error('사용자 정보를 저장하는 도중 에러가 발생했습니다.', error);
    // 오류 메시지를 명확히 출력
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = `저장 실패: ${error.response.data.message}`;
    } else {
      errorMessage.value = '사용자 정보를 저장하는데 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
};

// 컴포넌트 마운트 시 사용자 정보 조회
onMounted(() => {
  if (userSeq) {
    fetchUser(userSeq); // userSeq가 있을 때만 호출
  } else {
    errorMessage.value = 'userSeq가 존재하지 않습니다.';
  }
});
</script>

<style scoped>
/* 스타일 그대로 유지 */
.user-detail {
  padding: 20px;
}
.user-info {
  display: flex;
  justify-content: space-between;
}
.left-panel, .right-panel {
  width: 50%;
}
.right-panel .form-group {
  margin-bottom: 25px;
}

.profile-container {
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
}

.profile-img-square {
  width: 300px;
  height: 300px;
  border-radius: 5px;
  object-fit: cover;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.form-group strong {
  width: 150px;
}

.type-input,
.status-input,
.phone-input,
.major-input,
.experience-input,
.github-input,
.email-input,
.date-input {
  padding: 10px;
}

.gender-select {
  padding: 10px;
  width: 70px;
}

.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.icon-button {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 10px;
}

.save-button {
  background-color: #222222;
}

.cancel-button {
  background-color: #dddddd;
}

.success-message {
  color: green;
  margin-top: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
