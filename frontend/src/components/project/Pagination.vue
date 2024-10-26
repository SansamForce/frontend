<script setup>

const props = defineProps({
  totalPage: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true,
  }
});
</script>
<template>
  <div class="pagination">
    <button :disabled="currentPage === 1" @click="$emit('changePage', currentPage - 1)">
      이전
    </button>

    <span v-for="page in totalPage" :key="page" class="page-number">
      <button
          :class="{ active: currentPage === page }"
          @click="$emit('changePage', page)"
      >
        {{ page }}
      </button>
    </span>

    <button :disabled="currentPage === totalPage" @click="$emit('changePage', currentPage + 1)">
      다음
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-number button {
  margin: 0 5px;
}

button.active {
  font-weight: bold;
}
</style>
