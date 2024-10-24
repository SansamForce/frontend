<script>
export default {
  props: {
    showModal: Boolean,
  },
  data() {
    return {
      newEventTitle: '',
    };
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.newEventTitle);
      this.newEventTitle = ''; // 입력 필드 초기화
    },
    cancel() {
      this.$emit('cancel');
      this.newEventTitle = ''; // 입력 필드 초기화
    },
  },
};
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-text">
      <p style="font-weight: bold; font-size: 1.2rem;">팀 일정 추가</p>
      <input v-model="newEventTitle" type="text" placeholder="이벤트를 입력하세요." /> <br />
      <div class="modal-buttons" style="margin-top: 20px;">
        <button @click="confirm">확인</button>
        <button @click="cancel">취소</button>
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
