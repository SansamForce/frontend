<script setup>

const props = defineProps({
  projectTeamList: {
    type: Array,
    required: true
  }
});

</script>

<template>
  <!-- 팀 목록 경고 -->
  <template v-if="projectTeamList">
    <h5 class="team-schedule-text">프로젝트 팀 조회</h5>

    <div class="team-list-container">
      <h3>팀 목록</h3>
      <div class="team-list d-flex flex-wrap justify-content-between">
        <!-- 팀 목록 카드 반복 -->
        <div v-for="team in projectTeamList" :key="team.id" class="team-card">
          <b-card class="h-100">
            <div class="d-flex align-items-center">
              <!-- 좌측 팀 이미지 -->
              <div class="team-image-container me-3">
                <img src="/images/team-image.png" alt="Team Image" class="team-image img-fluid" />
              </div>
              <!-- 우측 팀 정보 -->
              <div class="team-info">
                <h5>{{ team.teamName }}</h5>
                <p><strong>팀 등록 일자</strong></p>
                <p>{{ team.regDate }}</p>
                  <b-button variant="dark" class="float-end">조회</b-button>
              </div>
            </div>
          </b-card>
        </div>
      </div>
    </div>

  </template>
  <div class="no-team-container text-center" v-else>
    <!-- 경고 아이콘 -->
    <div class="warning-icon">
      <i class="bi bi-exclamation-triangle-fill"></i>
    </div>
      <!-- 텍스트 -->
      <p class="mt-3">
        진행 중인 팀이 존재하지 않습니다.
      </p>
    <p>
      T-Building에서 제공하는 자동 팀 빌딩모드로<br />
      지금 바로 팀을 빌딩해 보세요!
    </p>
    <b-button variant="dark" style="float: right; height: 35px;">팀 빌딩하기</b-button>

  </div>
</template>

<style scoped>

.no-team-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh; /* 화면 중앙에 배치 */
  text-align: center;
  max-width: 1200px;
}

.warning-icon {
  font-size: 50px;
  color: #f0ad4e; /* 경고 색상 */
}

p {
  font-size: 1em;
  color: #333;
}

.team-schedule-text {
  font-weight: bold;
}

.team-schedule-text:after {
  content: "";
  display: block;
  width: 16%;
  border-bottom: 2px solid #000000;
  margin: 13px 0 13px 0;
}

.team-list-container {
  padding: 10px;
}

.team-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px; /* 카드 사이의 간격 */
}

.team-card {
  width: 48%; /* 카드 크기를 줄임 */
  margin-bottom: 10px; /* 카드 아래 간격 */
  margin-right: 0px; /* 카드 사이의 간격 */
}

.team-image-container {
  width: 80px; /* 이미지 크기 줄임 */
  height: 80px;
  overflow: hidden;
}

.team-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-info {
  flex-grow: 1;
}

.team-button {
  margin-left: auto;
}

h5 {
  font-weight: bold;
  margin-bottom: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
}

.page-btn {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
}

.page-btn:hover {
  background-color: #007bff;
  color: white;
}
</style>