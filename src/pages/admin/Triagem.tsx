
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Solicitacao } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminTriagem = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [tipoFilter, setTipoFilter] = useState<string | null>(null);

  const { data: solicitacoes, isLoading, refetch } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: api.getSolicitacoes
  });

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

  const filteredSolicitacoes = solicitacoes ? solicitacoes.filter(solicitacao => {
    if (statusFilter && solicitacao.status !== statusFilter) return false;
    if (tipoFilter && solicitacao.tipo !== tipoFilter) return false;
    return true;
  }) : [];

  return (
    <Layout 
      title="Demandas da Comunicação (Admin)" 
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Triagem' }
      ]}
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Solicitações Enviadas</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-64">
            <Select 
              value={statusFilter || ""} 
              onValueChange={value => setStatusFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Status</SelectItem>
                <SelectItem value="Aguardando Atendimento">Aguardando Atendimento</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
                <SelectItem value="Rejeitada">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-64">
            <Select 
              value={tipoFilter || ""} 
              onValueChange={value => setTipoFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Tipos</SelectItem>
                <SelectItem value="Divulgação">Divulgação</SelectItem>
                <SelectItem value="Arte/Material Gráfico">Arte/Material Gráfico</SelectItem>
                <SelectItem value="Cobertura">Cobertura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Carregando solicitações...</div>
        ) : filteredSolicitacoes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome Solicitante
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
                {filteredSolicitacoes.map((item: Solicitacao) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.dataSolicitacao).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.solicitante.nome}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/solicitacao/${item.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-between items-center mt-4 px-6">
              <div className="text-sm text-gray-500">
                Mostrando {filteredSolicitacoes.length} de {solicitacoes.length} solicitações
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <span className="text-sm">
                  1-5 de 35
                </span>
                <Button variant="outline" size="sm">
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma solicitação encontrada com os filtros aplicados.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminTriagem;
