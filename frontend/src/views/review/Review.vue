<template>
  <div class="review">
    <h1>리뷰 내역 보기</h1>

    <div class="tab-menu">
      <button :class="{ active: activeTab === 'team' }" @click="activeTab = 'team'">팀원 리뷰</button>
      <button :class="{ active: activeTab === 'mentor' }" @click="activeTab = 'mentor'">멘토 리뷰</button>
    </div>

    <table>
      <thead>
      <tr>
        <th>No.</th>
        <th>참여한 프로젝트 명</th>
        <th v-if="activeTab === 'mentor'">평가자</th>
        <th>점수</th>
        <th>등록일</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="filteredReviews.length === 0">
        <td colspan="5" style="text-align: center;">리뷰가 없습니다.</td>
      </tr>
      <tr v-for="(review, index) in filteredReviews" :key="review.userReviewSeq" @click="showReviewDetail(review)">
        <td>{{ index + 1 }}</td>
        <td>{{ review.projectTitle }}</td>
        <td v-if="activeTab === 'mentor'">{{ review.evaluator }}</td>
        <td>{{ review.reviewStar }}</td>
        <td>{{ review.regDate }}</td>
      </tr>
      </tbody>
    </table>

    <!-- 모달 창 컴포넌트 -->
    <ReviewDetail v-if="isModalVisible" :isVisible="isModalVisible" :review="selectedReview" @update:isVisible="isModalVisible = $event" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ReviewDetail from './ReviewDetail.vue';

export default {
  components: {
    ReviewDetail
  },
  setup() {
    const route = useRoute();
    const teamSeq = ref(route.params.teamSeq || 1); // teamSeq를 URL에서 받아옴
    const userSeq = ref(1);
    const accessToken = 'your_actual_token_here'; // 실제 액세스 토큰으로 교체

    const activeTab = ref('team');
    const reviews = ref({
      teamReviews: [],
      mentorReviews: []
    });

    // 모달 상태 및 선택된 리뷰 데이터
    const isModalVisible = ref(false);
    const selectedReview = ref(null);

    // 응답 디버깅을 위한 fetchReviews 함수
    const fetchReviews = async () => {
      try {
        // 팀원 리뷰 데이터 호출
        const teamResponse = await axios.get(`/api/v1/team/${teamSeq.value}/review`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log('팀원 리뷰 응답 상태 코드:', teamResponse.status);
        console.log('팀원 리뷰 응답 데이터:', teamResponse.data);

        // 응답 검증
        if (teamResponse.data && teamResponse.data.data) {
          reviews.value.teamReviews = teamResponse.data.data;
        } else {
          console.warn('팀원 리뷰 데이터가 올바르지 않습니다:', teamResponse.data);
        }

        // 멘토 리뷰 데이터 호출
        const mentorResponse = await axios.get(`/api/v1/user/${userSeq.value}/mentor/review/${userSeq.value}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log('멘토 리뷰 응답 상태 코드:', mentorResponse.status);
        console.log('멘토 리뷰 응답 데이터:', mentorResponse.data);

        if (mentorResponse.data && mentorResponse.data.data) {
          reviews.value.mentorReviews = mentorResponse.data.data;
        } else {
          console.warn('멘토 리뷰 데이터가 올바르지 않습니다:', mentorResponse.data);
        }

      } catch (error) {
        console.error('리뷰 데이터를 가져오는 중 오류 발생:', error);
        if (error.response) {
          console.error('응답 코드:', error.response.status);
          console.error('응답 데이터:', error.response.data);
        }
      }
    };

    onMounted(() => {
      fetchReviews();
    });

    const filteredReviews = computed(() => {
      const data = activeTab.value === 'team' ? reviews.value.teamReviews : reviews.value.mentorReviews;
      return data.filter(review => review.teamSeq === teamSeq.value);
    });

    const showReviewDetail = (review) => {
      selectedReview.value = review;
      isModalVisible.value = true;
    };

    return {
      activeTab,
      filteredReviews,
      isModalVisible,
      selectedReview,
      showReviewDetail
    };
  }
};
</script>

<style scoped>
.review {
  margin: 20px;
}

.tab-menu {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.tab-menu button {
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  flex: 1;
}

.tab-menu button.active {
  background-color: #00bfff;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  cursor: pointer;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
