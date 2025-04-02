
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

const Nosotros = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero section with theme toggle */}
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-0 animate-fadeIn">
              Nosotros
            </h1>
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors"
              aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="space-y-12">
            {/* Main section with mission statement - updated with brighter colors */}
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 animate-fadeIn">
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="w-40 h-40 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center p-4 border-2 border-secondary">
                      <img 
                        src="/lovable-uploads/332a7955-3409-4607-9f07-dc6d9556d6dc.png" 
                        alt="Instituto Argentino Excelencia" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
                      Nuestra Misión
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      En Instituto Argentino Excelencia ofrecemos servicios educativos especializados para la 
                      preparación de estudiantes universitarios en instancias evaluativas y de cursado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services section - updated with brighter gradients */}
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 animate-fadeIn">
              <CardContent className="p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                  Nuestros Servicios
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-medium text-primary mb-3">Preparación Universitaria</h3>
                    <p className="text-muted-foreground">
                      Servicios especializados para la preparación de estudiantes universitarios en instancias 
                      evaluativas y de cursado, brindando herramientas y estrategias para el éxito académico.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border border-secondary/20 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-medium text-primary mb-3">Formación Profesional</h3>
                    <p className="text-muted-foreground">
                      Cursos dirigidos a personas que buscan adquirir herramientas prácticas y competencias 
                      claves para el mercado actual, en distintos niveles educativos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Values section - updated with attractive gradients */}
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 animate-fadeIn">
              <CardContent className="p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                  Nuestros Valores
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { title: "Excelencia", description: "Compromiso con los más altos estándares educativos" },
                    { title: "Innovación", description: "Métodos de enseñanza adaptados a las necesidades actuales" },
                    { title: "Personalización", description: "Atención a las necesidades individuales de cada estudiante" },
                    { title: "Practicidad", description: "Enfoque en herramientas aplicables al mundo real" }
                  ].map((value, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-4 bg-white dark:bg-gray-800/30 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/30 dark:from-primary/20 dark:to-secondary/40 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl text-primary font-bold">{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-medium text-primary mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA section - NEW */}
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 animate-fadeIn">
              <CardContent className="p-8 md:p-10 text-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
                  ¿Listo para comenzar tu formación?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Contáctanos hoy mismo y descubre cómo podemos ayudarte a alcanzar tus metas educativas y profesionales.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <WhatsAppButton message="¡Hola! Me gustaría información sobre los servicios educativos que ofrecen." />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton floating={true} />
    </div>
  );
};

export default Nosotros;

