
export type SolicitacaoTipo = 'Divulgação' | 'Arte/Material Gráfico' | 'Cobertura';

export type SolicitacaoStatus = 'Aguardando Atendimento' | 'Em Andamento' | 'Concluída' | 'Rejeitada';

export type ArquivoAnexo = {
  id: string;
  name: string;
  size: number;
  url: string;
  createdAt: string;
};

export type Solicitacao = {
  id: string;
  tipo: SolicitacaoTipo;
  status: SolicitacaoStatus;
  dataSolicitacao: string;
  solicitante: {
    id: string;
    nome: string;
    email: string;
  };
  ramal: string;
  email?: string;
  dataPublicacao?: string;
  dataExpectativa?: string;
  dataEvento?: string;
  mensagem?: string;
  tipoMaterial?: string;
  publicoAlvo?: string;
  detalhamento?: string;
  descricaoEvento?: string;
  localEvento?: string;
  numeroParticipantes?: string;
  membrosPresentes?: string;
  aprovadoGestor: boolean;
  anexos: ArquivoAnexo[];
  anexosConclusao?: ArquivoAnexo[];
  motivoRejeicao?: string;
  linkConclusao?: string;
  avaliacao?: Avaliacao;
};

export type Avaliacao = {
  id: string;
  solicitacaoId: string;
  entregaNoTempoEsperado: boolean;
  atendeuExpectativas: boolean;
  grauSatisfacao: 'Não Satisfeito' | 'Satisfeito' | 'Parcialmente Satisfeito' | 'Não Satisfeito';
  caracteristicas: string[];
  outrasCaracteristicas?: string;
  createdAt: string;
};
