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
/* 스타일 코드는 그대로 유지하였습니다 */
</style>
