import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/cadastro', name: 'cadastro', component: () => import('@/views/CadastroView.vue') },
    {
      path: '/painel',
      component: () => import('@/layouts/PainelLayout.vue'),
      meta: { exigeAutenticacao: true },
      children: [
        { path: '', redirect: '/painel/servicos' },
        { path: 'servicos', name: 'painel-servicos', component: () => import('@/views/painel/ServicosView.vue') },
        {
          path: 'disponibilidade',
          name: 'painel-disponibilidade',
          component: () => import('@/views/painel/DisponibilidadeView.vue'),
        },
        {
          path: 'agendamentos',
          name: 'painel-agendamentos',
          component: () => import('@/views/painel/AgendamentosView.vue'),
        },
      ],
    },
    {
      path: '/agenda/:slug',
      name: 'pagina-publica',
      component: () => import('@/views/PaginaPublicaView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.exigeAutenticacao && !auth.autenticado) {
    return { name: 'login' }
  }
})

export default router
