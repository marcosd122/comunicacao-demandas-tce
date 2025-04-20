
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
import FileUpload from '@/components/FileUpload';

const SolicitarCobertura = () => {
  const [ramal, setRamal] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [descricaoEvento, setDescricaoEvento] = useState('');
  const [localEvento, setLocalEvento] = useState('');
  const [numeroParticipantes, setNumeroParticipantes] = useState('');
  const [membrosPresentes, setMembrosPresentes] = useState('');
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

    // Validar data/hora do evento
    const eventoDate = new Date(dataEvento);
    const now = new Date();
    
    // Verificar se é dia útil (simplificado para exemplo - apenas verifica finais de semana)
    const dayOfWeek = eventoDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Verificar horário comercial (8h às 12h e 14h às 18h)
    const hours = eventoDate.getHours();
    const isBusinessHours = (hours >= 8 && hours < 12) || (hours >= 14 && hours < 18);
    
    if (isWeekend || !isBusinessHours) {
      toast({
        variant: "destructive",
        title: "Erro na data/hora",
        description: "A data/hora do evento precisa ser em dia útil e horário comercial (08:00 - 12:00 / 14:00 - 18:00)",
      });
      return;
    }
    
    // Verificar se a solicitação está sendo feita com pelo menos 12 horas úteis de antecedência
    // Essa é uma simplificação para demonstração
    const diffHours = (eventoDate.getTime() - now.getTime()) / (1000 * 60 * 60);
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
        tipo: 'Cobertura',
        ramal,
        dataEvento,
        descricaoEvento,
        localEvento,
        numeroParticipantes,
        membrosPresentes,
        aprovadoGestor,
        anexos
      });

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de cobertura foi enviada com sucesso",
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
      title="Cobertura"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Solicitar Demanda', href: '/minhas-solicitacoes' },
        { label: 'Cobertura' }
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
            <Label htmlFor="dataEvento">Data/Hora do Evento <span className="text-red-500">*</span></Label>
            <Input
              id="dataEvento"
              type="datetime-local"
              value={dataEvento}
              onChange={(e) => setDataEvento(e.target.value)}
              required
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              A data/hora do evento deve ser em dia útil e horário comercial (08:00 - 12:00 / 14:00 - 18:00) 
              e a solicitação deve ser feita com pelo menos 12 horas úteis de antecedência.
            </p>
          </div>

          <div>
            <Label htmlFor="descricaoEvento">Descrição do Evento</Label>
            <Textarea
              id="descricaoEvento"
              value={descricaoEvento}
              onChange={(e) => setDescricaoEvento(e.target.value)}
              placeholder="Descreva os detalhes do evento"
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="localEvento">Local</Label>
            <Input
              id="localEvento"
              type="text"
              value={localEvento}
              onChange={(e) => setLocalEvento(e.target.value)}
              placeholder="Local onde será realizado o evento"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="numeroParticipantes">Número Participantes</Label>
            <Input
              id="numeroParticipantes"
              type="text"
              value={numeroParticipantes}
              onChange={(e) => setNumeroParticipantes(e.target.value)}
              placeholder="Quantidade estimada de participantes"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="membrosPresentes">Membros Presentes</Label>
            <Input
              id="membrosPresentes"
              type="text"
              value={membrosPresentes}
              onChange={(e) => setMembrosPresentes(e.target.value)}
              placeholder="Informe os membros que estarão presentes no evento"
              className="mt-1"
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

export default SolicitarCobertura;
