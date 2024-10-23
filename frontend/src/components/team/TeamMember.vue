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
  <b-table :items="teamMemberList" :fields="fields"></b-table>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        { key: 'teamMemberSeq', label: 'No' },
        { key: 'userNickname', label: '닉네임' },
        { key: 'userBirthDate', label: '생년월일' },
        { key: 'userGender', label: '성별' },
        { key: 'userGithubId', label: '깃허브 아이디' }
      ]
    }
  }
}
</script>
<style scoped>

</style>