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
    path: "/projects/:id/team-building",
    name: "TeamBuilding",
    component: () => import("@/views/team/TeamBuildingView.vue"),
    meta: { requiresAuth: true } // 로그인 필요
  },
  {
    path: "/projectBoards",
    component: () => import("@/views/projectBoard/ProjectBoardList.vue"),
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

      if (isManager) {
        next(`/projectBoards/${to.params.id}/admin`);
      } else {
        next();
      }
    },
    component: () => import("@/views/projectBoard/ProjectBoardDetail.vue"),
  },
  {
    path: "/projectBoards/:id/admin",
    name: "ProjectBoardApplyMemberView",
    component: () => import("@/views/projectBoard/AdminBoardDetail.vue"),
    meta: { requiresAuth: true, isManagerOnly: true }
  },
  {
    path: '/projectBoards/apply',
    name: 'AppliedProjects',
    component: () => import('@/views/projectBoard/AppliedProjectList.vue'),
    meta: { requiresAuth: true }
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
  {
    path: '/mypage/repository',
    name: 'RepositoryManagement',
    component: () => import('@/views/mypage/RepositoryManagement.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    next(`/mypage`);
  } else {
    next();
  }
});

export default router;
