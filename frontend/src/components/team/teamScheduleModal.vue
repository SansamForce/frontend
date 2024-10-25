<script>
export default {
  props: {
    showModal: Boolean,
    isEditMode: Boolean,
    teamScheduleContent: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      newEventTitle: this.teamScheduleContent, // teamScheduleContent를 기본값으로 설정
    };
  },
  watch: {
    // 모달이 열릴 때마다 newEventTitle을 teamScheduleContent로 업데이트
    showModal(newVal) {
      if (newVal && this.isEditMode) {
        this.newEventTitle = this.teamScheduleContent;
      }
    }
  },
  methods: {
    confirm(type) {
      this.$emit('confirm', type, this.newEventTitle);
      this.newEventTitle = ''; // 입력 필드 초기화
    },
    cancel() {
      this.$emit('cancel');
      this.newEventTitle = ''; // 입력 필드 초기화
    },
    deleteEvent() {
      this.$emit('delete');
      this.newEventTitle = '';
    },
  },
};
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-text">
      <div v-if="isEditMode">
        <!-- 일정 수정 -->
        <p style="font-weight: bold; font-size: 1.2rem;">팀 일정 수정</p>
        <input v-model="newEventTitle" type="text" value="teamScheduleContent" /> <br />
      </div>
      <div v-else>
        <!-- 일정 추가 -->
        <p style="font-weight: bold; font-size: 1.2rem;">팀 일정 추가</p>
        <input v-model="newEventTitle" type="text" placeholder="이벤트를 입력하세요." /> <br />
      </div>

      <div class="modal-buttons" style="margin-top: 20px;">
        <button @click="cancel">취소</button>
        <button @click="isEditMode ? confirm('UPDATE') : confirm('CREATE')">확인</button>
        <button v-if="isEditMode" @click="deleteEvent">삭제</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed; /* 부모와 관계없이 화면에 고정 */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* 충분히 높은 값으로 설정 */
}

.modal-text {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  z-index: 10000; /* 백드롭보다 위에 표시 */
}
</style>
