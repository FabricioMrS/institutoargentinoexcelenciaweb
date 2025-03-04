
import { Facebook, Instagram, X } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre Nosotros</h3>
            <p className="text-sm">
              Dedicados a proporcionar educación de calidad y accesible para todos.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/cursos" className="hover:text-secondary-hover transition-colors">
                  Cursos
                </Link>
              </li>
              <li>
                <Link to="/profesionales" className="hover:text-secondary-hover transition-colors">
                  Profesores
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-secondary-hover transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: institutoargentinoexcelencia@gmail.com</li>
              <li>Teléfono: (351) 8118268</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary-hover transition-colors">
                <Facebook />
              </a>
              <a href="#" className="hover:text-secondary-hover transition-colors">
                <X />
              </a>
              <a href="#" className="hover:text-secondary-hover transition-colors">
                <Instagram />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Tu Educación. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
