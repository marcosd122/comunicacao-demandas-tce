
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, remember: boolean): Promise<boolean> => {
    try {
      // Em um sistema real, esta seria uma chamada de API
      // Simulando autenticação para demonstração
      if (username && password) {
        const isAdmin = username.includes('admin');
        const userData: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: isAdmin ? 'Administrador' : 'Usuário Comum',
          email: username,
          isAdmin: isAdmin
        };
        
        setUser(userData);
        
        if (remember) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo ${userData.name}!`,
        });
        
        return true;
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao realizar login",
        description: "Usuário ou senha incorretos",
      });
      
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao realizar login",
        description: "Ocorreu um erro ao tentar realizar o login",
      });
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
