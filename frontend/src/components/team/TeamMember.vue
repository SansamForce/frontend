<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";

const props = defineProps({
  teamMemberList: {
    type: Array,
    required: true
  },
  projectStatus: {
    type: String,
    required: true
  },
  teamSeq : {
    type: Number,
    required: true
  }
})

const teamMember= ref(null);

const fetchTeamMember = async () => {
  try {
    const response = await axios.get(`http://localhost:8086/api/v1/team/member/${props.teamSeq}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
    );

    teamMember.value = response.data.data;
  } catch (error) {
    console.error("평가 정보를 불러오는 중 오류 발생:", error);
  }
}

onMounted(() => {
  fetchTeamMember()
})
const selectedMember = ref(null);

const showEvaluationModal = ref(false);
const setRating = (star) => {
  rating.value = star;
};
const rating = ref(0);
const comment = ref("");

const saveEvaluation = async () => {
  if (!selectedMember.value?.teamMemberSeq) {
    alert("평가를 저장할 수 없습니다. 필수 정보가 누락되었습니다.");
    return;
  }

  const payload = {
    sendMemberSeq : teamMember.value.teamMemberSeq,
    receiveMemberSeq: selectedMember.value.teamMemberSeq,
    reviewStar: rating.value,
    reviewContent: comment.value,
  };

  try {
    const response = await axios.post(`http://localhost:8086/api/v1/team/${props.teamSeq}/review`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }
        }
    );

    alert("평가가 추가되었습니다.");

    } catch (error) {
      console.error("평가 정보를 불러오는 중 오류 발생:", error);
      rating.value = 0;
      comment.value = "";
  }
  location.reload()
}

const reviewObject = ref(null);
const reviewSeq = ref(0);
const openEvaluationModal = async (member) => {
  selectedMember.value = member;

  try {
    const sendTeamMemberSeq = teamMember.value.teamMemberSeq;
    const receiveTeamMemberSeq = selectedMember.value.teamMemberSeq;

    const response = await axios.get(
        `http://localhost:8086/api/v1/team/${props.teamSeq}/review/${sendTeamMemberSeq}/${receiveTeamMemberSeq}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
    );
    reviewObject.value =  response.data.data;

    if (response.data.data) {
      reviewObject.value = response.data.data;
      reviewSeq.value = reviewObject.value.userReviewSeq;
      rating.value = reviewObject.value.teamMemberReviewStar || 0;
      comment.value = reviewObject.value.teamMemberReviewContent || "";
    } else {
      reviewObject.value = null;
      rating.value = 0;
      comment.value = "";
    }
  } catch (error) {
    console.error("평가 정보를 불러오는 중 오류 발생:", error);
    reviewObject.value = null;
    rating.value = 0;
    comment.value = "";
  }

  showEvaluationModal.value = true;
}
</script>

<template>
  <strong><p style="float: right;">팀 인원 &nbsp; : &nbsp;  <span class="total-team-count">{{teamMemberList.length}}</span> 명</p></strong>
  <!-- 팀 정보 테이블 -->
  <table v-if="teamMember" class="table table-striped" style="text-align: center">
    <thead>
    <tr >
      <th>번호</th>
      <th>닉네임</th>
      <th>생년월일</th>
      <th>성별</th>
      <th>연락처</th>
      <th>이메일</th>
      <th>깃허브 아이디</th>
      <th v-if="projectStatus==='END'">
        평가
      </th>
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
      <th v-if="projectStatus==='END'">
        <template v-if="teamMember.teamMemberSeq !== member.teamMemberSeq">
          <button class="btn btn-evaluation" @click="openEvaluationModal(member)">평가</button>
        </template>
      </th>
    </tr>
    </tbody>
  </table>
  <b-modal v-model="showEvaluationModal" :title="selectedMember ? `평가 - ${selectedMember.userNickname}` : '평가'">
    <div class="mb-3">
      <label for="rating">평가 점수:</label>
      <div id="rating" class="stars">
        <span v-for="star in 5" :key="star" @click="setRating(star)" style="cursor: pointer;">
          <i :class="star <= rating ? 'fas fa-star gold' : 'far fa-star gray'"></i>
        </span>
      </div>
    </div>
    <div class="mb-3">
      <label for="comment">평가 내용</label>
      <textarea v-model="comment" class="form-control" rows="3"></textarea>
    </div>
    <template #footer>
      <button class="btn btn-secondary" @click="showEvaluationModal = false">취소</button>
      <button class="btn btn-primary" @click="saveEvaluation">저장</button>
    </template>
  </b-modal>
</template>

<style scoped>

.total-team-count {
  color: #171D8A;
  font-weight: bold;
}
.fas.fa-star {
  color: gold;
}
.far.fa-star {
  color: lightgray;
}
.gold {
  color: gold;
  font-size: 30px;
}
.gray {
  color: lightgray;
  font-size: 30px;
}
.stars {
  display: flex;
  gap: 4px;
}
</style>