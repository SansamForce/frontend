<script setup>
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import { computed } from "vue";



const props = defineProps({
  projectMemberList: {
    type: Array,
    required: true
  },
  projectStatus: {
    type: String,
    required: true
  },
  projectSeq: {
    type: Number,
    required: true
  }
});

const showTooltip = ref(false);

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;

}
const userStore = useUserStore();
const projectMentorSeq = userStore.user?.userSeq;
console.log(projectMentorSeq);

const showEvaluationModal = ref(false);
const selectedMember = ref(null);
const rating = ref(0);
const comment = ref("");
const mentorReviewSeq = ref(null); // 평가가 있을 경우 mentorReviewSeq를 저장
const openEvaluationModal = async (member) => {
  selectedMember.value = member;

  try {
    console.log("선택된 멤버:", member);
    console.log("Mentor Seq:", projectMentorSeq.value); // .value를 사용하여 실제 값 참조

    // POST 요청으로 평가 조회
    const response = await axios.post("http://localhost:8086/api/v1/mentor/review/member", {
      projectMentorSeq: projectMentorSeq.value, // .value를 사용
      projectMemberSeq: member.userSeq
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    // 응답 구조 확인을 위한 로그
    console.log("API 전체 응답:", response);
    console.log("API 응답 데이터:", response.data);
    console.log("API 응답 내부 데이터:", response.data.data);

    if (response.data.data) {
      // 기존 평가가 있을 경우 평가 정보 설정
      mentorReviewSeq.value = response.data.data.mentorReviewSeq;
      rating.value = response.data.data.mentorReviewStar || 0;
      comment.value = response.data.data.mentorReviewContent || "";
      console.log("기존 평가 있음. 평가 정보:", {
        mentorReviewSeq: mentorReviewSeq.value,
        rating: rating.value,
        comment: comment.value
      });
    } else {
      // 평가가 없는 경우 초기화
      mentorReviewSeq.value = null;
      rating.value = 0;
      comment.value = "";
      console.log("기존 평가 없음. 초기화됨.");
    }
  } catch (error) {
    console.error("평가 정보를 불러오는 중 오류 발생:", error);
    console.log("Error Response Data:", error.response?.data); // 추가 오류 응답 로그
    mentorReviewSeq.value = null;
    rating.value = 0;
    comment.value = "";
  }

  showEvaluationModal.value = true;
};




// 평가 저장 함수 (추가 및 수정)
const saveEvaluation = async () => {
  try {
    const apiUrl = mentorReviewSeq.value
        ? `http://localhost:8086/api/v1/project/${props.projectSeq}/mentor/review/${mentorReviewSeq.value}`
        : `http://localhost:8086/api/v1/project/${props.projectSeq}/mentor/review`;

    const payload = {
      mentorReviewStar: rating.value,
      mentorReviewContent: comment.value,
      ...(mentorReviewSeq.value ? {} : { projectMemberSeq: selectedMember.value.userSeq })
    };

    if (mentorReviewSeq.value) {
      // PUT 요청으로 평가 수정
      await axios.put(apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
    } else {
      // POST 요청으로 새로운 평가 추가
      await axios.post(apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
    }

    alert("평가가 저장되었습니다.");
    showEvaluationModal.value = false; // 모달 닫기
  } catch (error) {
    console.error("평가 저장 중 오류 발생:", error);
    alert("평가 저장에 실패했습니다.");
  }
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
      <th v-if="projectStatus === 'END'">평가</th>
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
      <td v-if="projectStatus === 'END' && member.projectMentorYn === 'N'">
        <button class="btn btn-evaluation" @click="openEvaluationModal(member)">평가</button>
      </td>
    </tr>
    </tbody>
  </table>

  <!-- 평가 모달 -->
  <b-modal v-model="showEvaluationModal" :title="selectedMember ? `평가 - ${selectedMember.userName}` : '평가'">
    <div class="mb-3">
      <label for="rating">평가 점수:</label>
      <div id="rating">
      <span v-for="star in 5" :key="star" @click="rating.value = star" style="cursor: pointer;">
        <i :class="star <= rating ? 'fas fa-star' : 'far fa-star'"></i>
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

.btn-evaluation {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-color: #262627;
  background-color: #262627;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
}
.fas.fa-star {
  color: gold;
}
.far.fa-star {
  color: lightgray;
}
</style>
