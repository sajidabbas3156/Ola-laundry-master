
import { Link } from "react-router-dom";

export function Footer() {
  const sections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Integrations", href: "/integrations" },
        { name: "API", href: "/api-docs" },
        { name: "Mobile App", href: "/mobile-app" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
        { name: "Help Center", href: "/help" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "API Documentation", href: "/api-docs" },
        { name: "Contact Support", href: "/contact" },
        { name: "Mobile App", href: "/mobile-app" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/landing" className="flex items-center mb-6">
              <div className="h-10 w-10 bg-gradient-to-r from-ola-600 to-ola-700 rounded-md flex items-center justify-center text-white font-bold text-xl">
                O
              </div>
              <h2 className="ml-2 text-xl font-bold">Ola Laundry</h2>
            </Link>
            <p className="text-gray-400 mb-6">
              The complete management platform for modern laundry businesses. Trusted by 10,000+ businesses worldwide.
            </p>
            <div className="flex space-x-4">
              {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-ola-600 transition-colors">
                    <span className="text-xs">{social[0].toUpperCase()}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">© 2025 Ola Laundry. All rights reserved.</p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/help" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/help" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/help" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
