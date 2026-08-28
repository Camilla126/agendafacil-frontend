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
  return `${dia}/${mes}`
}

function horaCurta(valorIso) {
  return valorIso.slice(11, 16)
}

function numeroDoTicket(id) {
  return String(id).padStart(4, '0')
}
</script>

<template>
  <section>
    <header class="cabecalho">
      <p class="cabecalho__guiche">Guichê 03</p>
      <h1>Agendamentos</h1>
      <p class="cabecalho__descricao">Sua agenda, do jeito que os clientes marcaram.</p>
    </header>

    <ul v-if="store.lista.length" class="recibo">
      <li v-for="agendamento in store.lista" :key="agendamento.id" class="recibo__linha">
        <span class="recibo__ticket">Nº {{ numeroDoTicket(agendamento.id) }}</span>
        <span class="recibo__display">{{ horaCurta(agendamento.hora_inicio) }}</span>
        <div class="recibo__corpo">
          <p class="recibo__nome">{{ agendamento.cliente_nome }}</p>
          <p class="recibo__detalhe">
            {{ formatarData(agendamento.data) }} · {{ agendamento.cliente_email }}
          </p>
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

.cabecalho__guiche {
  font-family: var(--fonte-numero);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--azul-selo);
  margin-bottom: var(--espaco-2);
}

.cabecalho h1 {
  font-size: 2rem;
}

.cabecalho__descricao {
  color: var(--tinta-suave);
  margin-top: var(--espaco-2);
}

.recibo {
  border-top: var(--traco-forte);
}

.recibo__linha {
  display: grid;
  grid-template-columns: auto auto 1fr auto auto;
  align-items: center;
  gap: var(--espaco-4);
  padding: var(--espaco-4) 0;
  border-bottom: var(--traco);
}

.recibo__ticket {
  font-family: var(--fonte-numero);
  font-size: 0.75rem;
  color: var(--tinta-fraca);
}

.recibo__display {
  font-family: var(--fonte-numero);
  font-weight: 600;
  font-size: 0.95rem;
  background: var(--led-fundo);
  color: var(--led);
  padding: var(--espaco-2) var(--espaco-3);
}

.recibo__nome {
  font-weight: 700;
}

.recibo__detalhe {
  color: var(--tinta-suave);
  font-size: 0.85rem;
  margin-top: var(--espaco-1);
}

.vazio {
  color: var(--tinta-fraca);
  padding: var(--espaco-4) 0;
}

@media (max-width: 720px) {
  .recibo__linha {
    grid-template-columns: 1fr;
    justify-items: start;
  }
}
</style>
