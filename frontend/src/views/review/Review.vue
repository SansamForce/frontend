
<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ReviewDetail from './ReviewDetail.vue';

export default {
  components: {
    ReviewDetail
  },
  setup() {
    const route = useRoute();
    const userSeq = route.params.userSeq;

    const activeTab = ref('team');
    const teamReviews = ref(null);
    const mentorReviews = ref(null);

    // 모달 상태 및 선택된 리뷰 데이터
    const isModalVisible = ref(false);
    const selectedReview = ref(null);

    // 응답 디버깅을 위한 fetchReviews 함수
    const fetchReviews = async () => {
      try {

        // 팀원 리뷰 데이터 호출
        const teamResponse = await axios.get(`http://localhost:8086/api/v1/user/2/review/teamMember`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (teamResponse.data && teamResponse.data.data) {
          teamReviews.value = teamResponse.data.data;
          console.log('팀원 리뷰 데이터:', teamReviews.value);
        } else {
          console.warn('팀원 리뷰 데이터가 올바르지 않습니다:', teamResponse.value);
        }


        const mentorResponse = await axios.get(`http://localhost:8086/api/v1/user/2/review/teamMentor`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (mentorResponse.data && mentorResponse.data.data) {
          mentorReviews.value = mentorResponse.data.data;
          console.log('멘토 리뷰 응답 데이터:', mentorResponse.data.data);
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

    const showReviewDetail = (review) => {
      selectedReview.value = review;
      isModalVisible.value = true;
    };

    return {
      activeTab,
      isModalVisible,
      selectedReview,
      showReviewDetail
    };
  }
};
</script>

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
        <th style="text-align: center">번호</th>
        <th style="text-align: center">참여한 프로젝트 명</th>
        <th style="text-align: center" v-if="activeTab === 'mentor'">평가자</th>
        <th style="text-align: center">점수</th>
        <th style="text-align: center">등록일</th>
        <th style="text-align: center">수정일</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="activeTab === 'team' && teamReviews == null">
        <td colspan="6" style="text-align: center;">팀원 리뷰가 없습니다.</td>
      </tr>
      <tr v-if="activeTab === 'mentor' && mentorReviews == null">
        <td colspan="6" style="text-align: center;">멘토 리뷰가 없습니다.</td>
      </tr>

      <!-- 팀원 리뷰 리스트 -->
      <tr v-if="activeTab === 'team'" v-for="(review, index) in teamReviews" :key="review.userReviewSeq" @click="showReviewDetail(review)">
        <td style="text-align: center">{{ index + 1 }}</td>
        <td style="text-align: center">{{ review.projectTitle }}</td>
        <td style="text-align: center">{{ review.reviewStar }}</td>
        <td style="text-align: center">{{ review.regDate }}</td>
        <td style="text-align: center">{{ review.modDate == null ? '-' : review.modDate }}</td>
      </tr>

      <!-- 멘토 리뷰 리스트 -->
      <tr v-if="activeTab === 'mentor'" v-for="(review, index) in mentorReviews" :key="review.userReviewSeq" @click="showReviewDetail(review)">
        <td style="text-align: center">{{ index + 1 }}</td>
        <td style="text-align: center">{{ review.projectTitle }}</td>
        <td style="text-align: center">{{ review.mentorNickName }}</td>
        <td style="text-align: center">{{ review.reviewStar }}</td>
        <td style="text-align: center">{{ review.regDate }}</td>
        <td style="text-align: center">{{ review.modDate == null ? '-' : review.modDate }}</td>
      </tr>
      </tbody>
    </table>

    <ReviewDetail v-if="isModalVisible" :isVisible="isModalVisible" :review="selectedReview" @update:isVisible="isModalVisible = $event" />
  </div>
</template>


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
