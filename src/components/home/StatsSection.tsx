import { useEffect, useRef, useState } from 'react';
import { BookOpen, Users, GraduationCap, Award } from 'lucide-react';

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  number: number;
  label: string;
  suffix?: string;
}

const StatItem = ({ icon: Icon, number, label, suffix = '' }: StatItemProps) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = number / (duration / 16);
          
          const animate = () => {
            start += increment;
            if (start < number) {
              setCurrentNumber(Math.floor(start));
              requestAnimationFrame(animate);
            } else {
              setCurrentNumber(number);
            }
          };
          
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [number, hasAnimated]);

  return (
    <div 
      ref={ref}
      className="flex flex-col items-center p-6 bg-white dark:bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="mb-4 p-3 bg-primary/10 dark:bg-secondary/10 rounded-full">
        <Icon className="w-8 h-8 text-primary dark:text-secondary" />
      </div>
      <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        {currentNumber.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
        {label}
      </div>
    </div>
  );
};

export const StatsSection = () => {
  const stats = [
    {
      icon: BookOpen,
      number: 40,
      label: "Cursos Activos",
      suffix: "+"
    },
    {
      icon: Users,
      number: 15,
      label: "Profesores Expertos",
      suffix: "+"
    },
    {
      icon: GraduationCap,
      number: 900,
      label: "Estudiantes Satisfechos",
      suffix: "+"
    },
    {
      icon: Award,
      number: 150,
      label: "Cursos Completados",
      suffix: "+"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-secondary mb-4">
            Nuestros Logros
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Cientos de profesionales comprometidos con la excelencia, preparados en una amplia variedad de áreas del conocimiento
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
};