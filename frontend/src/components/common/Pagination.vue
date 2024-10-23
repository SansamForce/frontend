<template>
  <div class="pagination">
    <span
        v-for="page in totalPages"
        :key="page"
        :class="{ 'active': page === currentPage }"
        @click="changePage(page)"
        class="page-number"
    >
      {{ page }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-changed']);

const changePage = (page) => {
  if (page > 0 && page <= props.totalPages) {
    emit('page-changed', page);
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.page-number {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.page-number.active {
  background-color: black;
  color: white;
}
</style>
