<template>
  <div class="repository-management">
    <h1>등록된 레포지토리 내역</h1>

    <div class="header-actions">
      <button class="register-button" @click="openForm">레포지토리 등록</button>
    </div>

    <table>
      <thead>
      <tr>
        <th>No.</th>
        <th>레포지토리 이름</th>
        <th>개발 분야</th>
        <th>레포지토리 URL</th>
        <th>관리</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(repo, index) in repositories" :key="repo.id">
        <td>{{ index + 1 }}</td>
        <td>{{ repo.name }}</td>
        <td>{{ repo.field.join(', ') }}</td> <!-- 배열을 문자열로 출력 -->
        <td><a :href="repo.url" target="_blank">{{ repo.url }}</a></td>
        <td>
          <button @click="editRepo(repo)" class="edit-button">수정</button>
          <button @click="confirmDelete(repo)" class="delete-button">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 레포지토리 등록/수정 모달 -->
    <div v-if="showForm" class="modal">
      <h2>{{ editMode ? '레포지토리 수정' : '레포지토리 등록' }}</h2>
      <form @submit.prevent="saveRepo">
        <div class="form-group">
          <label>깃허브 레포지토리 이름</label>
          <input v-model="form.name" required />
        </div>

        <div class="form-group">
          <label>해당 레포지토리에서의 개발 분야</label>
          <label><input type="checkbox" v-model="form.field" value="FRONTEND" /> FRONTEND</label>
          <label><input type="checkbox" v-model="form.field" value="BACKEND" /> BACKEND</label>
        </div>

        <div class="form-group">
          <label>레포지토리 URL</label>
          <input v-model="form.url" required />
        </div>

        <div class="button-group">
          <button type="submit" class="save-button">{{ editMode ? '수정' : '등록' }}</button>
          <button @click="closeForm" class="cancel-button">취소</button>
        </div>
      </form>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal delete-modal">
      <h2>레포지토리 삭제</h2>
      <p>레포지토리 <strong>{{ currentRepo.name }}</strong>을(를) 삭제하시겠습니까?</p>
      <div class="button-group center">
        <button @click="deleteRepo" class="delete-button">삭제</button>
        <button @click="closeDeleteModal" class="cancel-button">취소</button>
      </div>
    </div>

    <!-- 성공 메시지 모달 -->
    <div v-if="showSuccess" class="success-modal">
      <p>{{ successMessage }}</p>
      <button @click="closeSuccessModal" class="confirm-button">확인</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const repositories = ref([]);
    const showForm = ref(false);
    const showDeleteModal = ref(false);
    const showSuccess = ref(false);
    const successMessage = ref(''); // 성공 메시지 저장
    const editMode = ref(false);
    const form = ref({ name: '', field: [], url: '' });
    const currentRepo = ref(null);
    const userSeq = '사용자_고유_값'; // 실제 사용자 고유값으로 대체해주세요

    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    // 레포지토리 목록 조회
    const fetchRepositories = async () => {
      try {
        const response = await axios.get(`http://localhost:8086/api/v1/user/${userSeq}/GithubRepository`, { headers });
        repositories.value = response.data;
      } catch (error) {
        console.error('레포지토리 목록 불러오기 중 오류 발생:', error);
      }
    };

    // 레포지토리 저장 및 수정
    const saveRepo = async () => {
      try {
        if (editMode.value) {
          // 수정 모드
          await axios.put(`http://localhost:8086/api/v1/user/${userSeq}/githubRepository/${form.value.id}`, form.value, { headers });
          successMessage.value = '레포지토리가 수정되었습니다.';
        } else {
          // 등록 모드
          await axios.post(`http://localhost:8086/api/v1/user/${userSeq}/githubRepository`, form.value, { headers });
          successMessage.value = '레포지토리가 등록되었습니다.';
        }
        showForm.value = false;
        showSuccess.value = true;
        fetchRepositories(); // 수정 및 등록 후 목록 다시 조회
      } catch (error) {
        console.error('레포지토리 저장/수정 중 오류 발생:', error);
      }
    };

    // 레포지토리 삭제
    const deleteRepo = async () => {
      try {
        await axios.delete(`http://localhost:8086/api/v1/user/${userSeq}/githubRepository/${currentRepo.value.id}`, { headers });
        successMessage.value = '레포지토리가 삭제되었습니다.';
        showDeleteModal.value = false;
        showSuccess.value = true;
        fetchRepositories(); // 삭제 후 목록 다시 조회
      } catch (error) {
        console.error('레포지토리 삭제 중 오류 발생:', error);
      }
    };

    // 레포지토리 수정 모드
    const editRepo = (repo) => {
      form.value = { ...repo, field: [...repo.field] }; // 배열 복사
      editMode.value = true;
      showForm.value = true;
    };

    const openForm = () => {
      form.value = { name: '', field: [], url: '' };
      editMode.value = false;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
    };

    const confirmDelete = (repo) => {
      currentRepo.value = repo;
      showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
    };

    const closeSuccessModal = () => {
      showSuccess.value = false;
    };

    onMounted(() => {
      fetchRepositories();
    });

    return {
      repositories,
      showForm,
      showDeleteModal,
      showSuccess,
      successMessage, // 성공 메시지 상태 관리
      editMode,
      form,
      currentRepo,
      openForm,
      closeForm,
      editRepo,
      saveRepo,
      confirmDelete,
      deleteRepo,
      closeDeleteModal,
      closeSuccessModal,
    };
  },
};
</script>

<style scoped>
.repository-management {
  margin: 20px;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

a {
  color: #333;
  text-decoration: none;
}

button {
  padding: 5px 10px;
  margin-right: 5px;
}

.register-button {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button {
  color: blue;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.delete-button {
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.modal {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  width: 500px;
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.delete-modal {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -25%);
  width: 550px;
  background: white;
  padding: 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.success-modal {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 300px;
  background: white;
  padding: 30px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  border-radius: 8px;
  z-index: 1000;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 10px;
  font-weight: bold;
}

.form-group input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.save-button, .confirm-button {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: transparent;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}
</style>
