<script setup>
const props = defineProps({
  projectSeq: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <!-- 팀 목록 경고 -->
  <div class="team-list">
    <div class="team-alert text-center">
      <i class="bi bi-exclamation-triangle-fill warning-icon"></i>
      <p>진행 중인 팀이 존재하지 않습니다.</p>
      <p>
        T-Building에서 제공하는 자동 팀 빌딩모드로<br />
        지금 바로 팀을 빌딩해 보세요!
      </p>
      <button class="team-btn">팀 빌딩하기</button>
    </div>
  </div>
</template>

<style scoped>

</style>