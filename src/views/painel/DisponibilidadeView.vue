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
      <p class="cabecalho__guiche">Guichê 02</p>
      <h1>Disponibilidade</h1>
      <p class="cabecalho__descricao">Os dias e horários em que você atende. Pode cadastrar mais de um bloco por dia.</p>
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

    <ul v-if="store.lista.length" class="recibo">
      <li v-for="disponibilidade in store.lista" :key="disponibilidade.id" class="recibo__linha">
        <span class="recibo__dia">{{ DIAS[disponibilidade.dia_semana].slice(0, 3) }}</span>
        <div class="recibo__corpo">
          <p class="recibo__nome">{{ DIAS[disponibilidade.dia_semana] }}</p>
          <p class="recibo__detalhe">
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
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--tinta-suave);
}

.campo-select select,
.campo-select input {
  padding: var(--espaco-3) var(--espaco-3);
  border: none;
  border-bottom: 2px solid var(--contracapa-forte);
  border-radius: 0;
  background: transparent;
  font-size: 1rem;
  text-transform: none;
  letter-spacing: normal;
}

.campo-select select:focus,
.campo-select input:focus {
  outline: none;
  border-color: var(--azul-selo);
}

.recibo {
  border-top: var(--traco-forte);
}

.recibo__linha {
  display: flex;
  align-items: center;
  gap: var(--espaco-4);
  padding: var(--espaco-4) 0;
  border-bottom: var(--traco);
}

.recibo__dia {
  font-family: var(--fonte-numero);
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--tinta-fraca);
  width: 32px;
}

.recibo__corpo {
  flex: 1;
}

.recibo__nome {
  font-weight: 700;
}

.recibo__detalhe {
  color: var(--tinta-suave);
  font-size: 0.9rem;
  margin-top: var(--espaco-1);
  font-family: var(--fonte-numero);
}

.vazio {
  color: var(--tinta-fraca);
  padding: var(--espaco-4) 0;
}

@media (max-width: 640px) {
  .formulario__linha {
    grid-template-columns: 1fr;
  }
}
</style>
