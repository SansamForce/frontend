<script setup>
const props = defineProps({
  teamScheduleList: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <h6>팀 일정</h6>
  <div class="calendar-container">
    <b-table :items="teamScheduleList" :fields="fields"></b-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fields: [
        { key: 'teamScheduleContent', label: '일정내용' },
        { key: 'teamScheduleEndDate', label: '마감일자' },
        { key: 'teamScheduleStartDate', label: '시작일자' },
      ]
    }
  }
}
</script>
<style scoped>

</style>