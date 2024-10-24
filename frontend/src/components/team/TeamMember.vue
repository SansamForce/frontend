<script setup>
const props = defineProps({
  teamMemberList: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <strong><p style="float: right;">팀 인원 &nbsp; : &nbsp;  <span class="total-team-count">{{teamMemberList.length}}</span> 명</p></strong>
  <!-- 팀 정보 테이블 -->
  <table class="table table-striped" style="text-align: center">
    <thead>
    <tr >
      <th>번호</th>
      <th>닉네임</th>
      <th>생년월일</th>
      <th>성별</th>
      <th>연락처</th>
      <th>이메일</th>
      <th>깃허브 아이디</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(member, index) in teamMemberList" :key="index">
      <td>{{ index + 1 }}</td>
      <td>{{ member.userNickname }}</td>
      <td>{{ member.userBirthDate }}</td>
      <td>{{ member.userGender === 'MALE' ? '남자' : '여자' }}</td>
      <td>{{ member.phone }}</td>
      <td>{{ member.email }}</td>
      <td>{{ member.userGithubId }}</td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

.total-team-count {
  color: #171D8A;
  font-weight: bold;
}

</style>