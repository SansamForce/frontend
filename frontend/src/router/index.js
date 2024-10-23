import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/user/LoginComponent.vue';


const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login, // 로그인 페이지
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
