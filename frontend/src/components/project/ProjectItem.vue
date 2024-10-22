<script setup>
import {useRouter} from "vue-router";

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const goToProjectDetail = (seq) => {
  router.push(`/projects/${seq}`);
};
</script>

<template>
  <b-col md="3" class="mb-4">
    <b-card style="cursor:pointer;" @click="goToProjectDetail(project.projectSeq)">
      <b-row>
        <b-img :src="project.projectImgUrl" :alt="project.projectTitle" class="mb-2"></b-img>
      </b-row>
      <b-card-text class="left-align">
        <div>{{ project.projectTitle }}</div>
        <span class="badge" :class="{'badge-primary': project.projectStatus === 'PROGRESS', 'badge-secondary': project.projectStatus === 'END'}">
          {{ project.projectStatus === 'PROGRESS' ? "진행중" : "종료됨"}}
        </span>
      </b-card-text>
    </b-card>
  </b-col>
</template>

<style scoped>
.left-align {
  text-align: left;
}

.badge-primary {
  background-color: #00d8ff;
}

.badge-secondary {
  background-color: #6c757d;
}

b-card {
  text-align: center;
}

b-img {
  height: 150px;
  object-fit: contain;
}
</style>