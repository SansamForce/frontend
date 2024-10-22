import {createRouter, createWebHistory} from "vue-router";
import Main from "@/views/main/Main.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Main
        },
        {
            path: "/projects",
            component: () => import("@/views/project/ProjectList.vue")
        },
        {
            path: "/projects/:id",
            component : () => import("@/views/project/ProjectDetail.vue")
        }
    ]
});

export default router;