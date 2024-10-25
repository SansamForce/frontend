<template>
  <div class="user-detail" v-if="user">
    <button class="icon-button cancel-button" @click="$router.push('/member')">목록으로 돌아가기</button>

    <!-- 전체 레이아웃을 나누는 컨테이너 -->
    <div class="user-info-container">
      <!-- 좌측 패널 -->
      <div class="left-panel">
        <h3 class="section-title">회원 정보</h3>
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
          <select v-model="user.userStatus" class="status-input">
            <option value="ACTIVE">활동중</option>
            <option value="BAN">정지</option>
            <option value="DELETE">탈퇴</option>
          </select>
        </p>
      </div>

      <!-- 중앙에 공간을 주기 위한 공간 -->
      <div class="center-space"></div>

      <!-- 우측 패널 -->
      <div class="right-panel">
        <h3 class="section-title">상세 정보</h3>
        <p class="form-group"><strong>가입일</strong> <span>{{ user.regDate || '정보 없음' }}</span></p>
        <p class="form-group"><strong>전화번호</strong><input type="text" v-model="user.userPhone" placeholder="전화번호를 입력하세요" class="phone-input" /></p>
        <p class="form-group"><strong>생년월일</strong><input type="date" v-model="user.userBirthDate" class="date-input" /></p>
        <p class="form-group"><strong>성별</strong>
          <select v-model="user.userGender" class="gender-select">
            <option value="FEMALE">여</option>
            <option value="MALE">남</option>
          </select>
        </p>
        <p class="form-group"><strong>전공</strong><input type="text" v-model="user.userMajor" placeholder="전공을 입력하세요" class="major-input" /></p>
        <p class="form-group"><strong>경력 일수</strong><input type="text" v-model="user.userCareerYears" placeholder="경력 일수를 입력하세요" class="experience-input" /></p>
        <p class="form-group"><strong>깃허브 아이디</strong><input type="text" v-model="user.userGithubId" placeholder="깃허브 아이디를 입력하세요" class="github-input" /></p>
      </div>
    </div>

    <!-- 저장 및 취소 버튼 -->
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

    console.log('보내는 데이터:', JSON.stringify(user.value));

    await axios.put(`http://localhost:8086/api/v1/admin/user/${userSeq}`, user.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    successMessage.value = '사용자 정보가 성공적으로 저장되었습니다.';
    router.push('/member');
  } catch (error) {
    console.error('사용자 정보를 저장하는 도중 에러가 발생했습니다.', error);
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = `저장 실패: ${error.response.data.message}`;
    } else {
      errorMessage.value = '사용자 정보를 저장하는데 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (userSeq) {
    fetchUser(userSeq);
  } else {
    errorMessage.value = 'userSeq가 존재하지 않습니다.';
  }
});
</script>

<style scoped>
.user-info-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.left-panel, .right-panel {
  width: 45%; /* 좌우 패널의 너비 조정 */
}

.center-space {
  width: 4px; /* 선의 두께를 더 두껍게 설정 */
  background-color: #ffffff; /* 흰색 선 */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* 약간의 그림자 추가 */
  height: 100%; /* 전체 높이 적용 */
}

.profile-container {
  text-align: center;
  margin-bottom: 20px;
}

.profile-img-square {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.form-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.form-group strong {
  width: 120px;
  font-size: 16px;
  color: #333;
}

input, select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.icon-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 16px;
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.icon-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
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
