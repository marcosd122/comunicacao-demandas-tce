
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Solicitacao, SolicitacaoStatus } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from '@/components/FileUpload';

const AdminVerSolicitacao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [status, setStatus] = useState<SolicitacaoStatus>('Aguardando Atendimento');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [linkConclusao, setLinkConclusao] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['solicitacao', id],
    queryFn: () => api.getSolicitacao(id || '')
  });

  useEffect(() => {
    if (data) {
      setSolicitacao(data);
      setStatus(data.status);
      setMotivoRejeicao(data.motivoRejeicao || '');
      setLinkConclusao(data.linkConclusao || '');
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campo de motivo de rejeição
    if (status === 'Rejeitada' && !motivoRejeicao) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "O motivo da rejeição é obrigatório quando o status é Rejeitada",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulando upload de arquivos
      const anexosConclusao = files.map(file => ({
        id: Math.random().toString(36).substring(2, 11),
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString()
      }));
      
      await api.atualizarStatusSolicitacao(id!, status, {
        motivoRejeicao: status === 'Rejeitada' ? motivoRejeicao : undefined,
        linkConclusao: status === 'Concluída' ? linkConclusao : undefined,
        anexosConclusao: anexosConclusao.length > 0 ? anexosConclusao : undefined
      });
      
      toast({
        title: "Solicitação atualizada",
        description: `A solicitação foi atualizada para "${status}"`,
      });
      
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar a solicitação",
      });
    } finally {
      setIsSubmitting(false);
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
      <Layout title="Carregando..." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Carregando' }]}>
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
      title={solicitacao.tipo} 
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Triagem', href: '/admin/triagem' },
        { label: solicitacao.tipo }
      ]}
    >
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate('/admin/triagem')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-medium mb-4">Detalhes da Solicitação</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Solicitante</p>
                <p>{solicitacao.solicitante.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data da Solicitação</p>
                <p>{formatDateTime(solicitacao.dataSolicitacao)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo da Solicitação</p>
                <p>{`Solicitação de ${solicitacao.tipo}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Situação</p>
                <Badge className={getStatusColor(solicitacao.status)} variant="outline">
                  {solicitacao.status}
                </Badge>
              </div>
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
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Detalhes Específicos</h3>
            <div className="space-y-4">
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
              {solicitacao.tipoMaterial && (
                <div>
                  <p className="text-sm text-gray-500">Tipo de Material</p>
                  <p>{solicitacao.tipoMaterial}</p>
                </div>
              )}
              {solicitacao.publicoAlvo && (
                <div>
                  <p className="text-sm text-gray-500">Público Alvo</p>
                  <p>{solicitacao.publicoAlvo}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Aprovado pelo gestor</p>
                <p>{solicitacao.aprovadoGestor ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo específico por tipo */}
        <div className="mb-8">
          {solicitacao.mensagem && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Mensagem</h3>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {solicitacao.mensagem}
              </div>
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
          <div className="mb-8">
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

        {/* Formulário de atualização */}
        <form onSubmit={handleSubmit} className="mt-8 border-t pt-6">
          <h3 className="font-medium mb-4">Atualizar Solicitação</h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Situação
              </label>
              <Select 
                value={status} 
                onValueChange={(value) => setStatus(value as SolicitacaoStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aguardando Atendimento">Aguardando Atendimento</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Rejeitada">Rejeitada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {status === 'Rejeitada' && (
              <div>
                <label htmlFor="motivoRejeicao" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da Rejeição <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="motivoRejeicao"
                  value={motivoRejeicao}
                  onChange={(e) => setMotivoRejeicao(e.target.value)}
                  placeholder="Descreva o motivo da rejeição"
                  required={status === 'Rejeitada'}
                  className="w-full"
                  rows={3}
                />
              </div>
            )}

            {status === 'Concluída' && (
              <div>
                <label htmlFor="linkConclusao" className="block text-sm font-medium text-gray-700 mb-1">
                  Link de Conclusão
                </label>
                <Input
                  id="linkConclusao"
                  type="text"
                  value={linkConclusao}
                  onChange={(e) => setLinkConclusao(e.target.value)}
                  placeholder="Link para visualização do resultado (opcional)"
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anexar Arquivos
              </label>
              <FileUpload 
                onFilesChange={setFiles} 
                existingFiles={solicitacao.anexosConclusao}
              />
              <p className="text-xs text-gray-500 mt-1">
                Tipos de arquivos permitidos: imagem, áudio, zip, pdf, doc, xls, txt e zip. Cada arquivo tem limite de 100mb.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/triagem')}
                disabled={isSubmitting}
              >
                CANCELAR
              </Button>
              <Button 
                type="submit" 
                className="bg-tcego-blue hover:bg-tcego-blue/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SALVANDO...' : 'SALVAR'}
              </Button>
            </div>
          </div>
        </form>
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
