const ROTULOS = {
  nome: "Nome",
  email: "Email",
  senha: "Senha",
  duracao_minutos: "Duração",
  valor: "Valor",
  dia_semana: "Dia da semana",
  hora_inicio: "Hora de início",
  hora_fim: "Hora de fim",
  cliente_nome: "Nome do cliente",
  cliente_email: "Email do cliente",
  data: "Data",
  base: "",
}

export function mensagensDeErro(errosDaApi) {
  if (!errosDaApi) return ["Não foi possível completar a ação. Tente novamente."]

  return Object.entries(errosDaApi).flatMap(([campo, mensagens]) => {
    const rotulo = ROTULOS[campo] ?? campo
    return mensagens.map((mensagem) => (rotulo ? `${rotulo}: ${mensagem}` : mensagem))
  })
}
