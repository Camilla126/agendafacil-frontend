<script setup>
import { onMounted, ref } from 'vue'
import { useDisponibilidadesStore } from '@/stores/disponibilidades'
import { mensagensDeErro } from '@/utils/erros'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppAlerta from '@/components/ui/AppAlerta.vue'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const store = useDisponibilidadesStore()

const diaSemana = ref(1)
const horaInicio = ref('09:00')
const horaFim = ref('18:00')
const enviando = ref(false)
const erros = ref([])

onMounted(() => store.buscar())

async function criar() {
  erros.value = []
  enviando.value = true
  try {
    await store.criar({
      dia_semana: diaSemana.value,
      hora_inicio: horaInicio.value,
      hora_fim: horaFim.value,
    })
  } catch (erro) {
    erros.value = mensagensDeErro(erro.response?.data?.errors)
  } finally {
    enviando.value = false
  }
}

async function remover(id) {
  await store.remover(id)
}

function horaCurta(valorIso) {
  return valorIso.slice(11, 16)
}
</script>

<template>
  <section>
    <header class="cabecalho">
      <h1>Disponibilidade</h1>
      <p>Os dias e horários em que você atende. Pode cadastrar mais de um bloco por dia.</p>
    </header>

    <AppCard class="formulario-card">
      <form class="formulario" @submit.prevent="criar">
        <AppAlerta :mensagens="erros" />
        <div class="formulario__linha">
          <label class="campo-select">
            <span>Dia da semana</span>
            <select v-model.number="diaSemana">
              <option v-for="(dia, indice) in DIAS" :key="indice" :value="indice">{{ dia }}</option>
            </select>
          </label>
          <label class="campo-select">
            <span>Início</span>
            <input v-model="horaInicio" type="time" required />
          </label>
          <label class="campo-select">
            <span>Fim</span>
            <input v-model="horaFim" type="time" required />
          </label>
        </div>
        <AppButton tipo="submit" :desabilitado="enviando">
          {{ enviando ? 'Adicionando…' : '+ Adicionar bloco' }}
        </AppButton>
      </form>
    </AppCard>

    <ul v-if="store.lista.length" class="lista">
      <li v-for="disponibilidade in store.lista" :key="disponibilidade.id" class="lista__item">
        <div>
          <p class="lista__nome">{{ DIAS[disponibilidade.dia_semana] }}</p>
          <p class="lista__detalhe">
            {{ horaCurta(disponibilidade.hora_inicio) }} às {{ horaCurta(disponibilidade.hora_fim) }}
          </p>
        </div>
        <AppButton variante="fantasma" @click="remover(disponibilidade.id)">Remover</AppButton>
      </li>
    </ul>
    <p v-else-if="!store.carregando" class="vazio">Nenhum horário de disponibilidade cadastrado ainda.</p>
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

.formulario-card {
  margin-bottom: var(--espaco-6);
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-4);
}

.formulario__linha {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--espaco-4);
}

.campo-select {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-2);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--cor-tinta-suave);
}

.campo-select select,
.campo-select input {
  padding: var(--espaco-3) var(--espaco-4);
  border: 2px solid var(--cor-borda);
  border-radius: var(--raio-sm);
  background: var(--cor-superficie);
  font-size: 1rem;
}

.lista {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-3);
}

.lista__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--cor-superficie);
  border: 2px solid var(--cor-borda);
  border-radius: var(--raio-sm);
  padding: var(--espaco-4);
}

.lista__nome {
  font-weight: 700;
}

.lista__detalhe {
  color: var(--cor-tinta-suave);
  font-size: 0.9rem;
  margin-top: var(--espaco-1);
}

.vazio {
  color: var(--cor-tinta-fraca);
}

@media (max-width: 640px) {
  .formulario__linha {
    grid-template-columns: 1fr;
  }
}
</style>
