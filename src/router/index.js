import VueRouter from 'vue-router'

export default () => {
    return new VueRouter({
        routes: [
            {
                path: '/',
                redirect: '/app'
            },
            {
                path: '/app',
                props: true,
                component: () => import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
                // component: Todo,
                name: 'app',
                meta: {
                    title: 'this is app',
                    description: 'asdasd'
                }
            },
            {
                path: '/login',
                component: () => import(/* webpackChunkName: "login-view" */ '../views/login/login.vue'),
                // component: Login
                meta: {
                    title: 'login page',
                    description: 'login'
                }
            }
        ]
    });
}