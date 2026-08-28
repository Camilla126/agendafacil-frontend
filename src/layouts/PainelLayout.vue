<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const GUICHES = [
  { numero: '01', rotulo: 'Serviços', rota: '/painel/servicos' },
  { numero: '02', rotulo: 'Disponibilidade', rota: '/painel/disponibilidade' },
  { numero: '03', rotulo: 'Agendamentos', rota: '/painel/agendamentos' },
]

function sair() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="painel">
    <aside class="painel__balcao">
      <div class="painel__marca">
        <span class="painel__marca-texto">Agenda<em>Fácil</em></span>
        <span class="painel__marca-linha">painel do profissional</span>
      </div>

      <nav class="painel__guiches">
        <RouterLink
          v-for="guiche in GUICHES"
          :key="guiche.rota"
          :to="guiche.rota"
          class="painel__guiche"
        >
          <span class="painel__guiche-numero">{{ guiche.numero }}</span>
          <span class="painel__guiche-rotulo">{{ guiche.rotulo }}</span>
        </RouterLink>
      </nav>

      <div class="painel__rodape">
        <a
          v-if="auth.profissional"
          class="painel__link-publico"
          :href="`/agenda/${auth.profissional.slug}`"
          target="_blank"
          rel="noopener"
        >
          Ver página pública ↗
        </a>
        <p class="painel__usuario">{{ auth.profissional?.nome }}</p>
        <button class="painel__sair" type="button" @click="sair">Sair</button>
      </div>
    </aside>

    <main class="painel__conteudo">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.painel {
  display: flex;
  min-height: 100vh;
}

.painel__balcao {
  width: 280px;
  flex-shrink: 0;
  background: var(--papel);
  border-right: var(--traco-forte);
  display: flex;
  flex-direction: column;
  padding: var(--espaco-6) 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.painel__marca {
  padding: 0 var(--espaco-5) var(--espaco-6);
  border-bottom: var(--traco);
  margin-bottom: var(--espaco-4);
}

.painel__marca-texto {
  display: block;
  font-family: var(--fonte-titulo);
  font-weight: 800;
  font-size: 1.6rem;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.painel__marca-texto em {
  font-style: normal;
  color: var(--azul-selo);
}

.painel__marca-linha {
  display: block;
  font-family: var(--fonte-numero);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tinta-fraca);
  margin-top: var(--espaco-1);
}

.painel__guiches {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.painel__guiche {
  display: flex;
  align-items: baseline;
  gap: var(--espaco-3);
  padding: var(--espaco-4) var(--espaco-5);
  border-left: 4px solid transparent;
  text-decoration: none;
  color: var(--tinta-suave);
  transition: background-color 0.1s ease, border-color 0.1s ease, color 0.1s ease;
}

.painel__guiche:hover {
  background: var(--papel-fundo);
}

.painel__guiche-numero {
  font-family: var(--fonte-numero);
  font-size: 0.8rem;
  color: var(--tinta-fraca);
}

.painel__guiche-rotulo {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-size: 0.9rem;
}

.painel__guiche.router-link-active {
  border-left-color: var(--azul-selo);
  background: var(--azul-selo-fundo);
  color: var(--tinta);
}

.painel__guiche.router-link-active .painel__guiche-numero {
  color: var(--azul-selo);
}

.painel__rodape {
  border-top: var(--traco);
  padding: var(--espaco-4) var(--espaco-5) 0;
  display: flex;
  flex-direction: column;
  gap: var(--espaco-2);
}

.painel__link-publico {
  font-size: 0.8rem;
  color: var(--azul-selo);
  font-weight: 600;
  text-decoration: none;
}

.painel__link-publico:hover {
  text-decoration: underline;
}

.painel__usuario {
  font-weight: 700;
  font-size: 0.9rem;
}

.painel__sair {
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--tinta-fraca);
  cursor: pointer;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0;
}

.painel__sair:hover {
  color: var(--vermelho-carimbo);
}

.painel__conteudo {
  flex: 1;
  padding: var(--espaco-7) var(--espaco-8);
  max-width: 960px;
}

@media (max-width: 768px) {
  .painel {
    flex-direction: column;
  }

  .painel__balcao {
    width: auto;
    height: auto;
    position: static;
  }

  .painel__conteudo {
    padding: var(--espaco-5);
  }
}
</style>
