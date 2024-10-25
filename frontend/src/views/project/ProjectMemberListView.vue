<script setup>
import ProjectMember from "@/components/project/ProjectMember.vue";
import axios from "axios";
import {onMounted, ref} from "vue";

const props = defineProps({
  projectSeq: {
    type: Number,
    required: true
  }
});

const projectMemberList = ref([]);
const fetchProjectMemberList = async () => {
  try {
    const projectResponse = await axios.get(`http://localhost:8086/api/v1/project/member/${props.projectSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    projectMemberList.value = projectResponse.data.data;
  } catch (error) {
    console.error('프로젝트 정보를 불러오는 중 에러가 발생했습니다:', error);
  }
};

onMounted(() => fetchProjectMemberList());
</script>

<template>
  <div class="col-md-6">
    <b-card class="h-100">
      <div class="row container fixed-header">
        <b-card-header class="text-start d-flex justify-content-between align-items-center">
          <span style="font-weight: bold; font-size: 1.2rem;">내 프로젝트 팀 조회</span>
        </b-card-header>
        <b-card-body>
          <ProjectMember v-if="projectMemberList" :project-member-list="projectMemberList"/>
        </b-card-body>
      </div>
    </b-card>
  </div>
</template>

<style scoped>

</style>