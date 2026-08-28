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

function formatarDataExtenso(valor) {
  const [ano, mes, dia] = valor.split('-')
  return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
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

      <div v-if="agendamentoConfirmado" class="confirmacao">
        <AppCard>
          <p class="confirmacao__selo">✓ Agendamento confirmado</p>
          <h2>Tudo certo, {{ agendamentoConfirmado.cliente_nome.split(' ')[0] }}!</h2>
          <p class="confirmacao__detalhe">
            {{ formatarDataExtenso(agendamentoConfirmado.data) }} às
            {{ agendamentoConfirmado.hora_inicio.slice(11, 16) }}
          </p>
        </AppCard>
      </div>

      <div v-else class="conteudo">
        <AppCard class="secao">
          <h2 class="secao__titulo">1. Escolha o serviço</h2>
          <div class="chips">
            <button
              v-for="servico in perfil.servicos"
              :key="servico.id"
              type="button"
              class="chip"
              :class="{ 'chip--ativo': servico.id === servicoSelecionadoId }"
              @click="servicoSelecionadoId = servico.id"
            >
              {{ servico.nome }} · {{ servico.duracao_minutos }}min
            </button>
          </div>
        </AppCard>

        <AppCard class="secao">
          <h2 class="secao__titulo">2. Escolha o dia</h2>
          <input v-model="data" type="date" class="campo-data" :min="new Date().toISOString().slice(0, 10)" />
        </AppCard>

        <AppCard class="secao">
          <h2 class="secao__titulo">3. Escolha o horário</h2>
          <p v-if="carregandoHorarios" class="vazio">Buscando horários…</p>
          <p v-else-if="!horarios.length" class="vazio">Nenhum horário livre nesse dia. Tente outra data.</p>
          <div v-else class="chips">
            <button
              v-for="horario in horarios"
              :key="horario"
              type="button"
              class="chip chip--horario"
              :class="{ 'chip--ativo': horario === horarioSelecionado }"
              @click="horarioSelecionado = horario"
            >
              {{ horario }}
            </button>
          </div>
        </AppCard>

        <AppCard v-if="horarioSelecionado" class="secao">
          <h2 class="secao__titulo">4. Seus dados</h2>
          <form class="formulario" @submit.prevent="confirmarAgendamento">
            <AppAlerta :mensagens="erros" />
            <AppInput v-model="clienteNome" label="Nome" obrigatorio />
            <AppInput v-model="clienteEmail" label="Email" tipo="email" obrigatorio />
            <AppInput v-model="clienteTelefone" label="Telefone (opcional)" tipo="tel" />
            <AppButton tipo="submit" :desabilitado="enviando">
              {{ enviando ? 'Confirmando…' : `Confirmar ${servicoSelecionado?.nome} às ${horarioSelecionado}` }}
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
  color: var(--cor-tinta-suave);
}

.cabecalho {
  text-align: center;
  margin-bottom: var(--espaco-7);
}

.cabecalho__etiqueta {
  color: var(--cor-primaria-escura);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.8rem;
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

.secao__titulo {
  font-size: 1.1rem;
  margin-bottom: var(--espaco-4);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--espaco-3);
}

.chip {
  padding: var(--espaco-2) var(--espaco-4);
  border-radius: var(--raio-pill);
  border: 2px solid var(--cor-borda);
  background: var(--cor-superficie);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.chip:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--cor-tinta);
}

.chip--horario {
  font-family: var(--fonte-display);
}

.chip--ativo {
  background: var(--cor-primaria);
  box-shadow: var(--sombra-deslocada-sm);
}

.campo-data {
  padding: var(--espaco-3) var(--espaco-4);
  border: 2px solid var(--cor-borda);
  border-radius: var(--raio-sm);
  font-size: 1rem;
  background: var(--cor-superficie);
}

.vazio {
  color: var(--cor-tinta-fraca);
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: var(--espaco-4);
}

.confirmacao__selo {
  color: var(--cor-sucesso);
  font-weight: 700;
  margin-bottom: var(--espaco-2);
}

.confirmacao__detalhe {
  color: var(--cor-tinta-suave);
  margin-top: var(--espaco-2);
  text-transform: capitalize;
}
</style>
