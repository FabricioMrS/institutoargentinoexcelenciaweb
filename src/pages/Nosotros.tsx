
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";

const Nosotros = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 animate-fadeIn">
            Nosotros
          </h1>
          
          <div className="space-y-12">
            {/* Main section with mission statement */}
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 animate-fadeIn">
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="w-40 h-40 rounded-full bg-secondary/10 flex items-center justify-center p-4">
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

            {/* Services section */}
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-primary/5 to-white dark:from-primary/20 dark:to-gray-800 animate-fadeIn">
              <CardContent className="p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                  Nuestros Servicios
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-secondary/20">
                    <h3 className="text-xl font-medium text-primary mb-3">Preparación Universitaria</h3>
                    <p className="text-muted-foreground">
                      Servicios especializados para la preparación de estudiantes universitarios en instancias 
                      evaluativas y de cursado, brindando herramientas y estrategias para el éxito académico.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-secondary/20">
                    <h3 className="text-xl font-medium text-primary mb-3">Formación Profesional</h3>
                    <p className="text-muted-foreground">
                      Cursos dirigidos a personas que buscan adquirir herramientas prácticas y competencias 
                      claves para el mercado actual, en distintos niveles educativos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Values section */}
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-secondary/10 to-white dark:from-secondary/20 dark:to-gray-800 animate-fadeIn">
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
                    <div key={index} className="flex flex-col items-center text-center p-4">
                      <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl text-primary font-bold">{index + 1}</span>
                      </div>
                      <h3 className="text-lg font-medium text-primary mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Nosotros;
