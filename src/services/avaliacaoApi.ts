
import { Avaliacao } from '@/types';
import { fetchApi, delay } from './fetchApi';
import { solicitacaoApi } from './solicitacaoApi';

export const avaliacaoApi = {
  avaliarSolicitacao: async (
    solicitacaoId: string, 
    avaliacao: Omit<Avaliacao, 'id' | 'solicitacaoId' | 'createdAt'>
  ): Promise<Avaliacao> => {
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
      await delay(500);
      const rawSolicitacoes = solicitacaoApi.getRawSolicitacoes();
      const index = rawSolicitacoes.findIndex(s => s.id === solicitacaoId);
      if (index === -1) throw new Error('Solicitação não encontrada');
      const novaAvaliacao: Avaliacao = {
        id: Math.random().toString(36).substring(2, 11),
        solicitacaoId,
        entregaNoTempoEsperado: avaliacao.entregaNoTempoEsperado,
        atendeuExpectativas: avaliacao.atendeuExpectativas,
        grauSatisfacao: avaliacao.grauSatisfacao,
        caracteristicas: avaliacao.caracteristicas,
        outrasCaracteristicas: avaliacao.outrasCaracteristicas,
        createdAt: new Date().toISOString()
      };
      rawSolicitacoes[index].avaliacao = novaAvaliacao;
      solicitacaoApi.setRawSolicitacoes(rawSolicitacoes);
      return novaAvaliacao;
    }
    return fetchApi(`/solicitacoes/${solicitacaoId}/avaliacao`, {
      method: 'POST',
      body: JSON.stringify(avaliacao)
    });
  },

  getAvaliacoes: async (): Promise<Avaliacao[]> => {
    if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
      await delay(500);
      const solicitacoes = solicitacaoApi.getRawSolicitacoes();
      return solicitacoes
        .filter(s => s.avaliacao)
        .map(s => s.avaliacao!) as Avaliacao[];
    }
    return fetchApi('/avaliacoes');
  }
};
