<script setup>
import {ref} from "vue";
import axios from "axios";

const props = defineProps({
  projectMemberList: {
    type: Array,
    required: true
  },
  projectSeq :{
    type: Number,
    required: true
  }
});

const showTooltip = ref(false);

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;
}

const showDropdown = ref({});
// 드롭다운 메뉴 토글

const toggleDropdown = (index) => {
  // 클릭한 행의 드롭다운 상태를 토글하고, 나머지는 닫음
  showDropdown.value = { [index]: !showDropdown.value[index] };
};

const editIndex = ref(null); // 수정할 행의 인덱스
const editedMember = ref({});  // 수정할 행의 데이터를 임시 저장

// 수정 모드로 전환
const editMember = (index, member) => {
  editIndex.value = index;
  editedMember.value = { ...member }; // 수정할 데이터를 임시 저장
};

// 수정 저장
const saveEdit = async (index) => {
  props.projectMemberList[index] = { ...editedMember.value };

  const updatedMember = {
    projectMemberDelYn: editedMember.value.projectMemberDelYn,
    projectMentorYn: editedMember.value.projectMentorYn,
    projectMemberDevelopType: editedMember.value.projectMemberDevelopType
  };

  try {
    await axios.put(`http://localhost:8086/api/v1/admin/project/${props.projectSeq}/member/${editedMember.value.projectMemberSeq}`, updatedMember, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    alert("프로젝트 멤버가 수정되었습니다.");
  } catch (error) {
    alert("프로젝트 멤버 수정 중 오류가 발생했습니다.");
    console.error(error);
  }
  editIndex.value = null; // 수정 모드 종료
};

// 수정 취소
const cancelEdit = () => {
  editIndex.value = null;
};
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
      <th>기타</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(member, index) in projectMemberList" :key="index">
      <td>{{ index + 1 }}</td>
      <td>{{ member.userName }}</td>
      <td>
        <div v-if="editIndex === index">
          <select class="custom-select" v-model="editedMember.projectMemberDelYn">
            <option value="N">참여중</option>
            <option value="Y">탈퇴</option>
          </select>
        </div>
        <div v-else>
          <b-badge :variant="member.projectMemberDelYn === 'Y' ? 'gray' : 'primary'"
                   :style="member.projectMemberDelYn === 'Y' ? { backgroundColor: '#6c757d' } : {}">
            {{ member.projectMemberDelYn === 'Y' ? '탈퇴' : '참여중' }}
          </b-badge>
        </div>
      </td>
      <td>
        <div v-if="editIndex === index">
          <select class="custom-select" v-model="editedMember.projectMentorYn">
            <option value="Y">멘토</option>
            <option value="N">회원</option>
          </select>
        </div>
        <div v-else>
          <b-badge :variant="member.projectMentorYn === 'Y' ? 'danger' : 'black'">
            {{ member.projectMentorYn === 'Y' ? '멘토' : '회원' }}
          </b-badge>
        </div>
      </td>

      <td>
        {{ member.userMajorYn === 'Y' ? "전공자" : "비전공자"}}
      </td>
      <td>
        <div v-if="editIndex === index">
          <select class="custom-select" v-model="editedMember.projectMemberDevelopType">
            <option value="FRONTEND">FRONTEND</option>
            <option value="BACKEND">BACKEND</option>
          </select>
        </div>
        <div v-else>
          <b-badge :variant="member.projectMemberDevelopType === 'FRONTEND' ? 'primary' : 'danger'">
            {{ member.projectMemberDevelopType }}
          </b-badge>
        </div>
      </td>
      <td>{{ member.projectMemberCommitScore }}</td>
      <td>
        <button class="custom-button" v-if="editIndex === index" @click="saveEdit(index)">저장</button>
        <button class="custom-button" v-if="editIndex === index" @click="cancelEdit">취소</button>
        <div v-else class="dropdown">
          <button @click="toggleDropdown(index)" class="dropdown-btn">· · ·</button>
          <div v-if="showDropdown[index]" class="dropdown-content">
            <button class="dropdown-item" @click="editMember(index, member)">수정</button>
          </div>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped>

/* Dropdown styling */
.dropdown {
  position: relative;
}

.dropdown-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.dropdown-content {
  position: absolute;
  right: 0;
  top: 30px;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1;
  width: 130px;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  border: none;
  background: none;
  text-align: left;
  width: 100%;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.commit-score {
  position: relative;
}

.info-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}

.tooltip {
  position: absolute;
  top: 30px;
  left: 0;
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
  max-width: 200px;
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

b-badge.danger {
  background-color: #dc3545;
}

b-badge.black {
  background-color: #222222;
}


/* Custom Select Box */
.custom-select {
  appearance: none; /* 기본 화살표 제거 */
  background-color: #f0f4f8;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 0.6em;
  width: 100%;
  cursor: pointer;
  color: #333;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

.custom-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.custom-button {
  padding: 6px 12px; /* 버튼 크기를 줄이기 위해 padding 조정 */
  font-size: 0.9em; /* 폰트 크기 약간 줄임 */
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 4px;
}

.custom-button:hover {
  background-color: #0056b3;
}
</style>