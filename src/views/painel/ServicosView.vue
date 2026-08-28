<script setup>
import { onMounted, ref } from 'vue'
import { useServicosStore } from '@/stores/servicos'
import { mensagensDeErro } from '@/utils/erros'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppAlerta from '@/components/ui/AppAlerta.vue'

const store = useServicosStore()

const nome = ref('')
const duracaoMinutos = ref(30)
const valor = ref('')
const enviando = ref(false)
const erros = ref([])

onMounted(() => store.buscar())

async function criar() {
  erros.value = []
  enviando.value = true
  try {
    await store.criar({
      nome: nome.value,
      duracao_minutos: duracaoMinutos.value,
      valor: valor.value || null,
    })
    nome.value = ''
    duracaoMinutos.value = 30
    valor.value = ''
  } catch (erro) {
    erros.value = mensagensDeErro(erro.response?.data?.errors)
  } finally {
    enviando.value = false
  }
}

async function remover(id) {
  await store.remover(id)
}

function formatarValor(valor) {
  if (valor === null || valor === undefined) return null
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function numeroDoTicket(indice) {
  return String(indice + 1).padStart(3, '0')
}
</script>

<template>
  <section>
    <header class="cabecalho">
      <p class="cabecalho__guiche">Guichê 01</p>
      <h1>Serviços</h1>
      <p class="cabecalho__descricao">O que você oferece, e quanto tempo cada atendimento leva.</p>
    </header>

    <AppCard class="formulario-card">
      <form class="formulario" @submit.prevent="criar">
        <AppAlerta :mensagens="erros" />
        <div class="formulario__linha">
          <AppInput v-model="nome" label="Nome do serviço" obrigatorio placeholder="Corte de cabelo" />
          <AppInput v-model.number="duracaoMinutos" label="Duração (minutos)" tipo="number" obrigatorio />
          <AppInput v-model="valor" label="Valor (opcional)" tipo="number" placeholder="50.00" />
        </div>
        <AppButton tipo="submit" :desabilitado="enviando">
          {{ enviando ? 'Adicionando…' : '+ Adicionar serviço' }}
        </AppButton>
      </form>
    </AppCard>

    <ul v-if="store.lista.length" class="recibo">
      <li v-for="(servico, indice) in store.lista" :key="servico.id" class="recibo__linha">
        <span class="recibo__numero">{{ numeroDoTicket(indice) }}</span>
        <div class="recibo__corpo">
          <p class="recibo__nome">{{ servico.nome }}</p>
          <p class="recibo__detalhe">
            {{ servico.duracao_minutos }} min
            <span v-if="formatarValor(servico.valor)"> · {{ formatarValor(servico.valor) }}</span>
          </p>
        </div>
        <AppButton variante="fantasma" @click="remover(servico.id)">Remover</AppButton>
      </li>
    </ul>
    <p v-else-if="!store.carregando" class="vazio">Você ainda não cadastrou nenhum serviço.</p>
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

.recibo__numero {
  font-family: var(--fonte-numero);
  font-size: 0.8rem;
  color: var(--tinta-fraca);
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
