<template>
  <div class="user-list">
    <div class="header">
      <h2>전체 사용자 목록</h2>
      <div class="search-bar">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="아이디로 검색"
            @input="filterUsers"
            class="search-input"
        />
      </div>
    </div>
    <p>전체 사용자 {{ filteredUsers.length }}명</p>
    <table class="table">
      <thead>
      <tr>
        <th>No.</th>
        <th>이름</th>
        <th>아이디</th>
        <th>닉네임</th>
        <th>회원 유형</th>
        <th>상태</th>
        <th>가입일</th>
        <th>이메일</th>
        <th>핸드폰 번호</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(user, index) in paginatedUsers" :key="user.userSeq">
        <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
        <td>
          <router-link :to="`/user/${user.userSeq}`" class="name-link">
            {{ user.userName }}
          </router-link>
        </td>
        <td>{{ user.userId }}</td>
        <td>{{ user.userNickname }}</td>
        <td :class="user.userAuth === '관리자' ? 'role-admin' : ''">{{ user.userAuth }}</td>
        <td :class="user.userStatus === '정지' ? 'status-red' : user.userStatus === '탈퇴' ? 'status-gray' : 'status-blue'">
          {{ user.userStatus }}
        </td>
        <td>{{ user.regDate }}</td>
        <td>{{ user.userEmail }}</td>
        <td>{{ user.userPhone ? user.userPhone : '없음' }}</td>
      </tr>
      </tbody>
    </table>
    <pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="fetchUsers"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Pagination from '@/components/common/Pagination.vue';
import axios from 'axios';

const searchQuery = ref('');
const users = ref([]);
const filteredUsers = ref([]);
const currentPage = ref(1);
const itemsPerPage = 15;

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

const fetchUsers = async (page = 1) => {
  try {
    currentPage.value = page;
    const response = await axios.get('http://localhost:8086/api/v1/admin/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    users.value = response.data.data;
    filteredUsers.value = users.value;
  } catch (error) {
    console.error('사용자 목록을 불러오는 도중 에러가 발생했습니다.', error);
  }
};

const filterUsers = () => {
  const query = searchQuery.value.toLowerCase();
  filteredUsers.value = users.value.filter(
      (user) =>
          user.userId.toLowerCase().includes(query) ||
          user.userName.toLowerCase().includes(query)
  );
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-list {
  width: 100%;
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.search-input {
  width: 200px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
}

.name-link {
  color: purple;
  text-decoration: none;
}

.name-link:hover {
  text-decoration: underline;
}

.status-blue {
  color: blue;
}

.status-red {
  color: red;
}

.status-gray {
  color: gray;
}

.role-admin {
  color: red;
  font-weight: bold;
}
</style>
