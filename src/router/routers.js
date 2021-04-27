export const routes = [

    {
        path: '/register',
        name: 'Register',
        component: r => require(['../views/Register.vue'], r),
    },

    {
        path: '/login',
        name: 'Login',
        component: r => require(['../views/Login.vue'], r),
    },

    {
        path: '/main',
        name: 'Main',
        component: r => require(['../views/Main.vue'], r),
        children: [{
                path: 'type',
                name: 'Type',
                component: r => require(['../views/Type.vue'], r),
            },
            {
                path: 'products',
                name: 'Products',
                component: r => require(['../views/Products.vue'], r)
            },
            {
                // ? 修饰前面参数可有可无，有只有一个
                path: 'pro/:id/:productId?',
                name: 'Pro',
                component: r => require(['../views/Pro.vue'], r)
            },
        ]
    },

    {
        path: '/setting',
        name: 'Setting',
        component: r => require(['../views/Setting.vue'], r),
    },

    {
        path: '*',
        redirect: {
            name: 'Register',
        }
    },
]