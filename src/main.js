import { createApp } from 'vue';
import { createRouter, createWebHistory } from "vue-router";
import App from './App.vue';

const routes = [
    {
        path: '/login',
        name: "Login",
        component: () => import('./components/login.vue')
    },
    {
        path: '/register',
        name: "Register",
        component: () => import('./components/register.vue')
    },
    {
        path: '/',
        name: "Home",
        component: () => import('./components/home.vue')
    },
    {
        path: '/:conversation_id',
        name: "Chat-Window",
        component: () => import('./components/home.vue')
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const has_not_user = ((to.name !== 'Login' && to.name !== 'Register') && !user);
    const has_user = ((to.name === 'Login' || to.name === 'Register') && user);

    if (has_not_user) {
        next({ name: 'Login' });
    } else if (has_user) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

createApp(App).use(router).mount('#app');
