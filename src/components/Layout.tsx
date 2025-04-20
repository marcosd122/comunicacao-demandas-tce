
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  FileText, 
  Clipboard,
  LogOut 
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

const Layout = ({ children, title, breadcrumbs = [] }: LayoutProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/c1c22ad4-c3df-4551-84a6-a148e1fce23b.png" 
                  alt="TCE-GO Logo" 
                  className="h-10" 
                />
                <div className="ml-3">
                  <div className="text-tcego-blue font-bold text-lg">TCE-GO</div>
                  <div className="text-xs text-gray-500">Tribunal de Contas do Estado de Goiás</div>
                </div>
              </div>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right mr-4">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <nav className="mt-8 px-4">
            <div className="text-xs uppercase text-gray-500 font-semibold px-2 mb-2">MENU</div>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  className="flex items-center px-2 py-2 text-sm rounded-md text-gray-700 hover:bg-tcego-lightblue hover:text-tcego-blue"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/minhas-solicitacoes"
                  className="flex items-center px-2 py-2 text-sm rounded-md text-gray-700 hover:bg-tcego-lightblue hover:text-tcego-blue"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Solicitar Demanda
                </Link>
              </li>
              
              {isAdmin && (
                <li>
                  <Link
                    to="/admin/triagem"
                    className="flex items-center px-2 py-2 text-sm rounded-md text-gray-700 hover:bg-tcego-lightblue hover:text-tcego-blue"
                  >
                    <Clipboard className="mr-3 h-5 w-5" />
                    Triagem
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="text-sm mb-4">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/" className="text-tcego-blue hover:text-tcego-blue/80">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-gray-500">/</span>
                    {item.href ? (
                      <Link to={item.href} className="text-tcego-blue hover:text-tcego-blue/80 ml-2">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-gray-500 ml-2">{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
