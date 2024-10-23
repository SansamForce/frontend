import { createRouter, createWebHistory } from 'vue-router';
import Main from "@/views/main/Main.vue";
import Login from '@/components/user/LoginComponent.vue';
import { useUserStore } from '@/stores/UserStore'; // Pinia 스토어 불러오기

const routes = [
  {
    path: "/",
    component: Main
  },
  {
    path: '/login',
    name: 'Login',
    component: Login, // 로그인 페이지
  },
  {
    path: "/projects",
    component: () => import("@/views/project/ProjectList.vue"),
    meta: { requiresAuth: true } // 로그인 필요
  },
  {
    path: "/projects/:id",
    component: () => import("@/views/project/ProjectDetail.vue"),
    meta: { requiresAuth: true } // 로그인 필요
  },
  {
    path: "/projectBoards",
    component: () => import("@/views/projectBoard/ProjectBoardList.vue"),
    meta: { requiresAuth: true } // 로그인 필요
  },
  {
    path: "/projectBoards/:id",
    component : () => import("@/views/projectBoard/ProjectBoardDetail.vue")
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 라우트 가드 설정 (로그인 필요 여부 확인)
router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // Pinia 스토어 사용
  const isAuthenticated = userStore.isAuthenticated; // 로그인 여부 확인

  // 로그인이 필요한 경로에 접근 시 로그인 상태 확인
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
    next('/login');
  } else {
    next(); // 로그인되어 있거나, 로그인 필요 없는 페이지는 그대로 이동
  }
});

export default router;
