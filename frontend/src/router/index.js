import { createRouter, createWebHistory } from 'vue-router';
import Main from "@/views/main/MainView.vue";
import Login from '@/views/user/LoginView.vue';
import Signup from '@/views/user/SignupView.vue';
import { useUserStore } from '@/stores/UserStore';

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
    path: '/signup', // 회원가입 페이지
    name: 'Signup',
    component: Signup,
  },
  {
    path: "/projects",
    component: () => import("@/views/project/ProjectListView.vue"),
    meta: { requiresAuth: true } // 로그인 필요
  },
  {
    path: "/projects/:id",
    component: () => import("@/views/project/ProjectDetailView.vue"),
    meta: { requiresAuth: true } // 로그인 필요
  },
  {
    path: "/projectBoards",
    component: () => import("@/views/projectBoard/ProjectBoardList.vue"),
    // meta: { requiresAuth: true } // 로그인 필요
  },
  {
    path: '/user/:userSeq',
    component: () => import('@/views/admin/UserDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/projectBoards/:id",
    name: "ProjectBoardDetail",
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      const isManager = userStore.auth === 'MANAGER'; // 사용자 권한 확인

      // 관리자인 경우 관리자용 상세 페이지로 리다이렉트
      if (isManager) {
        next(`/projectBoards/${to.params.id}/admin`);
      } else {
        // 일반 사용자는 일반 프로젝트 상세 페이지로
        next();
      }
    },
    component: () => import("@/views/projectBoard/ProjectBoardDetail.vue"), // 일반 회원 상세 페이지
  },
  {
    path: "/projectBoards/:id/admin",
    name: "ProjectBoardApplyMemberView",
    component: () => import("@/views/projectBoard/AdminBoardDetail.vue"),
    meta: { requiresAuth: true, isManagerOnly: true } // 관리자만 접근 가능
  },

  {
    path: '/member',
    component: () => import('@/views/admin/UserList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mypage',
    name: 'MyPage',
    component: () => import('@/views/mypage/MyPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/projects/:id/team/:id/schedule",
    component: () => import("@/views/team/TeamDetailView.vue"),
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;

  // 로그인이 필요한 경로에 접근 시 로그인 상태 확인
  if (to.meta.requiresAuth && !isAuthenticated) {

    next('/login');
  } else if (isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    // 로그인 상태에서 로그인/회원가입 페이지로 접근 시 마이페이지로 리다이렉트
    next(`/mypage`);
  } else {
    next(); // 로그인되어 있거나, 로그인 필요 없는 페이지는 그대로 이동
  }
});

export default router;
