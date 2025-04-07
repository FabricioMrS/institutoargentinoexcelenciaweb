
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  title: string;
  category: string;
  main_category?: string;
  image: string;
  price: string;
  slug: string;
}

export const CourseCard = ({ title, category, main_category, image, price, slug }: CourseCardProps) => {
  const navigate = useNavigate();
  
  const getCategoryBadge = () => {
    if (main_category === 'medical') {
      return <Badge variant="default" className="bg-blue-600">Medicina</Badge>;
    } else if (main_category === 'professional') {
      return <Badge variant="default" className="bg-amber-600">Oficio</Badge>;
    }
    return <Badge variant="secondary">{category}</Badge>;
  };

  return (
    <Card className="overflow-hidden transition-transform hover:scale-105">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          {getCategoryBadge()}
        </div>
        <CardTitle className="text-lg mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full mb-4"
          onClick={() => navigate(`/curso/${slug}`)}
        >
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  );
};
