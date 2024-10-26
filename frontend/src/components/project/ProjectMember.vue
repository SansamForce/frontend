<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";

const props = defineProps({
  projectMemberList: {
    type: Array,
    required: true,
  },
  projectStatus: {
    type: String,
    required: true,
  },
  projectSeq: {
    type: Number,
    required: true,
  },
});

const showTooltip = ref(false);
const showEvaluationModal = ref(false);
const selectedMember = ref(null);
const rating = ref(0);
const comment = ref("");
const mentorReviewSeq = ref(null);

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value;
};

const userStore = useUserStore();
const projectMentorSeq = computed(() => userStore.user?.userSeq);

const openEvaluationModal = async (member) => {
  selectedMember.value = member;
  const mentorSeq = projectMentorSeq.value;

  if (!mentorSeq) {
    alert("Mentor Seq가 설정되지 않았습니다. 다시 시도해 주세요.");
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:8086/api/v1/project/${props.projectSeq}/mentor/${mentorSeq}/review/${member.projectMemberSeq}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (response.data.data) {
      mentorReviewSeq.value = response.data.data.mentorReviewSeq;
      rating.value = response.data.data.mentorReviewStar || 0;
      comment.value = response.data.data.mentorReviewContent || "";
    } else {
      mentorReviewSeq.value = null;
      rating.value = 0;
      comment.value = "";
    }
  } catch (error) {
    console.error("평가 정보를 불러오는 중 오류 발생:", error);
    mentorReviewSeq.value = null;
    rating.value = 0;
    comment.value = "";
  }

  showEvaluationModal.value = true;
};

const saveEvaluation = async () => {
  try {
    if (!selectedMember.value?.projectMemberSeq) {
      alert("평가를 저장할 수 없습니다. 필수 정보가 누락되었습니다.");
      return;
    }

    const apiUrl = mentorReviewSeq.value
      ? `http://localhost:8086/api/v1/project/${props.projectSeq}/mentor/review/${mentorReviewSeq.value}`
      : `http://localhost:8086/api/v1/project/${props.projectSeq}/mentor/review`;

    const payload = {
      projectMemberSeq: selectedMember.value.projectMemberSeq,
      mentorReviewStar: rating.value,
      mentorReviewContent: comment.value,
    };

    if (mentorReviewSeq.value) {
      await axios.put(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      alert("평가가 수정되었습니다.");
    } else {
      await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      alert("평가가 추가되었습니다.");
    }

    showEvaluationModal.value = false;
  } catch (error) {
    console.error("평가 저장 중 오류 발생:", error);
    alert("평가 저장에 실패했습니다.");
  }
};

const setRating = (star) => {
  rating.value = star;
};
</script>

<template>
  <strong><p style="float: right;">총 인원 &nbsp; : &nbsp;  <span class="total-team-count">{{ projectMemberList.length }}</span> 명</p></strong>
  <table class="table table-striped" style="text-align: center">
    <thead>
      <tr>
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
      <tr v-for="(member, index) in projectMemberList" :key="member.projectMemberSeq">
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
        <td>{{ member.userMajorYn === 'Y' ? "전공자" : "비전공자" }}</td>
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

  <b-modal v-model="showEvaluationModal" :title="selectedMember ? `평가 - ${selectedMember.userName}` : '평가'">
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
.commit-score {
  position: relative;
  overflow: visible;
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
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 200px;
  z-index: 9999;
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
