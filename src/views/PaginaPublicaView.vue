<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { mensagensDeErro } from '@/utils/erros'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppAlerta from '@/components/ui/AppAlerta.vue'

const rota = useRoute()

const carregandoPerfil = ref(true)
const naoEncontrado = ref(false)
const perfil = ref(null)

const servicoSelecionadoId = ref(null)
const data = ref(proximoDiaUtil())
const horarios = ref([])
const carregandoHorarios = ref(false)
const horarioSelecionado = ref(null)

const clienteNome = ref('')
const clienteEmail = ref('')
const clienteTelefone = ref('')
const enviando = ref(false)
const erros = ref([])
const agendamentoConfirmado = ref(null)

function proximoDiaUtil() {
  const hoje = new Date()
  hoje.setDate(hoje.getDate() + 1)
  return hoje.toISOString().slice(0, 10)
}

const servicoSelecionado = computed(() =>
  perfil.value?.servicos.find((servico) => servico.id === servicoSelecionadoId.value),
)

async function buscarPerfil() {
  carregandoPerfil.value = true
  try {
    const resposta = await api.get(`/publico/${rota.params.slug}`)
    perfil.value = resposta.data
    if (perfil.value.servicos.length) {
      servicoSelecionadoId.value = perfil.value.servicos[0].id
    }
  } catch {
    naoEncontrado.value = true
  } finally {
    carregandoPerfil.value = false
  }
}

async function buscarHorarios() {
  if (!servicoSelecionadoId.value || !data.value) return

  carregandoHorarios.value = true
  horarioSelecionado.value = null
  try {
    const resposta = await api.get(`/publico/${rota.params.slug}/horarios`, {
      params: { data: data.value, servico_id: servicoSelecionadoId.value },
    })
    horarios.value = resposta.data
  } finally {
    carregandoHorarios.value = false
  }
}

watch([servicoSelecionadoId, data], buscarHorarios)

onMounted(async () => {
  await buscarPerfil()
  await buscarHorarios()
})

async function confirmarAgendamento() {
  erros.value = []
  enviando.value = true
  try {
    const resposta = await api.post(`/publico/${rota.params.slug}/agendamentos`, {
      agendamento: {
        servico_id: servicoSelecionadoId.value,
        cliente_nome: clienteNome.value,
        cliente_email: clienteEmail.value,
        cliente_telefone: clienteTelefone.value || null,
        data: data.value,
        hora_inicio: horarioSelecionado.value,
      },
    })
    agendamentoConfirmado.value = resposta.data
  } catch (erro) {
    erros.value = mensagensDeErro(erro.response?.data?.errors)
    await buscarHorarios()
  } finally {
    enviando.value = false
  }
}

function formatarDataCurta(valor) {
  const [ano, mes, dia] = valor.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatarDataExtenso(valor) {
  const [ano, mes, dia] = valor.split('-')
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function numeroDoTicket(id) {
  return String(id).padStart(4, '0')
}
</script>

<template>
  <div class="pagina-publica">
    <div v-if="carregandoPerfil" class="estado">Carregando…</div>

    <div v-else-if="naoEncontrado" class="estado">
      <h1>Página não encontrada</h1>
      <p>Confira o link com o profissional.</p>
    </div>

    <template v-else>
      <header class="cabecalho">
        <p class="cabecalho__etiqueta">Agendar com</p>
        <h1 class="cabecalho__nome">{{ perfil.nome }}</h1>
      </header>

      <div v-if="agendamentoConfirmado" class="ticket">
        <div class="ticket__notch ticket__notch--topo" />
        <div class="ticket__notch ticket__notch--base" />

        <div class="ticket__corpo">
          <p class="ticket__selo">✓ Agendamento confirmado</p>
          <h2 class="ticket__servico">{{ servicoSelecionado?.nome }}</h2>
          <p class="ticket__cliente">{{ agendamentoConfirmado.cliente_nome }}</p>
          <p class="ticket__data">{{ formatarDataExtenso(agendamentoConfirmado.data) }}</p>
        </div>

        <div class="ticket__perfuracao" />

        <div class="ticket__canhoto">
          <span class="ticket__canhoto-rotulo">Horário</span>
          <span class="ticket__canhoto-hora">{{ agendamentoConfirmado.hora_inicio.slice(11, 16) }}</span>
          <span class="ticket__canhoto-numero">Nº {{ numeroDoTicket(agendamentoConfirmado.id) }}</span>
        </div>
      </div>

      <div v-else class="conteudo">
        <AppCard class="secao">
          <p class="secao__etapa">Etapa 1</p>
          <h2 class="secao__titulo">Escolha o serviço</h2>
          <div class="opcoes">
            <button
              v-for="servico in perfil.servicos"
              :key="servico.id"
              type="button"
              class="opcao"
              :class="{ 'opcao--ativa': servico.id === servicoSelecionadoId }"
              @click="servicoSelecionadoId = servico.id"
            >
              {{ servico.nome }} · {{ servico.duracao_minutos }}min
            </button>
          </div>
        </AppCard>

        <AppCard class="secao">
          <p class="secao__etapa">Etapa 2</p>
          <h2 class="secao__titulo">Escolha o dia</h2>
          <input v-model="data" type="date" class="campo-data" :min="new Date().toISOString().slice(0, 10)" />
        </AppCard>

        <AppCard class="secao">
          <p class="secao__etapa">Etapa 3</p>
          <h2 class="secao__titulo">Escolha o horário</h2>
          <p v-if="carregandoHorarios" class="vazio">Buscando horários…</p>
          <p v-else-if="!horarios.length" class="vazio">Nenhum horário livre nesse dia. Tente outra data.</p>
          <div v-else class="opcoes">
            <button
              v-for="horario in horarios"
              :key="horario"
              type="button"
              class="opcao opcao--horario"
              :class="{ 'opcao--ativa': horario === horarioSelecionado }"
              @click="horarioSelecionado = horario"
            >
              {{ horario }}
            </button>
          </div>
        </AppCard>

        <AppCard v-if="horarioSelecionado" class="secao">
          <p class="secao__etapa">Etapa 4</p>
          <h2 class="secao__titulo">Seus dados</h2>
          <form class="formulario" @submit.prevent="confirmarAgendamento">
            <AppAlerta :mensagens="erros" />
            <AppInput v-model="clienteNome" label="Nome" obrigatorio />
            <AppInput v-model="clienteEmail" label="Email" tipo="email" obrigatorio />
            <AppInput v-model="clienteTelefone" label="Telefone (opcional)" tipo="tel" />
            <AppButton tipo="submit" :desabilitado="enviando">
              {{ enviando ? 'Confirmando…' : `Confirmar ${formatarDataCurta(data)} às ${horarioSelecionado}` }}
            </AppButton>
          </form>
        </AppCard>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pagina-publica {
  min-height: 100vh;
  max-width: 640px;
  margin: 0 auto;
  padding: var(--espaco-7) var(--espaco-5);
}

.estado {
  text-align: center;
  padding-top: var(--espaco-8);
  color: var(--tinta-suave);
}

.cabecalho {
  text-align: center;
  margin-bottom: var(--espaco-7);
}

.cabecalho__etiqueta {
  font-family: var(--fonte-numero);
  color: var(--azul-selo);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  margin-bottom: var(--espaco-2);
}

.cabecalho__nome {
  font-size: 2.5rem;
}

.conteudo {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-5);
}

.secao__etapa {
  font-family: var(--fonte-numero);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tinta-fraca);
  margin-bottom: var(--espaco-1);
}

.secao__titulo {
  font-size: 1.2rem;
  margin-bottom: var(--espaco-4);
}

.opcoes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--espaco-2);
}

.opcao {
  padding: var(--espaco-2) var(--espaco-4);
  border-radius: 0;
  border: 2px solid var(--contracapa-forte);
  background: var(--papel);
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.1s ease, background-color 0.1s ease, color 0.1s ease;
}

.opcao:hover {
  border-color: var(--azul-selo);
}

.opcao--horario {
  font-family: var(--fonte-numero);
}

.opcao--ativa {
  background: var(--azul-selo);
  border-color: var(--azul-selo);
  color: var(--papel);
}

.campo-data {
  padding: var(--espaco-3) var(--espaco-4);
  border: 2px solid var(--contracapa-forte);
  border-radius: 0;
  font-size: 1rem;
  background: var(--papel);
}

.campo-data:focus {
  outline: none;
  border-color: var(--azul-selo);
}

.vazio {
  color: var(--tinta-fraca);
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-4);
}

/* Ticket de confirmação */
.ticket {
  position: relative;
  display: flex;
  background: var(--papel);
  border: 2px solid var(--tinta);
  overflow: hidden;
}

.ticket__corpo {
  flex: 1;
  padding: var(--espaco-6) var(--espaco-5);
}

.ticket__selo {
  color: var(--verde-carimbo);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  margin-bottom: var(--espaco-3);
}

.ticket__servico {
  font-size: 1.6rem;
  margin-bottom: var(--espaco-2);
}

.ticket__cliente {
  font-weight: 600;
}

.ticket__data {
  color: var(--tinta-suave);
  text-transform: capitalize;
  margin-top: var(--espaco-1);
  font-size: 0.9rem;
}

.ticket__perfuracao {
  position: relative;
  width: 0;
  border-left: 2px dashed var(--contracapa-forte);
}

.ticket__notch {
  position: absolute;
  left: calc(72% - 12px);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--papel-fundo);
  z-index: 1;
}

.ticket__notch--topo {
  top: -12px;
}

.ticket__notch--base {
  bottom: -12px;
}

.ticket__canhoto {
  width: 160px;
  flex-shrink: 0;
  padding: var(--espaco-5) var(--espaco-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--espaco-2);
  background: var(--led-fundo);
  text-align: center;
}

.ticket__canhoto-rotulo {
  font-family: var(--fonte-numero);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--papel-fundo);
  opacity: 0.6;
}

.ticket__canhoto-hora {
  font-family: var(--fonte-numero);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--led);
}

.ticket__canhoto-numero {
  font-family: var(--fonte-numero);
  font-size: 0.7rem;
  color: var(--papel-fundo);
  opacity: 0.6;
}

@media (max-width: 480px) {
  .ticket {
    flex-direction: column;
  }

  .ticket__perfuracao {
    width: auto;
    height: 0;
    border-left: none;
    border-top: 2px dashed var(--contracapa-forte);
  }

  .ticket__notch {
    left: auto;
    top: calc(72% - 12px) !important;
    bottom: auto !important;
  }

  .ticket__notch--topo {
    left: -12px;
  }

  .ticket__notch--base {
    right: -12px;
    left: auto;
  }

  .ticket__canhoto {
    width: auto;
    flex-direction: row;
  }
}
</style>
