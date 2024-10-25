<template>
  <div class="repository-management">
    <h1>등록된 레포지토리 내역</h1>

    <div class="header-actions">
      <button class="register-button" @click="openForm">레포지토리 등록</button>
    </div>

    <table class="repository-table">
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
        <td>{{ repo.field.join(', ') }}</td>
        <td><a :href="repo.url" target="_blank">{{ repo.url }}</a></td>
        <td>
          <button @click="editRepo(repo)" class="edit-button">수정</button>
          <button @click="confirmDelete(repo)" class="delete-button">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 레포지토리 등록/수정 모달 -->
    <div v-if="showForm" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ editMode ? '레포지토리 수정' : '레포지토리 등록' }}</h2>
        <form @submit.prevent="submitRepo">
          <div class="form-group">
            <label>깃허브 레포지토리 이름</label>
            <input v-model="form.name" class="input-field" required />
          </div>

          <div class="form-group">
            <label>해당 레포지토리에서의 개발 분야</label>
            <div class="checkbox-group">
              <label><input type="checkbox" v-model="form.field" value="FRONTEND" /> FRONTEND</label>
              <label><input type="checkbox" v-model="form.field" value="BACKEND" /> BACKEND</label>
            </div>
          </div>

          <div class="form-group">
            <label>레포지토리 URL</label>
            <input v-model="form.url" class="input-field" required />
          </div>

          <div class="modal-buttons">
            <button type="submit" class="save-button">{{ editMode ? '수정' : '등록' }}</button>
            <button @click="closeForm" class="cancel-button">취소</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h2>레포지토리 삭제</h2>
        <p><strong>{{ currentRepo.field.join(', ') }}</strong> 분야의 <strong>{{ currentRepo.name }}</strong> 레포지토리를 삭제하시겠습니까?</p>
        <div class="button-group">
          <button @click="closeDeleteModal" class="cancel-button">취소</button>
          <button @click="deleteRepo" class="delete-button">삭제</button>
        </div>
      </div>
    </div>

    <!-- 성공 메시지 모달 -->
    <div v-if="showSuccess" class="modal-overlay">
      <div class="modal-content success-modal">
        <p>{{ successMessage }}</p>
        <button @click="closeSuccessModal" class="confirm-button">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/UserStore';

export default {
  setup() {
    const repositories = ref([]);
    const showForm = ref(false);
    const showDeleteModal = ref(false);
    const showSuccess = ref(false);
    const successMessage = ref('');
    const editMode = ref(false);
    const form = ref({ name: '', field: [], url: '' });
    const currentRepo = ref(null);

    const userStore = useUserStore();
    const userSeq = userStore.user ? userStore.user.id : null;
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchRepositories = async () => {
      try {
        if (userSeq) {
          const response = await axios.get(`http://localhost:8086/api/v1/user/${userSeq}/GithubRepository`, { headers });
          repositories.value = response.data.data.map(repo => ({
            id: repo.userGithubRepositorySeq,
            name: repo.userRepositoryName,
            field: Array.isArray(repo.developType) ? repo.developType : [repo.developType],
            url: repo.userRepositoryUrl,
          }));
        }
      } catch (error) {
        console.error('레포지토리 목록 불러오기 중 오류 발생:', error);
      }
    };

    const openForm = () => {
      form.value = { name: '', field: [], url: '' };
      editMode.value = false;
      showForm.value = true;
    };

    const closeForm = () => {
      showForm.value = false;
    };

    const editRepo = (repo) => {
      form.value = { ...repo, field: [...repo.field] };
      currentRepo.value = repo;
      editMode.value = true;
      showForm.value = true;
    };

    const submitRepo = async () => {
      try {
        if (editMode.value) {
          await axios.post(`http://localhost:8086/api/v1/user/${userSeq}/githubRepository/${currentRepo.value.id}`, {
            name: form.value.name,
            field: form.value.field,
            url: form.value.url,
          }, { headers });
          successMessage.value = '레포지토리가 수정되었습니다.';
        } else {
          await axios.post(`http://localhost:8086/api/v1/user/${userSeq}/githubRepository`, {
            name: form.value.name,
            field: form.value.field,
            url: form.value.url,
          }, { headers });
          successMessage.value = '레포지토리가 등록되었습니다.';
        }
        showForm.value = false;
        showSuccess.value = true;
        fetchRepositories();
      } catch (error) {
        console.error('레포지토리 등록/수정 중 오류 발생:', error);
      }
    };

    const deleteRepo = async () => {
      try {
        if (currentRepo.value && userSeq) {
          await axios.delete(`http://localhost:8086/api/v1/user/${userSeq}/githubRepository/${currentRepo.value.id}`, { headers });
          successMessage.value = '레포지토리가 삭제되었습니다.';
          showDeleteModal.value = false;
          showSuccess.value = true;
          fetchRepositories();
        }
      } catch (error) {
        console.error('레포지토리 삭제 중 오류 발생:', error);
      }
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

    fetchRepositories();

    return {
      repositories,
      showForm,
      showDeleteModal,
      showSuccess,
      successMessage,
      editMode,
      form,
      currentRepo,
      openForm,
      closeForm,
      editRepo,
      submitRepo,
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
  padding: 20px;
  background-color: #f9f9f9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: center;
  vertical-align: middle;
}

th {
  background-color: #343a40;
  color: white;
  text-transform: uppercase;
}

td a {
  color: #007bff;
  text-decoration: none;
}

td a:hover {
  text-decoration: underline;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.register-button {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #555;
}

.edit-button, .delete-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-right: 5px;
  cursor: pointer;
  border-radius: 4px;
}

.delete-button {
  background-color: #dc3545;
  padding: 10px 20px;
}

.edit-button:hover {
  background-color: #218838;
}

.delete-button:hover {
  background-color: #c82333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 화면 상단에 가깝게 정렬 */
  padding-top: 100px; /* 화면 상단에서의 간격 */
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-content h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.input-field {
  width: calc(100% - 20px);
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.save-button {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-right: 10px;
}

.cancel-button {
  background-color: #ddd;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
