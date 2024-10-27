<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">{{ reviewTypeTitle }}</h2> <!-- 리뷰 타입에 따라 동적 제목 --><br/><br/>
      <div class="modal-body">
        <p><strong>참여한 프로젝트 명 &nbsp; :</strong> {{ review.projectTitle }}</p>
        <p><strong>점수&nbsp;:&nbsp;</strong> {{ review.reviewStar }}</p>
        <p><strong>리뷰 내용&nbsp;:&nbsp;</strong></p>
        <p class="review-content">{{ review.reviewContent }}</p>
        <p><strong>등록일&nbsp;:&nbsp;</strong> {{ review.regDate }}</p>
        <p><strong>수정일&nbsp;:&nbsp;</strong> {{ review.modDate }}</p>
      </div>
      <div class="modal-footer">
        <button @click="closeModal">확인 완료</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    review: {
      type: Object,
      required: true
    }
  },
  computed: {
    reviewTypeTitle() {
      // review.type이 'team'이면 팀원 리뷰, 'mentor'이면 멘토 리뷰로 제목 설정
      return this.review.type === 'team' ? '팀원 리뷰 상세 조회' : '멘토 리뷰 상세 조회';
    }
  },
  emits: ['update:isVisible'],
  methods: {
    closeModal() {
      this.$emit('update:isVisible', false);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  height: auto;
  max-width: 90%;
  text-align: left;
}

.modal-title {
  text-align: center;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  text-align: center;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.review-content {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  max-height: 300px;
  overflow-y: auto;
}
</style>
