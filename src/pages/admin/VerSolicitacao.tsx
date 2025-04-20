import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Solicitacao, SolicitacaoStatus } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminVerSolicitacao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['solicitacao', id],
    queryFn: () => api.getSolicitacao(id || '')
  });

  useEffect(() => {
    if (data) {
      setSolicitacao(data);
    }
  }, [data]);

  const handleStatusChange = async (novoStatus: string) => {
    try {
      if (!id) return;

      const additionalData: { motivoRejeicao?: string } = {};
      
      // Se o status for Rejeitada, solicitar motivo
      if (novoStatus === 'Rejeitada') {
        const motivo = window.prompt('Por favor, informe o motivo da rejeição:');
        if (!motivo) return; // Cancela se não informar motivo
        additionalData.motivoRejeicao = motivo;
      }

      await api.atualizarStatusSolicitacao(id, novoStatus as SolicitacaoStatus, additionalData);
      
      toast({
        title: "Status atualizado",
        description: "O status da solicitação foi atualizado com sucesso.",
      });
      
      refetch(); // Recarrega os dados
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da solicitação.",
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (isLoading) {
    return (
      <Layout title="Carregando..." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Visualizando Solicitação' }]}>
        <div className="flex justify-center items-center h-64">
          <p>Carregando detalhes da solicitação...</p>
        </div>
      </Layout>
    );
  }

  if (error || !solicitacao) {
    return (
      <Layout title="Erro" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Erro' }]}>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">Erro ao carregar a solicitação</p>
          <Button onClick={() => navigate('/admin/triagem')}>Voltar</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={`Solicitação de ${solicitacao.tipo}`} 
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Triagem', href: '/admin/triagem' },
        { label: `Solicitação de ${solicitacao.tipo}` }
      ]}
    >
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/triagem')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(solicitacao.status)} variant="outline">
            Status Atual: {solicitacao.status}
          </Badge>
          
          <Select
            value={solicitacao.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Alterar Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aguardando Atendimento">Aguardando Atendimento</SelectItem>
              <SelectItem value="Em Andamento">Em Andamento</SelectItem>
              <SelectItem value="Concluída">Concluída</SelectItem>
              <SelectItem value="Rejeitada">Rejeitada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Detalhes da Solicitação</h2>
            <p className="text-gray-500">
              Solicitado em {formatDateTime(solicitacao.dataSolicitacao)}
            </p>
          </div>
          <Badge className={getStatusColor(solicitacao.status)} variant="outline">
            {solicitacao.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Informações Gerais</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Ramal/WhatsApp</p>
                <p>{solicitacao.ramal}</p>
              </div>
              {solicitacao.email && (
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p>{solicitacao.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Aprovado pelo gestor</p>
                <p>{solicitacao.aprovadoGestor ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Detalhes Específicos</h3>
            <div className="space-y-3">
              {solicitacao.dataPublicacao && (
                <div>
                  <p className="text-sm text-gray-500">Data de Publicação</p>
                  <p>{formatDateTime(solicitacao.dataPublicacao)}</p>
                </div>
              )}
              {solicitacao.dataExpectativa && (
                <div>
                  <p className="text-sm text-gray-500">Expectativa de Atendimento</p>
                  <p>{formatDateTime(solicitacao.dataExpectativa)}</p>
                </div>
              )}
              {solicitacao.dataEvento && (
                <div>
                  <p className="text-sm text-gray-500">Data do Evento</p>
                  <p>{formatDateTime(solicitacao.dataEvento)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo específico por tipo */}
        <div className="mt-6">
          {solicitacao.mensagem && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Mensagem</h3>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {solicitacao.mensagem}
              </div>
            </div>
          )}

          {solicitacao.tipoMaterial && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Tipo de Material</h3>
              <p>{solicitacao.tipoMaterial}</p>
            </div>
          )}

          {solicitacao.publicoAlvo && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Público Alvo</h3>
              <p>{solicitacao.publicoAlvo}</p>
            </div>
          )}

          {solicitacao.detalhamento && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Detalhamento</h3>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {solicitacao.detalhamento}
              </div>
            </div>
          )}

          {solicitacao.descricaoEvento && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Descrição do Evento</h3>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {solicitacao.descricaoEvento}
              </div>
            </div>
          )}

          {solicitacao.localEvento && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Local do Evento</h3>
              <p>{solicitacao.localEvento}</p>
            </div>
          )}

          {solicitacao.numeroParticipantes && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Número de Participantes</h3>
              <p>{solicitacao.numeroParticipantes}</p>
            </div>
          )}

          {solicitacao.membrosPresentes && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Membros Presentes</h3>
              <p>{solicitacao.membrosPresentes}</p>
            </div>
          )}
        </div>

        {/* Anexos */}
        {solicitacao.anexos && solicitacao.anexos.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Anexos do Solicitante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {solicitacao.anexos.map((anexo) => (
                <div key={anexo.id} className="border rounded-md p-3 flex items-center">
                  <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md mr-3">
                    <FileIcon />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{anexo.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(anexo.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anexos de conclusão */}
        {solicitacao.anexosConclusao && solicitacao.anexosConclusao.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Anexos de Conclusão</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {solicitacao.anexosConclusao.map((anexo) => (
                <div key={anexo.id} className="border rounded-md p-3 flex items-center">
                  <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md mr-3">
                    <FileIcon />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{anexo.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(anexo.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Link de conclusão */}
        {solicitacao.linkConclusao && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Link de Conclusão</h3>
            <a 
              href={solicitacao.linkConclusao} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {solicitacao.linkConclusao}
            </a>
          </div>
        )}

        {/* Motivo de rejeição */}
        {solicitacao.motivoRejeicao && (
          <div className="mt-6">
            <h3 className="font-medium mb-2 text-red-600">Motivo da Rejeição</h3>
            <div className="bg-red-50 p-4 rounded-md border border-red-100 text-red-800">
              {solicitacao.motivoRejeicao}
            </div>
          </div>
        )}

        {/* Avaliação */}
        {solicitacao.avaliacao && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-medium mb-3">Sua Avaliação</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">A publicação foi entregue no prazo previsto?</p>
                <p>{solicitacao.avaliacao.entregaNoTempoEsperado ? 'Sim' : 'Não'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">A peça de comunicação atendeu as expectativas/objetivos?</p>
                <p>{solicitacao.avaliacao.atendeuExpectativas ? 'Sim' : 'Não'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qual o grau de satisfação com relação à peça de comunicação solicitada?</p>
                <p>{solicitacao.avaliacao.grauSatisfacao}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quais características você atribui à peça de comunicação?</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {solicitacao.avaliacao.caracteristicas.map((caracteristica, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {caracteristica}
                    </Badge>
                  ))}
                </div>
              </div>
              {solicitacao.avaliacao.outrasCaracteristicas && (
                <div>
                  <p className="text-sm text-gray-500">Outras características</p>
                  <p>{solicitacao.avaliacao.outrasCaracteristicas}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={() => navigate('/admin/triagem')} 
            className="bg-tcego-blue hover:bg-tcego-blue/90"
          >
            Voltar para Triagem
          </Button>
        </div>
      </div>
    </Layout>
  );
};

const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-500"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export default AdminVerSolicitacao;
