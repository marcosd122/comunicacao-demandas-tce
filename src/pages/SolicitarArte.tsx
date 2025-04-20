
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from '@/components/FileUpload';

const tiposMaterial = [
  'Arte Para Instagram/mapas/diagramas/quadros',
  'Certificado',
  'Convite para evento',
  'Crachá',
  'Folder',
  'Identidade Visual',
  'Newsletter',
  'Outdoor',
  'Papelaria (papel timbrado, capa de processo, etc)',
  'Outro'
];

const publicosAlvo = [
  'Aberto à Sociedade',
  'Servidores',
  'Jurisdicionados',
  'Órgãos de Controle',
  'Outro'
];

const SolicitarArte = () => {
  const [ramal, setRamal] = useState('');
  const [dataExpectativa, setDataExpectativa] = useState('');
  const [email, setEmail] = useState('');
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [detalhamento, setDetalhamento] = useState('');
  const [aprovadoGestor, setAprovadoGestor] = useState<boolean | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (aprovadoGestor === null) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Indique se a solicitação está aprovada pelo gestor imediato",
      });
      return;
    }

    // Validar data/hora de expectativa
    const expectativaDate = new Date(dataExpectativa);
    const now = new Date();
    
    // Verificar se é dia útil (simplificado para exemplo - apenas verifica finais de semana)
    const dayOfWeek = expectativaDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Verificar horário comercial (8h às 12h e 14h às 18h)
    const hours = expectativaDate.getHours();
    const isBusinessHours = (hours >= 8 && hours < 12) || (hours >= 14 && hours < 18);
    
    if (isWeekend || !isBusinessHours) {
      toast({
        variant: "destructive",
        title: "Erro na data/hora",
        description: "A expectativa de atendimento precisa ser em dia útil e horário comercial (08:00 - 12:00 / 14:00 - 18:00)",
      });
      return;
    }
    
    // Verificar se a solicitação está sendo feita com pelo menos 12 horas úteis de antecedência
    // Essa é uma simplificação para demonstração
    const diffHours = (expectativaDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 12) {
      toast({
        variant: "destructive",
        title: "Prazo insuficiente",
        description: "A solicitação deve ser feita com pelo menos 12 horas úteis de antecedência",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulando upload de arquivos
      const anexos = files.map(file => ({
        id: Math.random().toString(36).substring(2, 11),
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString()
      }));

      await api.criarSolicitacao({
        tipo: 'Arte/Material Gráfico',
        ramal,
        dataExpectativa,
        email,
        tipoMaterial,
        publicoAlvo,
        detalhamento,
        aprovadoGestor,
        anexos
      });

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de arte/material gráfico foi enviada com sucesso",
      });

      navigate('/minhas-solicitacoes');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Não foi possível enviar sua solicitação",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Arte/Material Gráfico"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Solicitar Demanda', href: '/minhas-solicitacoes' },
        { label: 'Arte/Material Gráfico' }
      ]}
    >
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <Label htmlFor="ramal">Ramal/WhatsApp para contato <span className="text-red-500">*</span></Label>
            <Input
              id="ramal"
              type="text"
              value={ramal}
              onChange={(e) => setRamal(e.target.value)}
              placeholder="Ex: 6299998888"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="dataExpectativa">Expectativa de atendimento <span className="text-red-500">*</span></Label>
            <Input
              id="dataExpectativa"
              type="datetime-local"
              value={dataExpectativa}
              onChange={(e) => setDataExpectativa(e.target.value)}
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              A expectativa de atendimento deve ser em dia útil e horário comercial (08:00 - 12:00 / 14:00 - 18:00) 
              e com pelo menos 12 horas úteis de antecedência.
            </p>
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@tce.go.gov.br"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="tipoMaterial">Tipo Material <span className="text-red-500">*</span></Label>
            <Select 
              value={tipoMaterial} 
              onValueChange={setTipoMaterial}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o tipo de material" />
              </SelectTrigger>
              <SelectContent>
                {tiposMaterial.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="publicoAlvo">Público alvo <span className="text-red-500">*</span></Label>
            <Select 
              value={publicoAlvo} 
              onValueChange={setPublicoAlvo}
              required
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o público alvo" />
              </SelectTrigger>
              <SelectContent>
                {publicosAlvo.map(publico => (
                  <SelectItem key={publico} value={publico}>
                    {publico}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="detalhamento">
              Detalhe Material <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="detalhamento"
              value={detalhamento}
              onChange={(e) => setDetalhamento(e.target.value)}
              placeholder="Descreva as expectativas e informações importantes para a criação do material."
              required
              className="mt-1 min-h-[120px]"
            />
          </div>

          <div>
            <Label>A solicitação está aprovada pelo gestor imediato? <span className="text-red-500">*</span></Label>
            <RadioGroup
              value={aprovadoGestor === null ? undefined : aprovadoGestor ? "sim" : "nao"}
              onValueChange={(value) => setAprovadoGestor(value === "sim")}
              className="flex space-x-6 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="gestor-sim" />
                <Label htmlFor="gestor-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="gestor-nao" />
                <Label htmlFor="gestor-nao">Não</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Anexar Arquivos</Label>
            <div className="mt-1">
              <FileUpload onFilesChange={setFiles} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tipos de arquivos permitidos: imagem, áudio, zip, pdf, doc, xls, txt e zip. Cada arquivo tem limite de 100mb.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/minhas-solicitacoes')}
              disabled={isSubmitting}
            >
              CANCELAR
            </Button>
            <Button 
              type="submit" 
              className="bg-tcego-blue hover:bg-tcego-blue/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SolicitarArte;
