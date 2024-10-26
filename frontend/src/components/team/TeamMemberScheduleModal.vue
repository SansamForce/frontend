<script>
export default {
  props: {
    showModal: Boolean,
    isEditMode: Boolean,
    eventData: {
      type : Object,
      required: true
    },
  },
  data() {
    return {
      newEventTitle: this.eventData.title || '', // 이벤트 제목
      newEventPercent: this.eventData.percent || '', // 진행 퍼센트
      newEventFeedback: this.eventData.feedback || '', // 피드백
      newEventStart: this.eventData.start || '', // 시작일자
      newEventEnd: this.eventData.end || '', // 종료일자
    };
  },
  methods: {
    confirm(type) {
      const eventDetails = {
        title: this.newEventTitle,
        percent: this.newEventPercent,
        //feedback: this.newEventFeedback,
        start: this.newEventStart,
        end: this.newEventEnd,
      };
      this.$emit('confirm', { type, eventDetails });
      this.resetForm();
    },
    cancel() {
      this.$emit('cancel');
      this.resetForm(); // 취소 시 입력 필드 초기화
    },
    deleteEvent() {
      this.$emit('delete');
      this.resetForm();
    },
    resetForm() {
      // 입력 필드 초기화
      this.newEventTitle = '';
      this.newEventPercent = '';
      this.newEventStart = '';
      this.newEventEnd = '';
      this.newEventFeedback = '';
    }
  },
};
</script>

<template>
  <div class="modal-backdrop" v-if="showModal">
    <div class="modal-text">
      <div v-if="isEditMode">
        <!-- 일정 수정 -->
        <p style="font-weight: bold; font-size: 1.2rem;">팀원 진행상황 수정</p> <br />
        <span>일정 내용</span>&nbsp;&nbsp;
        <input class="event-text-box" v-model="newEventTitle" type="text" /> <br />
      </div>
      <div v-else>
        <!-- 일정 추가 -->
        <p style="font-weight: bold; font-size: 1.2rem;">팀원 진행상황 추가</p><br />
        <span>일정 내용</span>&nbsp;&nbsp;
        <input class="event-text-box" v-model="newEventTitle" type="text" placeholder="이벤트를 입력하세요." /> <br />
      </div>
      <br />
      <span>일정 진행율</span>&nbsp;&nbsp;
      <input class="event-text-box" v-model="newEventPercent" type="text" /> <br />
      <br />
      <span>일정 시작일</span>&nbsp;&nbsp;
      <input class="event-text-box" v-model="newEventStart" type="date" /> <br />
      <br />
      <span>일정 종료일</span>&nbsp;&nbsp;
      <input class="event-text-box" v-model="newEventEnd" type="date" /> <br />
      <br />
      <div v-if="isEditMode">
        <span>강사 피드백 내용</span>&nbsp;&nbsp;
        <input class="event-text-box" v-model="newEventFeedback" type="text" readonly="readonly" /> <br />
        <br />
      </div>
      <div class="modal-buttons" style="margin-top: 20px; margin-right: 10px; float: right">
        <b-button variant="dark" @click="cancel">취소</b-button> &nbsp;
        <b-button variant="dark" @click="isEditMode ? confirm('UPDATE') : confirm('CREATE')">확인</b-button>&nbsp;
        <b-button variant="dark" v-if="isEditMode" @click="deleteEvent">삭제</b-button>
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
  max-width: 410px;
  width: 100%;
  z-index: 10000; /* 백드롭보다 위에 표시 */
}
</style>
