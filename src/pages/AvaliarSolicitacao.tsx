
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Solicitacao, Avaliacao } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const caracteristicasOptions = [
  { value: 'Objetiva', label: 'Objetiva' },
  { value: 'Assertiva', label: 'Assertiva' },
  { value: 'Criativa', label: 'Criativa' },
  { value: 'Básica', label: 'Básica' },
  { value: 'Nenhuma das anteriores', label: 'Nenhuma das anteriores' },
  { value: 'Outras', label: 'Outras' }
];

const AvaliarSolicitacao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [entregaNoTempoEsperado, setEntregaNoTempoEsperado] = useState<boolean | null>(null);
  const [atendeuExpectativas, setAtendeuExpectativas] = useState<boolean | null>(null);
  const [grauSatisfacao, setGrauSatisfacao] = useState<string>('');
  const [caracteristicas, setCaracteristicas] = useState<string[]>([]);
  const [outrasCaracteristicas, setOutrasCaracteristicas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['solicitacao', id],
    queryFn: () => api.getSolicitacao(id || '')
  });

  useEffect(() => {
    if (data) {
      setSolicitacao(data);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (entregaNoTempoEsperado === null) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Informe se a publicação foi entregue no prazo previsto",
      });
      return;
    }

    if (atendeuExpectativas === null) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Informe se a peça de comunicação atendeu as expectativas/objetivos",
      });
      return;
    }

    if (!grauSatisfacao) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Informe o grau de satisfação",
      });
      return;
    }

    if (caracteristicas.length === 0) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Selecione pelo menos uma característica",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.avaliarSolicitacao(id!, {
        entregaNoTempoEsperado,
        atendeuExpectativas,
        grauSatisfacao: grauSatisfacao as Avaliacao['grauSatisfacao'],
        caracteristicas,
        outrasCaracteristicas: outrasCaracteristicas || undefined
      });

      toast({
        title: "Avaliação enviada",
        description: "Sua avaliação foi registrada com sucesso",
      });

      navigate('/minhas-solicitacoes');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Não foi possível enviar sua avaliação",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Carregando..." breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Avaliando Solicitação' }]}>
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
          <Button onClick={() => navigate('/minhas-solicitacoes')}>Voltar</Button>
        </div>
      </Layout>
    );
  }

  // Se já existe avaliação, não permitir nova
  if (solicitacao.avaliacao) {
    return (
      <Layout title="Avaliação já realizada" breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Avaliação' }]}>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="mb-4">Esta solicitação já foi avaliada</p>
          <Button onClick={() => navigate('/minhas-solicitacoes')}>Voltar para Solicitações</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Avaliar Solicitação" 
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Minhas Solicitações', href: '/minhas-solicitacoes' },
        { label: 'Avaliar Solicitação' }
      ]}
    >
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate('/minhas-solicitacoes')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h3 className="text-lg font-medium mb-4">Avaliação da Solicitação</h3>
            <p className="text-gray-500 mb-6">
              Avalie a qualidade e eficácia do serviço de comunicação recebido
            </p>
          </div>

          <div>
            <Label className="text-base font-medium">
              1. A publicação foi entregue no prazo previsto?
            </Label>
            <RadioGroup
              value={entregaNoTempoEsperado === null ? undefined : entregaNoTempoEsperado ? "sim" : "nao"}
              onValueChange={(value) => setEntregaNoTempoEsperado(value === "sim")}
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="prazo-sim" />
                <Label htmlFor="prazo-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="prazo-nao" />
                <Label htmlFor="prazo-nao">Não</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">
              2. A peça de comunicação atendeu as expectativas/objetivos?
            </Label>
            <RadioGroup
              value={atendeuExpectativas === null ? undefined : atendeuExpectativas ? "sim" : "nao"}
              onValueChange={(value) => setAtendeuExpectativas(value === "sim")}
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="expectativas-sim" />
                <Label htmlFor="expectativas-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="expectativas-nao" />
                <Label htmlFor="expectativas-nao">Não</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">
              3. Qual o grau de satisfação com relação à peça de comunicação solicitada?
            </Label>
            <RadioGroup
              value={grauSatisfacao}
              onValueChange={setGrauSatisfacao}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Não Satisfeito" id="grau-nao-satisfeito" />
                <Label htmlFor="grau-nao-satisfeito">Não Satisfeito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Satisfeito" id="grau-satisfeito" />
                <Label htmlFor="grau-satisfeito">Satisfeito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Parcialmente Satisfeito" id="grau-parcialmente" />
                <Label htmlFor="grau-parcialmente">Parcialmente Satisfeito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Não Satisfeito" id="grau-muito-satisfeito" />
                <Label htmlFor="grau-muito-satisfeito">Não Satisfeito</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">
              4. Quais as características você atribui à peça de comunicação?
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {caracteristicasOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`caracteristica-${option.value}`} 
                    checked={caracteristicas.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCaracteristicas([...caracteristicas, option.value]);
                      } else {
                        setCaracteristicas(
                          caracteristicas.filter((item) => item !== option.value)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`caracteristica-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {caracteristicas.includes('Outras') && (
            <div>
              <Label htmlFor="outras-caracteristicas">Outras características</Label>
              <Textarea
                id="outras-caracteristicas"
                value={outrasCaracteristicas}
                onChange={(e) => setOutrasCaracteristicas(e.target.value)}
                placeholder="Descreva outras características"
                className="mt-1"
              />
            </div>
          )}

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

export default AvaliarSolicitacao;
