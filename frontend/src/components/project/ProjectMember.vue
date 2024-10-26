<script setup>
import {ref} from "vue";

const props = defineProps({
  projectMemberList: {
    type: Array,
    required: true
  }
});

const showTooltip = ref(false);

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;

}
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
      <th class="commit-score">
          깃허브 커밋 점수<button @click="toggleTooltip" class="info-button">ℹ️</button>
          <div v-if="showTooltip" class="tooltip">
            <p><strong>깃허브 커밋 점수?</strong></p>
            <p>회원이 등록한 깃허브 레포지토리에 대해 커밋 이력을 분석해 분야별로 점수를 매깁니다. 팀 빌딩 후 점수를 조회할 수 있습니다.</p>
            <button @click="toggleTooltip" class="close-button">✖️</button>
          </div>
      </th>
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

      <td>{{ member.userMajorYn === 'Y' ? "전공자" : "비전공자"}}</td>
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

.commit-score {
  position: relative; /* 부모 요소에 상대 위치 설정 */
  overflow: visible;  /* 필요 시 추가 */
}

.info-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}

.tooltip {
  position: absolute;
  top: 30px; /* Adjust positioning as needed */
  left: 0;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 200px;
  z-index: 9999; /* 높게 설정하여 다른 요소 위에 표시 */
  display: none;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1em;
  position: absolute;
  top: 4px;
  right: 4px;
}

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