<script setup>
const props = defineProps({
  projectMemberList: {
    type: Array,
    required: true
  }
});

</script>

<template>
  <strong><p style="float: right;">총 인원 &nbsp; : &nbsp;  <span class="total-team-count">{{projectMemberList.length}}</span> 명</p></strong>
  <!-- 팀 정보 테이블 -->
  <table class="table table-striped" style="text-align: center">
    <thead>
    <tr >
      <th>번호</th>
      <th>이름</th>
      <th>상태</th>
      <th>분류</th>
      <th>전공 여부</th>
      <th>관심 분야</th>
      <th>깃허브 커밋 점수</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(member, index) in projectMemberList" :key="index">
      <td>{{ index + 1 }}</td>
      <td>{{ member.userName }}</td>
      <td>
        <b-badge :variant="member.projectMemberDelYn === 'Y' ? 'gray' : 'primary'">
          {{ member.projectMemberDelYn === 'Y' ? '탈퇴' : '참여중' }}
        </b-badge>
      </td>
      <td>
        <b-badge :variant="member.projectMentorYn === 'Y' ? 'danger' : 'black'">
          {{ member.projectMentorYn === 'Y' ? '멘토' : '회원' }}
        </b-badge>
      </td>

      <td>{{ member.userMajorYn}}</td>
      <td>
        <b-badge :variant="member.projectMemberDevelopType === 'FRONTEND' ? 'primary' : 'danger'">
          {{ member.projectMemberDevelopType }}
        </b-badge>
      </td>
      <td>{{ member.projectMemberCommitScore }}</td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

b-badge.primary {
  background-color: #007bff;
}

b-badge.gray {
  background-color: #6c757d;
}

b-badge.danger {
  background-color: #dc3545;
}

b-badge.black {
  background-color: #222222;
}

b-icon-question-circle {
  cursor: pointer;
}
</style>