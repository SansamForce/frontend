<template>
  <div class="team-building-container">
    <!-- 팀 빌딩 가중치 설정 화면 -->
    <div v-if="!isBuilding && !teamBuildingResult">
      <div class="team-info">
        <p><strong>팀 빌딩 인원: {{ totalMembers }}명</strong></p>
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
        <b-button @click="createTeamBuildingRule" variant="primary">팀 빌딩</b-button>
      </div>
    </div>

    <!-- 로딩 중 화면 -->
    <div v-if="isBuilding" class="loading-spinner">
      <div class="spinner"></div>
      <p>팀 빌딩 중입니다. 잠시만 기다려 주세요...
        오래걸리는게 정상입니다 새로고침하지 마세요....</p>
    </div>

    <!-- 팀 빌딩 결과 화면 -->
    <div v-if="teamBuildingResult && !isBuilding" class="team-building-result">
      <div class="weight-info">
        <p><b>가중치 정보</b> | 깃허브 = {{ ruleGithubWeight }} | 전공 = {{ ruleMajorWeight }} | 경력 = {{ ruleCareerWeight }} | 강사평가 = {{ ruleMentorReviewWeight }} | 회원평가 = {{ ruleTeamReviewWeight }}</p>
      </div>

      <div class="team-list">
        <div class="team" v-for="team in teamBuildingResult" :key="team.teamName">
          <h4>{{ team.teamName }}</h4>
          <div class="member-list">
            <div class="member-name" v-for="member in team.teamMembers" :key="member.userSeq" @mousemove="showTooltip(member, $event)" @mouseleave="hideTooltip">
              {{ member.userName }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="tooltipVisible" class="tooltip tooltip-active" :style="{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }">
        <p>{{ currentMember?.userName }}</p>
        <p><b>총점 = {{ calculateTotalScore(currentMember) }}</b></p>
        <p>분야: {{ currentMember?.developType }}</p>
        <p>깃허브 점수: {{ currentMember?.githubScore }}</p>
        <p>전공 점수: {{ currentMember?.majorScore }}</p>
        <p>경력 점수: {{ currentMember?.careerScore }}</p>
        <p>강사평가점수: {{ currentMember?.mentorEvaluationScore }}</p>
        <p>회원평가점수: {{ currentMember?.teamEvaluationScore }}</p>
        <p>Score Details: {{ getScoreDetails(currentMember) }}</p>
      </div>

      <!-- 수정 / 완료 버튼 -->
      <div class="team-building-buttons">
        <b-button @click="goBack" variant="secondary">수정</b-button>
        <b-button @click="completeTeamBuilding" variant="primary">완료</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default {
  data() {
    return {
      totalMembers: 0,
      teamCount: 1,
      isBuilding: false,
      teamBuildingResult: null,
      tooltipVisible: false,
      tooltipPosition: { top: 0, left: 0 },
      currentMember: null,
      ruleGithubWeight: 0,
      ruleMajorWeight: 0,
      ruleCareerWeight: 0,
      ruleMentorReviewWeight: 0,
      ruleTeamReviewWeight: 0,
      sliders: [
        { id: 'ruleGithubWeight', label: 'GitHub 커밋 이력', value: 0, min: 0, max: 5 },
        { id: 'ruleMajorWeight', label: '전공 여부', value: 0, min: 0, max: 5 },
        { id: 'ruleCareerWeight', label: '경력', value: 0, min: 0, max: 5 },
        { id: 'ruleTeamReviewWeight', label: '팀원 평가 이력', value: 0, min: 0, max: 5 },
        { id: 'ruleMentorReviewWeight', label: '강사 평가 이력', value: 0, min: 0, max: 5 },
      ],
      tooltipTimeout: null,
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const projectSeq = route.params.id;
    return { projectSeq, router };
  },
  mounted() {
    this.fetchProjectMembers();
  },
  methods: {
    async fetchProjectMembers() {
      try {
        const response = await axios.get(`http://localhost:8086/api/v1/admin/project/${this.projectSeq}/member`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const members = response.data.data;
        this.totalMembers = members.filter(member => member.projectMentorYn === 'N').length;
      } catch (error) {
        console.error('멤버 정보를 불러오는 중 오류가 발생했습니다:', error);
      }
    },

    async createTeamBuildingRule() {
      try {
        this.isBuilding = true;
        const payload = {
          ruleTeamCount: this.teamCount,
          ruleGithubWeight: this.sliders[0].value,
          ruleMajorWeight: this.sliders[1].value,
          ruleCareerWeight: this.sliders[2].value,
          ruleTeamReviewWeight: this.sliders[3].value,
          ruleMentorReviewWeight: this.sliders[4].value,
          ruleTechStackYn: "Y",
        };

        const response = await axios.post(`http://localhost:8086/api/v1/team/building-rule`, payload, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        const teamBuildingRuleSeq = response.data.data.teamBuildingRuleSeq;

        this.ruleGithubWeight = payload.ruleGithubWeight;
        this.ruleMajorWeight = payload.ruleMajorWeight;
        this.ruleCareerWeight = payload.ruleCareerWeight;
        this.ruleTeamReviewWeight = payload.ruleTeamReviewWeight;
        this.ruleMentorReviewWeight = payload.ruleMentorReviewWeight;

        this.startTeamBuilding(teamBuildingRuleSeq);
      } catch (error) {
        console.error('팀 빌딩 규칙 생성 중 오류 발생:', error);
        this.isBuilding = false;
      }
    },

    async startTeamBuilding(teamBuildingRuleSeq) {
      try {
        const response = await axios.get(`http://localhost:8086/api/v1/team/build/${this.projectSeq}/${teamBuildingRuleSeq}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        this.teamBuildingResult = response.data;
        this.isBuilding = false;
      } catch (error) {
        console.error('팀 빌딩 중 오류 발생:', error);
        this.isBuilding = false;
      }
    },

    calculateTotalScore(member) {
      return (
          member.githubScore * this.ruleGithubWeight +
          member.majorScore * this.ruleMajorWeight +
          member.careerScore * this.ruleCareerWeight +
          member.mentorEvaluationScore * this.ruleMentorReviewWeight +
          member.teamEvaluationScore * this.ruleTeamReviewWeight
      );
    },

    getScoreDetails(member) {
      return `${member.githubScore}x${this.ruleGithubWeight} + ${member.majorScore}x${this.ruleMajorWeight} + ${member.careerScore}x${this.ruleCareerWeight} + ${member.mentorEvaluationScore}x${this.ruleMentorReviewWeight} + ${member.teamEvaluationScore}x${this.ruleTeamReviewWeight}
      = ${member.totalEvaluationScore}`;
    },

    showTooltip(member, event) {
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = setTimeout(() => {
        this.currentMember = member;
        this.tooltipVisible = true;
        this.tooltipPosition.top = event.clientY + 10;
        this.tooltipPosition.left = event.clientX + 10;
      }, 100);
    },

    hideTooltip() {
      clearTimeout(this.tooltipTimeout);
      this.tooltipVisible = false;
      this.currentMember = null;
    },

    goBack() {
      this.teamBuildingResult = null;
      this.isBuilding = false;
    },

    async completeTeamBuilding() {
      try {
        const teams = this.teamBuildingResult.map(team => ({
          teamName: team.teamName,
          userSeqs: team.teamMembers.map(member => member.userSeq)
        }));

        const payload = {
          projectSeq: this.projectSeq,
          teams: teams
        };

        const response = await axios.post(`http://localhost:8086/api/v1/team`, payload, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success) {
          console.log("팀 생성 성공:", response.data);
          alert("팀 생성이 완료되었습니다.");
          const createdTeams = response.data.data;
          await this.createTeamChats(createdTeams);

          this.router.push(`/projects/${this.projectSeq}`);
        } else {
          alert("팀 생성 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("팀 생성 중 오류가 발생했습니다:", error);
      }
    },

    async createTeamChats(createdTeams) {
      try {
        for (const team of createdTeams) {
          const chatPayload = {
            teamChatName: `${team.teamName} 채팅방`,
            teamChatComment: `${team.teamName} 팀의 채팅방입니다.`,
            teamChatActive: 'Y'
          };

          await axios.post(`http://localhost:8086/api/v1/team/${team.teamSeq}/chat`, chatPayload, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json',
            }
          });

          console.log(`팀 ${team.teamName}의 채팅방 생성 완료 (teamSeq: ${team.teamSeq})`);
        }
        alert("팀 채팅방이 성공적으로 생성되었습니다.");
      } catch (error) {
        console.error("팀 채팅방 생성 중 오류가 발생했습니다:", error);
      }
    }
  }
};
</script>

<style scoped>
.team-building-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.sliders {
  padding: 10px;
}

.slider-group {
  margin-bottom: 10px;
}

input[type="range"] {
  width: 100%;
}

.team-building-button {
  text-align: center;
  margin-top: 10px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid #333;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.team-building-result {
  margin-top: 20px;
  text-align: center;
}

.team-list {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.team {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  width: 150px;
}

.team h4 {
  margin-bottom: 10px;
}

.member-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.member-name {
  display: inline-block;
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  margin-bottom: 5px;
}

.tooltip {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.tooltip-active {
  opacity: 1;
}

.team-building-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
</style>
