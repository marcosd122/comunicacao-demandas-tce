
import { solicitacaoApi } from './solicitacaoApi';
import { avaliacaoApi } from './avaliacaoApi';

export const api = {
  ...solicitacaoApi,
  ...avaliacaoApi,
};
