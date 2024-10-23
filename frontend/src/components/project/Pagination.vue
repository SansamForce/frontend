<template>
  <div class="pagination">
    <button :disabled="currentPage === 1" @click="$emit('changePage', currentPage - 1)">
      이전
    </button>

    <span v-for="page in totalPages" :key="page" class="page-number">
      <button
          :class="{ active: currentPage === page }"
          @click="$emit('changePage', page)"
      >
        {{ page }}
      </button>
    </span>

    <button :disabled="currentPage === totalPages" @click="$emit('changePage', currentPage + 1)">
      다음
    </button>
  </div>
</template>

<script>
export default {
  props: {
    totalPages: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },
};
</script>

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
