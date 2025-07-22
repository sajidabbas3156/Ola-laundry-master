
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { title: "Features", href: "/features" },
    { title: "Pricing", href: "/pricing" },
    { title: "About", href: "/about" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
    { title: "Help Center", href: "/help" },
    { title: "Mobile App", href: "/mobile-app" },
    { title: "Integrations", href: "/integrations" },
    { title: "API", href: "/api-docs" },
  ];

  const handleStartTrial = () => {
    navigate("/register");
    setIsOpen(false);
  };

  const handleLogin = () => {
    navigate("/select-tenant");
    setIsOpen(false);
  };

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/landing" className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/d8b7a3ec-1ecf-4f9e-b57a-6329f0b4a2b4.png" 
            alt="OLA Laundry" 
            className="h-10 w-auto"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-ola-600 to-ola-700 bg-clip-text text-transparent">Ola Laundry</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.slice(0, 4).map((item) => (
            <button 
              key={item.title} 
              onClick={() => handleNavClick(item.href)}
              className="text-gray-600 hover:text-ola-600 transition-colors"
            >
              {item.title}
            </button>
          ))}
          <button 
            onClick={handleLogin}
            className="text-gray-600 hover:text-ola-600 transition-colors"
          >
            Login
          </button>
          <Button 
            onClick={handleStartTrial}
            className="bg-gradient-to-r from-ola-600 to-ola-700 hover:from-ola-700 hover:to-ola-800"
          >
            Start Free Trial
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <button 
                    key={item.title} 
                    onClick={() => handleNavClick(item.href)}
                    className="text-lg font-medium text-gray-700 hover:text-ola-600 transition-colors text-left"
                  >
                    {item.title}
                  </button>
                ))}
                <button 
                  onClick={handleLogin}
                  className="text-lg font-medium text-gray-700 hover:text-ola-600 transition-colors text-left"
                >
                  Login
                </button>
                <Button 
                  onClick={handleStartTrial}
                  className="w-full bg-gradient-to-r from-ola-600 to-ola-700 hover:from-ola-700 hover:to-ola-800"
                >
                  Start Free Trial
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
