<script setup>
import ProjectMember from "@/components/project/ProjectMember.vue";
import AdminProjectMember from "@/components/project/AdminProjectMember.vue";
import axios from "axios";
import {onMounted, ref} from "vue";

const props = defineProps({
  projectSeq: {
    type: Number,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  }
});

const projectMemberList = ref([]);
const projectStatus = ref('');

// 프로젝트 멤버 리스트 가져오는 함수
const fetchProjectMemberList = async () => {
  try {
    const response = await axios.get(`http://localhost:8086/api/v1/project/member/${props.projectSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    projectMemberList.value = response.data.data;
  } catch (error) {
    console.error('프로젝트 멤버 정보를 불러오는 중 에러가 발생했습니다:', error);
  }
};

// 프로젝트 상태 가져오는 함수
const fetchProjectStatus = async () => {
  try {
    const response = await axios.get(`http://localhost:8086/api/v1/project/${props.projectSeq}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    projectStatus.value = response.data.data.projectStatus;
  } catch (error) {
    console.error('프로젝트 상태 정보를 불러오는 중 에러가 발생했습니다:', error);
  }
};

// 컴포넌트가 마운트될 때 두 개의 API 호출을 통해 데이터 가져오기
onMounted(async () => {
  await fetchProjectMemberList();
  await fetchProjectStatus();
});
</script>

<template>
  <div class="col-md-6">
    <b-card class="h-100">
      <div class="row container fixed-header">
        <b-card-header class="text-start d-flex justify-content-between align-items-center">
          <span style="font-weight: bold; font-size: 1.2rem;">내 프로젝트 팀 조회</span>
        </b-card-header>
        <b-card-body>
          <AdminProjectMember v-if="isAdmin && projectMemberList" :project-seq="projectSeq" :project-member-list="projectMemberList"/>
          <ProjectMember
              v-if="!isAdmin && projectMemberList"
              :project-member-list="projectMemberList"
              :project-status="projectStatus"
              :project-seq="projectSeq"
          />
        </b-card-body>
      </div>
    </b-card>
  </div>
</template>

<style scoped>

</style>