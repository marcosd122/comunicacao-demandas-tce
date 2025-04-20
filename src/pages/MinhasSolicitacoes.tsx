
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Solicitacao } from '@/types';
import { Eye, X, Star, Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';

const MinhasSolicitacoes = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: solicitacoes, isLoading, refetch } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: api.getSolicitacoes
  });

  const handleExcluir = async (id: string) => {
    try {
      await api.excluirSolicitacao(id);
      toast({
        title: "Solicitação excluída",
        description: "A solicitação foi excluída com sucesso",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir a solicitação",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluída':
        return 'bg-green-100 text-green-800';
      case 'Rejeitada':
        return 'bg-red-100 text-red-800';
      case 'Em Andamento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
  };

  const handleNavigate = () => {
    if (selectedType === 'Divulgação') {
      navigate('/solicitar/divulgacao');
    } else if (selectedType === 'Arte/Material Gráfico') {
      navigate('/solicitar/arte');
    } else if (selectedType === 'Cobertura') {
      navigate('/solicitar/cobertura');
    }
  };

  return (
    <Layout 
      title="Demandas da Comunicação" 
      breadcrumbs={[{ label: 'Solicitar Demanda' }]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <img 
                src="/lovable-uploads/77df1900-f6c5-4458-89d8-54fcb43ce106.png" 
                alt="Divulgação" 
                className="h-8 mr-2" 
              />
              Divulgação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Solicite aqui uma nova divulgação.
            </p>
            <div className="flex justify-end">
              <Link 
                to="/solicitar/divulgacao" 
                className="bg-tcego-blue text-white px-4 py-2 rounded-md text-sm hover:bg-tcego-blue/90 transition-colors"
              >
                Acessar
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <img 
                src="/lovable-uploads/50a2d3f2-9429-4c30-86c9-e0e05ba01655.png" 
                alt="Arte/Material Gráfico" 
                className="h-8 mr-2" 
              />
              Arte/Material Gráfico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Solicite aqui uma nova arte.
            </p>
            <div className="flex justify-end">
              <Link 
                to="/solicitar/arte" 
                className="bg-tcego-blue text-white px-4 py-2 rounded-md text-sm hover:bg-tcego-blue/90 transition-colors"
              >
                Acessar
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <img 
                src="/lovable-uploads/6d84806f-a71c-4409-91d1-7a11a0f98877.png" 
                alt="Cobertura" 
                className="h-8 mr-2" 
              />
              Cobertura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Solicite aqui uma nova cobertura.
            </p>
            <div className="flex justify-end">
              <Link 
                to="/solicitar/cobertura" 
                className="bg-tcego-blue text-white px-4 py-2 rounded-md text-sm hover:bg-tcego-blue/90 transition-colors"
              >
                Acessar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Minhas Solicitações</h2>
        
        {isLoading ? (
          <div className="text-center py-8">Carregando solicitações...</div>
        ) : solicitacoes && solicitacoes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data da Solicitação
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Situação
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitacoes.map((item: Solicitacao) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.dataSolicitacao).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`Solicitação de ${item.tipo}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(item.status)} variant="outline">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/solicitacao/${item.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {item.status === 'Concluída' && !item.avaliacao && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/avaliar/${item.id}`)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {item.status === 'Aguardando Atendimento' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExcluir(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Você ainda não possui solicitações.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MinhasSolicitacoes;
