
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { isAdmin } = useAuth();

  return (
    <Layout title="Demandas da Comunicação" breadcrumbs={[]}>
      <div className="mb-6">
        <p className="text-gray-600 max-w-3xl">
          Gerenciador de Ordens de Solicitação para o Serviço de Comunicação do TCE-GO
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Solicitar Demanda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Solicite aqui sua nova demanda de comunicação.
            </p>
            <div className="flex justify-end">
              <Link 
                to="/minhas-solicitacoes" 
                className="bg-tcego-blue text-white px-4 py-2 rounded-md text-sm hover:bg-tcego-blue/90 transition-colors"
              >
                Acessar
              </Link>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Triagem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Gerencie aqui todas as solicitações de comunicação enviadas.
              </p>
              <div className="flex justify-end">
                <Link 
                  to="/admin/triagem" 
                  className="bg-tcego-blue text-white px-4 py-2 rounded-md text-sm hover:bg-tcego-blue/90 transition-colors"
                >
                  Acessar
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
