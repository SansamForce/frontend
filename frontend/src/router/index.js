import { createRouter, createWebHistory } from 'vue-router';
import Main from "@/views/main/Main.vue";
import Login from '@/components/user/LoginComponent.vue';


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
    component: () => import("@/views/project/ProjectList.vue")
  },
  {
    path: "/projects/:id",
    component : () => import("@/views/project/ProjectDetail.vue")
  },
  {
    path: "/projectBoards",
    component: () => import("@/views/projectBoard/ProjectBoardList.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
