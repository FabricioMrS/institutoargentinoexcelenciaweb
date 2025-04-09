
import { Monitor, Users, Clock, Award } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";

const features = [
  {
    Icon: Monitor,
    title: "Clases Online en Vivo",
    description: "Participa en clases interactivas desde cualquier lugar.",
  },
  {
    Icon: Users,
    title: "Comunidad de Aprendizaje",
    description: "Conecta con estudiantes y profesionales del sector.",
  },
  {
    Icon: Clock,
    title: "Flexibilidad Horaria",
    description: "Adapta tu aprendizaje a tu ritmo de vida.",
  },
  {
    Icon: Award,
    title: "Certificación Oficial",
    description: "Obtén un certificado reconocido al finalizar el curso.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">
          ¿Por qué elegirnos?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              Icon={feature.Icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
