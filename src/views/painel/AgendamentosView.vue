<script setup>
import { onMounted, ref } from 'vue'
import { useAgendamentosStore } from '@/stores/agendamentos'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'

const store = useAgendamentosStore()
const cancelandoId = ref(null)

onMounted(() => store.buscar())

async function cancelar(id) {
  cancelandoId.value = id
  try {
    await store.cancelar(id)
  } finally {
    cancelandoId.value = null
  }
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function horaCurta(valorIso) {
  return valorIso.slice(11, 16)
}
</script>

<template>
  <section>
    <header class="cabecalho">
      <h1>Agendamentos</h1>
      <p>Sua agenda, do jeito que os clientes marcaram.</p>
    </header>

    <ul v-if="store.lista.length" class="lista">
      <li v-for="agendamento in store.lista" :key="agendamento.id" class="lista__item">
        <div class="lista__quando">
          <p class="lista__data">{{ formatarData(agendamento.data) }}</p>
          <p class="lista__hora">{{ horaCurta(agendamento.hora_inicio) }}–{{ horaCurta(agendamento.hora_fim) }}</p>
        </div>
        <div class="lista__cliente">
          <p class="lista__nome">{{ agendamento.cliente_nome }}</p>
          <p class="lista__detalhe">{{ agendamento.cliente_email }}</p>
        </div>
        <AppBadge :status="agendamento.status" />
        <AppButton
          v-if="agendamento.status !== 'cancelado'"
          variante="perigo"
          :desabilitado="cancelandoId === agendamento.id"
          @click="cancelar(agendamento.id)"
        >
          {{ cancelandoId === agendamento.id ? 'Cancelando…' : 'Cancelar' }}
        </AppButton>
      </li>
    </ul>
    <p v-else-if="!store.carregando" class="vazio">Nenhum agendamento por aqui ainda.</p>
  </section>
</template>

<style scoped>
.cabecalho {
  margin-bottom: var(--espaco-6);
}

.cabecalho p {
  color: var(--cor-tinta-suave);
  margin-top: var(--espaco-1);
}

.lista {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-3);
}

.lista__item {
  display: grid;
  grid-template-columns: 110px 1fr auto auto;
  align-items: center;
  gap: var(--espaco-4);
  background: var(--cor-superficie);
  border: 2px solid var(--cor-borda);
  border-radius: var(--raio-sm);
  padding: var(--espaco-4);
}

.lista__data {
  font-weight: 700;
}

.lista__hora {
  color: var(--cor-tinta-suave);
  font-size: 0.85rem;
}

.lista__nome {
  font-weight: 600;
}

.lista__detalhe {
  color: var(--cor-tinta-suave);
  font-size: 0.85rem;
}

.vazio {
  color: var(--cor-tinta-fraca);
}

@media (max-width: 640px) {
  .lista__item {
    grid-template-columns: 1fr;
    justify-items: start;
  }
}
</style>
