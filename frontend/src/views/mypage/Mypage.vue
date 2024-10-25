<template>
  <div class="mypage-container" v-if="user">
    <div class="profile-section">
      <div class="profile-image-container">
        <img :src="user.profileImg || defaultImage" alt="profile" class="profile-img" />
        <input type="file" @change="onImageUpload" class="image-upload" />
      </div>
      <div class="profile-info">
        <div class="info-item">
          <strong class="label">이름:</strong>
          <span class="value">{{ user.userName || '정보 없음' }}</span>
        </div>
        <div class="info-item">
          <strong class="label">아이디:</strong>
          <span class="value">{{ user.userId || '정보 없음' }}</span>
        </div>
        <div class="info-item">
          <strong class="label">닉네임:</strong>
          <input type="text" v-model="user.userNickname" class="input-field" />
        </div>
        <div class="info-item">
          <strong class="label">이메일:</strong>
          <input type="email" v-model="user.userEmail" class="input-field" />
        </div>
        <button @click="deactivateAccount" class="icon-button delete-button">회원 탈퇴</button>
      </div>
    </div>

    <div class="details-section">
      <p>가입일: {{ user.regDate }}</p>
      <div class="form-group">
        <label>전화번호:</label>
        <input type="text" v-model="user.userPhone" class="phone-input" />
      </div>

      <div class="form-group">
        <label>생년월일:</label>
        <input type="date" v-model="user.userBirthDate" class="date-input" placeholder="생년월일 입력" />
      </div>

      <div class="form-group">
        <label>성별:</label>
        <select v-model="user.userGender" class="gender-select">
          <option value="male">남</option>
          <option value="female">여</option>
        </select>
      </div>

      <div class="form-group">
        <label>학과:</label>
        <input type="text" v-model="user.userMajor" class="major-input" placeholder="학과 입력" />
      </div>

      <div class="form-group github-group">
        <label>깃허브 아이디:</label>
        <input type="text" v-model="user.userGithubId" class="github-input" placeholder="깃허브 아이디" />
        <button @click="navigateToRepoManagement" class="icon-button save-button">깃허브 레포지토리 관리</button>
      </div>

      <div class="form-group">
        <button @click="navigateToReviewHistory" class="icon-button save-button review-button">리뷰 내역 보기</button>
      </div>
    </div>

    <div class="fixed-actions">
      <button @click="saveChanges" class="icon-button save-button">저장</button>
      <button @click="cancelChanges" class="icon-button cancel-button">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';
import axios from 'axios';

const router = useRouter();
const userStore = useUserStore();
const userSeq = userStore.user.id;
const user = ref({
  nickname: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  department: '',
  githubId: '',
  profileImg: ''
});
const defaultImage = '';
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// 인증 토큰 가져오기
const getToken = () => localStorage.getItem('authToken');

// 사용자 데이터 가져오기
const fetchUserData = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`http://localhost:8086/api/v1/user/${userSeq}/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = response.data.data;
    if (userData.userGender === 'MALE') {
      userData.userGender = 'male';
    } else if (userData.userGender === 'FEMALE') {
      userData.userGender = 'female';
    }

    user.value = userData;
    if (user.value.userBirthDate) {
      user.value.userBirthDate = user.value.userBirthDate.split('T')[0]; // 날짜 형식 변환
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    errorMessage.value = '사용자 정보를 불러오는데 실패했습니다.';
  }
};

// 사용자 정보 저장
const saveChanges = async () => {
  try {
    if (user.value.userGender === 'male') {
      user.value.userGender = 'MALE';
    } else if (user.value.userGender === 'female') {
      user.value.userGender = 'FEMALE';
    }

    const token = getToken();
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    await axios.put(`http://localhost:8086/api/v1/user/${userSeq}`, user.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    successMessage.value = '사용자 정보가 성공적으로 저장되었습니다.';
    router.push('/');
  } catch (error) {
    console.error('Error saving user data:', error);
    errorMessage.value = '사용자 정보를 저장하는데 실패했습니다.';
  } finally {
    loading.value = false;
  }
};


const deactivateAccount = async () => {
  try {
    const token = getToken();
    await axios.delete(`http://localhost:8086/api/v1/user/${userSeq}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push('/login'); // 회원 탈퇴 후 로그인 페이지로 이동
  } catch (error) {
    console.error('Error deactivating account:', error);
    errorMessage.value = '회원 탈퇴에 실패했습니다.';
  }
};

// 깃허브 레포지토리 관리 페이지로 이동
const navigateToRepoManagement = () => {
  router.push({ name: 'RepositoryManagement' });
};

// 이미지 업로드 처리
const onImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    user.value.profileImg = URL.createObjectURL(file); // 업로드된 이미지 미리보기
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.mypage-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin-left: 150px;
  margin-top: 70px;
}

.profile-section {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
  object-fit: cover;
}

.profile-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.image-upload {
  margin-top: 20px;
  width: 150px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.label {
  font-weight: bold;
  width: 80px;
}

.input-field {
  width: 250px;
  height: 35px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.details-section {
  width: 55%;
  padding-left: 40px;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-group label {
  width: 150px;
  margin-right: 10px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  padding: 8px;
  width: 200px; /* 입력 필드 너비 */
  border: 1px solid #ccc;
  border-radius: 4px;
}

.phone-input,
.major-input,
.github-input {
  width: 300px; /* 입력 필드의 너비를 조금 더 넓힘 */
}

.date-input {
  width: 180px;
}

.gender-select {
  width: 100px;
  padding: 8px;
}

.github-group {
  display: flex;
  align-items: center;
}

.github-group button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.review-button {
  margin-top: 20px;
}

.fixed-actions {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  justify-content: flex-end;
}

.fixed-actions button {
  margin-left: 15px;
}

.icon-button {
  background-color: #333;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
}

.save-button {
  background-color: #222222;
}

.cancel-button {
  background-color: #dddddd;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 150px;
}

.delete-button {
  background-color: #dddddd;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 5px;
  width: 150px;
  height: 35px;
}
</style>