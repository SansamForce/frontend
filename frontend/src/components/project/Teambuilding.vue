<template>
  <div class="team-building-container">
    <div class="team-info">
      <p><strong>팀 빌딩 인원 : {{ totalMembers }}명</strong></p>
    </div>

    <!-- 슬라이더로 팀 빌딩 가중치 설정 -->
    <div class="sliders">
      <div class="slider-group">
        <label for="teamCount">빌딩 할 팀 개수</label>
        <input type="range" v-model="teamCount" min="1" :max="totalMembers" id="teamCount">
        <p>{{ teamCount }} 팀</p>
      </div>

      <div class="slider-group" v-for="(slider, index) in sliders" :key="index">
        <label :for="slider.id">{{ slider.label }}</label>
        <input type="range" v-model="slider.value" :min="slider.min" :max="slider.max" :id="slider.id">
        <p>{{ slider.value }}점</p>
      </div>
    </div>

    <!-- 팀 빌딩 시작 버튼 -->
    <div class="team-building-button">
      <b-button @click="startTeamBuilding" variant="primary">팀 빌딩</b-button>
    </div>

    <!-- 팀 빌딩 결과 -->
    <div v-if="teamBuildingResult" class="team-building-result">
      <h3>팀 빌딩 결과</h3>
      <div v-for="team in teamBuildingResult" :key="team.teamName">
        <h4>{{ team.teamName }}</h4>
        <ul>
          <li v-for="member in team.teamMembers" :key="member.userSeq">{{ member.userName }} ({{ member.developType }})</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    totalMembers: {
      type: Number,
      required: true
    },
    projectSeq: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      teamCount: 1,
      teamBuildingResult: null,  // 팀 빌딩 결과 저장
      sliders: [
        { id: 'githubCommit', label: 'GitHub 커밋 이력', value: 0, min: 0, max: 5 },
        { id: 'major', label: '전공 여부', value: 0, min: 0, max: 5 },
        { id: 'experience', label: '경력', value: 0, min: 0, max: 5 },
        { id: 'teamEval', label: '팀원 평가 이력', value: 0, min: 0, max: 5 },
        { id: 'instructorEval', label: '강사 평가 이력', value: 0, min: 0, max: 5 },
      ],
    };
  },
  methods: {
    async startTeamBuilding() {
      try {
        // 슬라이더 값으로 API에 전달할 데이터 준비
        const payload = {
          teamCount: this.teamCount,
          githubCommit: this.sliders[0].value,
          major: this.sliders[1].value,
          experience: this.sliders[2].value,
          teamEval: this.sliders[3].value,
          instructorEval: this.sliders[4].value,
        };

        // 팀 빌딩 API 호출 (projectSeq와 teamBuildingRuleSeq를 전달)
        const response = await axios.get(`http://localhost:8086/api/v1/team/build/${this.projectSeq}/1`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          params: payload  // 슬라이더 값들을 쿼리 파라미터로 전달
        });

        // API 응답을 받아서 팀 빌딩 결과를 화면에 표시
        this.teamBuildingResult = response.data;
      } catch (error) {
        console.error('팀 빌딩 중 에러 발생:', error);
      }
    },
  },
};
</script>

<style scoped>
.team-building-container {
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}
.team-info {
  margin-bottom: 20px;
}
.sliders {
  margin-bottom: 20px;
}
.slider-group {
  margin-bottom: 20px;
}
input[type="range"] {
  width: 100%;
}
.team-building-button {
  text-align: center;
  margin-top: 20px;
}
.team-building-result {
  margin-top: 30px;
}
</style>
