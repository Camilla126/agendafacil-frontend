<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function sair() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="painel">
    <aside class="painel__barra-lateral">
      <div class="painel__marca">
        Agenda<span class="painel__marca-ponto">Fácil</span><span class="painel__marca-acento">.</span>
      </div>

      <nav class="painel__navegacao">
        <RouterLink to="/painel/servicos" class="painel__link">Serviços</RouterLink>
        <RouterLink to="/painel/disponibilidade" class="painel__link">Disponibilidade</RouterLink>
        <RouterLink to="/painel/agendamentos" class="painel__link">Agendamentos</RouterLink>
      </nav>

      <div class="painel__rodape">
        <a
          v-if="auth.profissional"
          class="painel__link-publico"
          :href="`/agenda/${auth.profissional.slug}`"
          target="_blank"
          rel="noopener"
        >
          Ver minha página pública ↗
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

.painel__barra-lateral {
  width: 260px;
  flex-shrink: 0;
  background: var(--cor-tinta);
  color: var(--cor-fundo);
  display: flex;
  flex-direction: column;
  padding: var(--espaco-6) var(--espaco-5);
  position: sticky;
  top: 0;
  height: 100vh;
}

.painel__marca {
  font-family: var(--fonte-display);
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: var(--espaco-7);
}

.painel__marca-ponto {
  color: var(--cor-primaria);
}

.painel__marca-acento {
  color: var(--cor-primaria);
}

.painel__navegacao {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-2);
  flex: 1;
}

.painel__link {
  padding: var(--espaco-3) var(--espaco-4);
  border-radius: var(--raio-sm);
  font-weight: 600;
  color: rgba(253, 246, 236, 0.75);
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.painel__link:hover {
  background: rgba(253, 246, 236, 0.08);
  color: var(--cor-fundo);
}

.painel__link.router-link-active {
  background: var(--cor-primaria);
  color: var(--cor-tinta);
}

.painel__rodape {
  border-top: 1px solid rgba(253, 246, 236, 0.15);
  padding-top: var(--espaco-4);
  display: flex;
  flex-direction: column;
  gap: var(--espaco-2);
}

.painel__link-publico {
  font-size: 0.85rem;
  color: var(--cor-primaria);
  font-weight: 600;
  text-decoration: none;
}

.painel__link-publico:hover {
  text-decoration: underline;
}

.painel__usuario {
  font-weight: 600;
  font-size: 0.9rem;
}

.painel__sair {
  align-self: flex-start;
  background: none;
  border: none;
  color: rgba(253, 246, 236, 0.6);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
}

.painel__sair:hover {
  color: var(--cor-fundo);
  text-decoration: underline;
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

  .painel__barra-lateral {
    width: auto;
    height: auto;
    position: static;
  }

  .painel__conteudo {
    padding: var(--espaco-5);
  }
}
</style>
