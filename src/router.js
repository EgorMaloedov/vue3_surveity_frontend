import { createRouter, createWebHistory } from 'vue-router';
import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
import Preview from "./views/Preview.vue";
import Auth from "./views/Auth.vue";
import {useAuthStore} from "./stores/authStore.js";
import TestComplete from "./components/Tests/TestComplete.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/dashboard', component: Dashboard },
    { path: '/preview', component: Preview },
    { path: '/auth', component: Auth },
    { path: '/test', component: TestComplete }, // Добавляем новый маршрут для Survey
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {

    if (to.path.includes('/test')) {
        return next();
    }

    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
        await authStore.authorizeByToken();
    }

    if (!authStore.isAuthenticated) {
        if (to.path === '/preview' || to.path === '/auth') {
            next();
        } else {
            next('/preview');
        }
    } else {
        if (to.path === '/preview' || to.path === '/auth') {
            next('/');
        } else {
            next();
        }
    }
});

export default router;
