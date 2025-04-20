
import { solicitacaoApi } from './solicitacaoApi';
import { avaliacaoApi } from './avaliacaoApi';

// Export a console logger for debugging
export const logError = (error: any) => {
  console.error("API Error:", error);
};

export const api = {
  ...solicitacaoApi,
  ...avaliacaoApi,
};
