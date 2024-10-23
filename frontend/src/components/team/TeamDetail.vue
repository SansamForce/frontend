<script setup>
const props = defineProps({
  teamName: {
    type: String,
    required: true
  }
})

</script>

<template>
<!-- 팀 조회 -->
<div class="col-md-6">
  <b-card class="h-100 d-flex align-items-center justify-content-center">
    <div class="alert alert-warning" v-if="team">

    </div>
    <div class="alert alert-warning" v-else>
      진행 중인 팀이 존재하지 않습니다.
      <p>강사님이 팀을 정해주신 이후 내가 속한 팀의 정보를 확인하실 수 있습니다.</p>
    </div>
  </b-card>
</div>
</template>

<style scoped>

</style>