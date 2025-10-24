import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { settings } = useSiteSettings();

  const navItems = [
    { path: "/", label: "Início" },
    { path: "/sobre", label: "Sobre" },
    { path: "/vantagens", label: "Vantagens" },
    { path: "/treinamentos", label: "Treinamentos" },
    { path: "/cursos", label: "Cursos" },
    { path: "/monitoramento", label: "Monitoramento" },
    { path: "/medicina", label: "Medicina" },
    { path: "/contato", label: "Contato" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            {settings.branding?.logoUrl ? (
              <img 
                src={settings.branding.logoUrl} 
                alt={settings.branding.siteName || "EVITARE"} 
                className="h-12 object-contain"
              />
            ) : (
              <div className="font-bold text-2xl text-primary">
                {settings.branding?.siteName || "EVITARE"}
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <UserCog className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            
            {/* Auth Buttons Mobile */}
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 hover:bg-muted rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCog className="inline mr-2 h-4 w-4" />
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/auth"
                className="block px-4 py-2 hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="inline mr-2 h-4 w-4" />
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
