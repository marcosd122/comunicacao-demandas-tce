
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Solicitacao } from '@/types';

const AdminAvaliacoes = () => {
  const navigate = useNavigate();
  const [tipoFilter, setTipoFilter] = useState<string | null>(null);

  const { data: solicitacoes, isLoading } = useQuery({
    queryKey: ['solicitacoes'],
    queryFn: api.getSolicitacoes
  });

  // Filtrar apenas solicitações que foram avaliadas
  const avaliacoes = solicitacoes ? solicitacoes.filter(s => s.avaliacao) : [];

  // Aplicar filtro de tipo se necessário
  const filteredAvaliacoes = tipoFilter 
    ? avaliacoes.filter(s => s.tipo === tipoFilter)
    : avaliacoes;

  const getGrauSatisfacaoColor = (grau: string) => {
    switch (grau) {
      case 'Satisfeito':
        return 'bg-green-100 text-green-800';
      case 'Parcialmente Satisfeito':
        return 'bg-yellow-100 text-yellow-800';
      case 'Não Satisfeito':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Layout 
      title="Avaliações" 
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Avaliações' }
      ]}
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Solicitações Avaliadas</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant={tipoFilter === null ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setTipoFilter(null)}
            >
              Todos
            </Button>
            <Button 
              variant={tipoFilter === 'Divulgação' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setTipoFilter('Divulgação')}
            >
              Divulgação
            </Button>
            <Button 
              variant={tipoFilter === 'Arte/Material Gráfico' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setTipoFilter('Arte/Material Gráfico')}
            >
              Arte
            </Button>
            <Button 
              variant={tipoFilter === 'Cobertura' ? "secondary" : "outline"} 
              size="sm"
              onClick={() => setTipoFilter('Cobertura')}
            >
              Cobertura
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Carregando avaliações...</div>
        ) : filteredAvaliacoes.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitante
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grau de Satisfação
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Características
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAvaliacoes.map((item: Solicitacao) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(item.avaliacao!.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.solicitante.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        className={getGrauSatisfacaoColor(item.avaliacao!.grauSatisfacao)} 
                        variant="outline"
                      >
                        {item.avaliacao!.grauSatisfacao}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.avaliacao!.caracteristicas.slice(0, 2).map((caracteristica, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100">
                            {caracteristica}
                          </Badge>
                        ))}
                        {item.avaliacao!.caracteristicas.length > 2 && (
                          <Badge variant="outline" className="bg-gray-100">
                            +{item.avaliacao!.caracteristicas.length - 2}
                          </Badge>
                        )}
                      </div>
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
            
            <div className="flex justify-between items-center p-4 border-t">
              <div className="text-sm text-gray-500">
                Mostrando {filteredAvaliacoes.length} de {avaliacoes.length} avaliações
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <span className="text-sm">
                  1-{filteredAvaliacoes.length} de {avaliacoes.length}
                </span>
                <Button variant="outline" size="sm" disabled={true}>
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm p-6">
            Nenhuma avaliação encontrada com os filtros aplicados.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminAvaliacoes;
