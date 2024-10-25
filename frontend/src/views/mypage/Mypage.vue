<template>
  <div class="mypage-container" v-if="user">
    <div class="profile-section">
      <h2 class="section-title">내 정보</h2> <!-- 내 정보 제목 추가 -->
      <hr class="section-divider" /> <!-- 구분선 추가 -->
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
      </div>
    </div>

    <div class="details-section">
      <h2 class="section-title">상세 정보</h2>
      <hr class="section-divider" />
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


const getToken = () => localStorage.getItem('authToken');


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
      user.value.userBirthDate = user.value.userBirthDate.split('T')[0];
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    errorMessage.value = '사용자 정보를 불러오는데 실패했습니다.';
  }
};

const saveChanges = async () => {
  try {
    if (user.value.userGender === 'male') {
      user.value.userGender = 'MALE';
    } else if (user.value.userGender === 'female') {
      user.value.userGender = 'FEMALE';
    }

    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(user.value)], { type: 'application/json' })); // JSON 데이터 추가
    if (user.value.profileImg) {
      formData.append('userProfileImg', user.value.profileImg); // 파일 추가
    }

    const token = getToken();
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    await axios.put(`http://localhost:8086/api/v1/user/${userSeq}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    successMessage.value = '사용자 정보가 성공적으로 저장되었습니다.';


    alert('저장되었습니다.');

    router.push('/');
  } catch (error) {
    console.error('Error saving user data:', error);
    errorMessage.value = '사용자 정보를 저장하는데 실패했습니다.';
  } finally {
    loading.value = false;
  }
};


const cancelChanges = () => {
  router.push('/');
};

const deactivateAccount = async () => {
  try {
    const token = getToken();
    await axios.delete(`http://localhost:8086/api/v1/user/${userSeq}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push('/login');
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
    user.value.profileImg = URL.createObjectURL(file);
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
  width: 100%;
}

.profile-section {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.details-section {
  width: 55%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.section-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  width: 100%;
}

.section-divider {
  width: 100%;
  height: 1px;
  background-color: #ddd;
  margin-bottom: 20px;
}

.profile-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
}

.profile-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.image-upload {
  margin-top: 10px;
  width: 250px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  margin-bottom: 40px;
}

.form-group label {
  width: 150px;
  margin-right: 10px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  padding: 8px;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.phone-input,
.major-input,
.github-input {
  width: 300px;
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


</style>