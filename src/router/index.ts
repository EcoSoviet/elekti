import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: () => import("../views/Landing.vue"),
    },
    {
      path: "/quiz",
      name: "quiz",
      component: () => import("../views/Quiz.vue"),
    },
    {
      path: "/results",
      name: "results",
      component: () => import("../views/Results.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/About.vue"),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
