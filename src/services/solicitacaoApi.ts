
import { Solicitacao, SolicitacaoStatus, SolicitacaoTipo } from '@/types';
import { fetchApi, delay } from './fetchApi';

let solicitacoes: Solicitacao[] = [
  {
    id: '1',
    tipo: 'Divulgação',
    status: 'Concluída',
    dataSolicitacao: '2023-11-17T18:32:01',
    solicitante: {
      id: '123',
      nome: 'USUÁRIO 464578',
      email: 'usuario@tce.go.gov.br'
    },
    ramal: '6299887766',
    email: 'usuario@tce.go.gov.br',
    dataPublicacao: '2023-11-21T14:21:00',
    mensagem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent mattis sollicitudin elit, sed ultricies nulla tristique quis. Nullam eleifend magna eu gravida felis consequat sed. Duis sagittis blandit metus fermentum et.',
    aprovadoGestor: true,
    anexos: [
      {
        id: '1',
        name: 'arquivo.jpg',
        size: 614000,
        url: '#',
        createdAt: '2023-11-17T18:32:01'
      }
    ],
    anexosConclusao: []
  },
  {
    id: '2',
    tipo: 'Divulgação',
    status: 'Rejeitada',
    dataSolicitacao: '2023-11-16T20:08:26',
    solicitante: {
      id: '123',
      nome: 'USUÁRIO 464578',
      email: 'usuario@tce.go.gov.br'
    },
    ramal: '6299887766',
    email: 'usuario@tce.go.gov.br',
    dataPublicacao: '2023-11-17T16:00:00',
    mensagem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    aprovadoGestor: true,
    anexos: [],
    motivoRejeicao: 'Informações insuficientes para divulgação'
  },
  {
    id: '3',
    tipo: 'Divulgação',
    status: 'Em Andamento',
    dataSolicitacao: '2023-11-16T20:09:01',
    solicitante: {
      id: '123',
      nome: 'USUÁRIO 464578',
      email: 'usuario@tce.go.gov.br'
    },
    ramal: '6299887766',
    email: 'usuario@tce.go.gov.br',
    dataPublicacao: '2023-11-17T16:00:00',
    mensagem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    aprovadoGestor: false,
    anexos: []
  },
  {
    id: '4',
    tipo: 'Divulgação',
    status: 'Aguardando Atendimento',
    dataSolicitacao: '2023-11-16T20:08:33',
    solicitante: {
      id: '123',
      nome: 'USUÁRIO 464578',
      email: 'usuario@tce.go.gov.br'
    },
    ramal: '6299887766',
    email: 'usuario@tce.go.gov.br',
    dataPublicacao: '2023-11-17T16:00:00',
    mensagem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    aprovadoGestor: true,
    anexos: []
  },
  {
    id: '5',
    tipo: 'Arte/Material Gráfico',
    status: 'Aguardando Atendimento',
    dataSolicitacao: '2023-11-16T20:08:07',
    solicitante: {
      id: '123',
      nome: 'USUÁRIO 464578',
      email: 'usuario@tce.go.gov.br'
    },
    ramal: '6299995555',
    email: 'usuario@tce.go.gov.br',
    dataExpectativa: '2023-11-23T16:26:00',
    tipoMaterial: 'Arte Para Instagram/mapas/diagramas/quadros',
    publicoAlvo: 'Aberto à Sociedade',
    detalhamento: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    aprovadoGestor: true,
    anexos: []
  }
];

export const solicitacaoApi = {
  getSolicitacoes: async (): Promise<Solicitacao[]> => {
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
      await delay(500);
      return [...solicitacoes];
    }
    return fetchApi('/solicitacoes');
  },

  getSolicitacao: async (id: string): Promise<Solicitacao | null> => {
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
      await delay(300);
      const solicitacao = solicitacoes.find(s => s.id === id);
      return solicitacao ? { ...solicitacao } : null;
    }
    return fetchApi(`/solicitacoes/${id}`);
  },

  criarSolicitacao: async (data: Partial<Solicitacao>): Promise<Solicitacao> => {
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
      await delay(800);
      const novaSolicitacao: Solicitacao = {
        id: Math.random().toString(36).substring(2, 11),
        tipo: data.tipo as SolicitacaoTipo,
        status: 'Aguardando Atendimento',
        dataSolicitacao: new Date().toISOString(),
        solicitante: {
          id: '123',
          nome: 'USUÁRIO 464578',
          email: data.email || 'usuario@tce.go.gov.br'
        },
        ramal: data.ramal || '',
        email: data.email,
        dataPublicacao: data.dataPublicacao,
        dataExpectativa: data.dataExpectativa,
        dataEvento: data.dataEvento,
        mensagem: data.mensagem,
        tipoMaterial: data.tipoMaterial,
        publicoAlvo: data.publicoAlvo,
        detalhamento: data.detalhamento,
        descricaoEvento: data.descricaoEvento,
        localEvento: data.localEvento,
        numeroParticipantes: data.numeroParticipantes,
        membrosPresentes: data.membrosPresentes,
        aprovadoGestor: data.aprovadoGestor || false,
        anexos: data.anexos || []
      };
      solicitacoes.push(novaSolicitacao);
      return novaSolicitacao;
    }
    return fetchApi('/solicitacoes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  atualizarStatusSolicitacao: async (
    id: string, 
    status: SolicitacaoStatus, 
    dados?: { motivoRejeicao?: string; linkConclusao?: string; anexosConclusao?: any[] }
  ): Promise<Solicitacao | null> => {
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
      await delay(500);
      const index = solicitacoes.findIndex(s => s.id === id);
      if (index === -1) return null;
      solicitacoes[index] = {
        ...solicitacoes[index],
        status,
        ...dados
      };
      return solicitacoes[index];
    }
    return fetchApi(`/solicitacoes/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, ...dados })
    });
  },

  excluirSolicitacao: async (id: string): Promise<boolean> => {
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
      await delay(500);
      const index = solicitacoes.findIndex(s => s.id === id);
      if (index === -1) return false;
      solicitacoes.splice(index, 1);
      return true;
    }
    return fetchApi(`/solicitacoes/${id}`, {
      method: 'DELETE'
    }).then(() => true);
  },
  // Apenas para uso do mock, outras APIs reais devem ser chamadas de avaliacaoApi
  getRawSolicitacoes: () => solicitacoes,
  setRawSolicitacoes: (arr: Solicitacao[]) => { solicitacoes = arr; }
};
