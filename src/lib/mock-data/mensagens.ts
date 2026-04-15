export interface Mensagem {
  id: string;
  conversa_id: string;
  autor_membro_id: string;
  tipo: "livre" | "template_pergunta" | "template_resposta";
  conteudo: string;
  template_id?: string;
  resposta_a_mensagem_id?: string;
  enviada_em: string;
  lida_em?: string;
}

export const mensagens: Mensagem[] = [
  // conv-5a
  {
    id: "msg-5a-1",
    conversa_id: "conv-5a",
    autor_membro_id: "mem-arcelormittal-owner",
    tipo: "livre",
    conteudo:
      "Oi SegWork, a candidatura de vocês foi shortlistada. Podemos agendar uma conversa rápida essa semana?",
    enviada_em: "2026-04-07T09:00:00",
    lida_em: "2026-04-07T09:30:00",
  },
  {
    id: "msg-5a-2",
    conversa_id: "conv-5a",
    autor_membro_id: "mem-segwork-owner",
    tipo: "livre",
    conteudo: "Com certeza. Temos quinta ou sexta disponíveis.",
    enviada_em: "2026-04-07T10:15:00",
    lida_em: "2026-04-07T11:00:00",
  },
  {
    id: "msg-5a-3",
    conversa_id: "conv-5a",
    autor_membro_id: "mem-arcelormittal-owner",
    tipo: "template_pergunta",
    conteudo: "Disponibilidade para visita técnica em 10/04/2026?",
    template_id: "tpl-visita-tecnica",
    enviada_em: "2026-04-09T16:00:00",
    lida_em: "2026-04-10T08:00:00",
  },
  {
    id: "msg-5a-4",
    conversa_id: "conv-5a",
    autor_membro_id: "mem-segwork-owner",
    tipo: "template_resposta",
    conteudo: "Sim, confirmado. Estaremos na planta às 09:00 de 10/04.",
    template_id: "tpl-visita-tecnica",
    resposta_a_mensagem_id: "msg-5a-3",
    enviada_em: "2026-04-10T10:30:00",
  },
  // conv-5b
  {
    id: "msg-5b-1",
    conversa_id: "conv-5b",
    autor_membro_id: "mem-arcelormittal-owner",
    tipo: "livre",
    conteudo: "Ambiental Solutions, vocês estão na shortlist. Aguardamos proposta formal.",
    enviada_em: "2026-04-08T09:15:00",
    lida_em: "2026-04-08T10:00:00",
  },
  {
    id: "msg-5b-2",
    conversa_id: "conv-5b",
    autor_membro_id: "mem-ambiental-owner",
    tipo: "livre",
    conteudo: "Obrigado! Enviaremos até o fim da semana.",
    enviada_em: "2026-04-09T14:15:00",
  },
  // conv-5c (arquivada)
  {
    id: "msg-5c-1",
    conversa_id: "conv-5c",
    autor_membro_id: "mem-arcelormittal-owner",
    tipo: "livre",
    conteudo: "TechMinas, parabéns pela shortlist.",
    enviada_em: "2026-04-08T10:00:00",
  },
  {
    id: "msg-5c-2",
    conversa_id: "conv-5c",
    autor_membro_id: "mem-techminas-owner",
    tipo: "livre",
    conteudo: "Infelizmente vamos retirar a candidatura — equipe foi realocada.",
    enviada_em: "2026-04-12T11:00:00",
  },
  // conv-ct-7 (encerrada)
  {
    id: "msg-ct-7-1",
    conversa_id: "conv-ct-7",
    autor_membro_id: "mem-vale-admin",
    tipo: "livre",
    conteudo: "Projeto concluído com sucesso. Reviews liberadas.",
    enviada_em: "2026-03-12T17:00:00",
  },
  {
    id: "msg-ct-7-2",
    conversa_id: "conv-ct-7",
    autor_membro_id: "mem-techminas-owner",
    tipo: "livre",
    conteudo: "Obrigado pela parceria! Ficamos à disposição para próximos projetos.",
    enviada_em: "2026-03-12T17:30:00",
  },
  // conv-ct-9 (em execução)
  {
    id: "msg-ct-9-1",
    conversa_id: "conv-ct-9",
    autor_membro_id: "mem-usiminas-owner",
    tipo: "livre",
    conteudo: "Início do contrato confirmado para 20/01.",
    enviada_em: "2026-01-05T11:00:00",
    lida_em: "2026-01-05T11:30:00",
  },
  {
    id: "msg-ct-9-2",
    conversa_id: "conv-ct-9",
    autor_membro_id: "mem-techminas-owner",
    tipo: "livre",
    conteudo: "Equipe mobilizada. Relatório de progresso sexta-feira.",
    enviada_em: "2026-04-08T09:45:00",
  },
];

export function getMensagensByConversa(conversa_id: string): Mensagem[] {
  return mensagens.filter((m) => m.conversa_id === conversa_id);
}
