import Vue from 'vue';
import Router from 'vue-router';
import Main from './views/Main.vue';
import Print from './views/Print.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main,
    },
    {
      path: '/print/:seed/:lambda/:point',
      name: 'print',
      component: Print,
      props: true,
    },
  ],
});
