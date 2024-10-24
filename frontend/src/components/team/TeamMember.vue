<script setup>
const props = defineProps({
  teamMemberList: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <p><strong>팀 인원:</strong> {{teamMemberList.length}}명</p>
  <!-- 팀 정보 테이블 -->
  <table class="table table-striped">
    <thead>
    <tr>
      <th>No</th>
      <th>닉네임</th>
      <th>생년월일</th>
      <th>성별</th>
      <th>깃허브 아이디</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(member, index) in teamMemberList" :key="index">
      <td>{{ index + 1 }}</td>
      <td>{{ member.userNickname }}</td>
      <td>{{ member.userBirthDate }}</td>
      <td>{{ member.userGender }}</td>
      <td>{{ member.userGithubId }}</td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>