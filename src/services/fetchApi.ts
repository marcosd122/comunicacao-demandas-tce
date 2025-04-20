
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://seu-backend-real.com/api' 
  : 'http://localhost:3000/api';

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
    // Adicione headers de autenticação quando necessário
    // 'Authorization': `Bearer ${token}`
  },
};

export const fetchApi = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchConfig,
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao acessar ${endpoint}:`, error);
    throw error;
  }
};
